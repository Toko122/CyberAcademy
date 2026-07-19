import "server-only";

type DbSslMode = "disable" | "require";

function required(name: string, value: string | undefined, minimumLength = 1): string {
  if (!value || value.length < minimumLength) {
    throw new Error(`${name} is required${minimumLength > 1 ? ` and must contain at least ${minimumLength} characters` : ""}`);
  }
  return value;
}

function dbSslMode(value: string | undefined): DbSslMode {
  if (!value || value === "disable") return "disable";
  if (value === "require") return "require";
  throw new Error("DB_SSL must be either 'disable' or 'require'");
}

export const serverEnv = Object.freeze({
  databaseUrl: required("DB_URL", process.env.DB_URL),
  dbSsl: dbSslMode(process.env.DB_SSL?.toLowerCase()),
  jwtSecret: required("JWT", process.env.JWT, 32),
  isProduction: process.env.NODE_ENV === "production",
});

export function requireCloudinaryEnv() {
  return Object.freeze({
    cloudName: required("CLOUDY_NAME", process.env.CLOUDY_NAME),
    apiKey: required("CLOUDY_API_KEY", process.env.CLOUDY_API_KEY),
    apiSecret: required("CLOUDY_SECRET", process.env.CLOUDY_SECRET),
  });
}

