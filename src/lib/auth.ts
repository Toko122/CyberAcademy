import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";
import { query } from "@/lib/db";
import { createHash, randomBytes, scrypt as scryptCallback, timingSafeEqual } from "crypto";
import { serverEnv } from "@/lib/env";
function scrypt(password: string, salt: Buffer, length: number, options: { N: number; r: number; p: number }) {
  return new Promise<Buffer>((resolve, reject) => {
    scryptCallback(password, salt, length, options, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}
export const SESSION_COOKIE = "admin_token";
const SESSION_ISSUER = "cyber-academy";
const SESSION_AUDIENCE = "cyber-academy-admin";

export type AppRole = "user" | "admin";
export interface AuthenticatedUser {
  id: string;
  email: string;
  role: AppRole;
}

function jwtSecret() {
  return new TextEncoder().encode(serverEnv.jwtSecret);
}

export async function hashPassword(password: string): Promise<string> {
  if (password.length < 12 || password.length > 128) {
    throw new Error("Password must be between 12 and 128 characters");
  }
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${derived.toString("base64")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const [algorithm, n, r, p, saltText, hashText] = stored.split("$");
  if (algorithm !== "scrypt" || !n || !r || !p || !saltText || !hashText) return false;
  try {
    const expected = Buffer.from(hashText, "base64");
    const actual = await scrypt(password, Buffer.from(saltText, "base64"), expected.length, {
      N: Number(n), r: Number(r), p: Number(p),
    });
    return expected.length === actual.length && timingSafeEqual(expected, actual);
  } catch {
    return false;
  }
}

export async function authenticateAdmin(email: string, password: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (!normalizedEmail || !password) return null;
  const result = await query<AuthenticatedUser & { password: string; bcrypt_matches: boolean }>(
    `SELECT id, email::text AS email, role, password,
            CASE
              WHEN password LIKE '$2a$%' OR password LIKE '$2b$%' OR password LIKE '$2y$%'
              THEN password = crypt($2, password)
              ELSE false
            END AS bcrypt_matches
     FROM public.users
     WHERE email = $1 AND role = 'admin'
     LIMIT 1`,
    [normalizedEmail, password]
  );
  const user = result.rows[0];
  if (!user) return null;
  const passwordMatches = user.bcrypt_matches || await verifyPassword(password, user.password);
  if (!passwordMatches) return null;
  return { id: user.id, email: user.email, role: user.role } satisfies AuthenticatedUser;
}

export async function createSessionToken(user: AuthenticatedUser): Promise<string> {
  return new SignJWT({ role: user.role, email_hash: createHash("sha256").update(user.email).digest("hex") })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(user.id)
    .setIssuer(SESSION_ISSUER)
    .setAudience(SESSION_AUDIENCE)
    .setIssuedAt()
    .setExpirationTime("8h")
    .sign(jwtSecret());
}

export async function verifySessionToken(token?: string): Promise<{ id: string; role: AppRole } | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, jwtSecret(), {
      issuer: SESSION_ISSUER,
      audience: SESSION_AUDIENCE,
    });
    if (typeof payload.sub !== "string" || (payload.role !== "admin" && payload.role !== "user")) return null;
    return { id: payload.sub, role: payload.role };
  } catch {
    return null;
  }
}

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const session = await verifySessionToken(cookies().get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const result = await query<AuthenticatedUser>(
    `SELECT id, email::text AS email, role FROM public.users WHERE id = $1 LIMIT 1`,
    [session.id]
  );
  return result.rows[0] ?? null;
}

export async function requireAdmin(): Promise<AuthenticatedUser | null> {
  const user = await getAuthenticatedUser();
  return user?.role === "admin" ? user : null;
}
