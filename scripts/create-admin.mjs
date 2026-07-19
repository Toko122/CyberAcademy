import { randomBytes, scrypt as scryptCallback } from "node:crypto";
import { promisify } from "node:util";
import nextEnv from "@next/env";
import pg from "pg";

const { loadEnvConfig } = nextEnv;
const { Pool } = pg;
const scrypt = promisify(scryptCallback);

loadEnvConfig(process.cwd());

async function hashPassword(password) {
  if (password.length < 12 || password.length > 128) {
    throw new Error("ADMIN_PASSWORD must be between 12 and 128 characters");
  }
  const salt = randomBytes(16);
  const hash = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1 });
  return `scrypt$16384$8$1$${salt.toString("base64")}$${hash.toString("base64")}`;
}

async function main() {
  const connectionString = process.env.DB_URL;
  const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
  const password = process.env.ADMIN_PASSWORD;
  if (!connectionString || !email || !password) {
    throw new Error("DB_URL, ADMIN_EMAIL, and ADMIN_PASSWORD are required");
  }
  const pool = new Pool({
    connectionString,
    ssl: process.env.DB_SSL?.toLowerCase() === "require" ? { rejectUnauthorized: true } : false,
  });
  try {
    const passwordHash = await hashPassword(password);
    const result = await pool.query(
      `INSERT INTO public.users (email, password, role)
       VALUES ($1, $2, 'admin')
       ON CONFLICT (email) DO UPDATE
       SET password = EXCLUDED.password, role = 'admin'
       RETURNING id, email::text AS email, role, created_at, updated_at`,
      [email, passwordHash]
    );
    process.stdout.write(`${JSON.stringify(result.rows[0])}\n`);
  } finally {
    await pool.end();
  }
}

main().catch((error) => {
  process.stderr.write(`Admin provisioning failed: ${error.message}\n`);
  process.exitCode = 1;
});
