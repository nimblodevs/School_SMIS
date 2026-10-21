import "dotenv/config";
import { generateKeyPairSync } from "node:crypto";
import { z } from "zod";
import { parseTrustProxy } from "./trust-proxy.js";

function normalizePem(value) {
  return value?.replaceAll("\\n", "\n");
}

let testKeyPair;

function getTestKeyPair() {
  testKeyPair ??= generateKeyPairSync("rsa", {
    modulusLength: 2048,
    privateKeyEncoding: { type: "pkcs8", format: "pem" },
    publicKeyEncoding: { type: "spki", format: "pem" },
  });
  return testKeyPair;
}

const envSchema = z.object({
  PORT: z.coerce.number().int().min(1).max(65535).default(5000),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  DATABASE_URL: z.string().url(),
  JWT_PRIVATE_KEY: z.string().optional(),
  JWT_PUBLIC_KEY: z.string().optional(),
  JWT_EXPIRES_IN: z.string().default("10m"),
  REFRESH_TOKEN_EXPIRES_DAYS: z.coerce
    .number()
    .int()
    .min(1)
    .max(90)
    .default(30),
  JWT_ISSUER: z.string().default("school-smis-api"),
  JWT_AUDIENCE: z.string().default("school-smis-client"),
  CLIENT_ORIGINS: z.string().default("http://localhost:3000"),
  // Base URL used when building a school's portal address during onboarding.
  SCHOOL_PORTAL_BASE_URL: z.string().url().default("https://schools.smis.app"),
  LOCAL_UPLOAD_DIR: z.string().default("./uploads"),
  TRUST_PROXY: z
    .preprocess(
      (value, context) => {
        try {
          return parseTrustProxy(value);
        } catch (error) {
          context.addIssue({ code: "custom", message: error.message });
          return z.NEVER;
        }
      },
      z.union([
        z.boolean(),
        z.number().int().nonnegative(),
        z.string().min(1),
        z.array(z.string().min(1)),
      ]),
    )
    .default(false),
  LOGIN_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(5),
  LOGIN_LOCKOUT_MINUTES: z.coerce.number().int().min(1).max(1440).default(15),
  LOGIN_RATE_LIMIT_WINDOW_MINUTES: z.coerce
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(15),
  LOGIN_RATE_LIMIT_PER_IP: z.coerce.number().int().min(1).max(100).default(10),
  REFRESH_RATE_LIMIT_PER_IP: z.coerce
    .number()
    .int()
    .min(1)
    .max(300)
    .default(30),
  LOGIN_RATE_LIMIT_PER_IDENTIFIER: z.coerce
    .number()
    .int()
    .min(1)
    .max(100)
    .default(5),
  OTP_MAX_ATTEMPTS: z.coerce.number().int().min(1).max(20).default(10),
  OTP_RATE_LIMIT_PER_USER: z.coerce.number().int().min(1).max(100).default(10),
  OTP_RESEND_LIMIT: z.coerce.number().int().min(1).max(20).default(3),
  OTP_RESEND_WINDOW_MINUTES: z.coerce
    .number()
    .int()
    .min(1)
    .max(1440)
    .default(10),
  LOG_LEVEL: z
    .enum(["fatal", "error", "warn", "info", "debug", "trace", "silent"])
    .default("info"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().int().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASSWORD: z.string().optional(),
  SMTP_FROM: z.string().optional(),
  GMAIL_HOST: z.string().optional(),
  GMAIL_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  GMAIL_USER: z.string().optional(),
  GMAIL_PASSWORD: z.string().optional(),
  GMAIL_FROM: z.string().optional(),
  OUTLOOK_HOST: z.string().optional(),
  OUTLOOK_PORT: z.coerce.number().int().min(1).max(65535).optional(),
  OUTLOOK_USER: z.string().optional(),
  OUTLOOK_PASSWORD: z.string().optional(),
  OUTLOOK_FROM: z.string().optional(),
  PASSWORD_RESET_OTP_MINUTES: z.coerce
    .number()
    .int()
    .min(1)
    .max(30)
    .default(10),
  LOGIN_OTP_MINUTES: z.coerce.number().int().min(1).max(10).default(3),
  AUTH_OTP_PEPPER: z.string().min(32).optional(),
  // Neon Object Storage (AWS_* credential vars are read from process.env by the Files SDK adapter).
  OBJECT_STORAGE_BUCKET: z.string().default("assets"),
  OTEL_SERVICE_NAME: z.string().default("school-smis-api"),
  OTEL_EXPORTER_OTLP_ENDPOINT: z.string().url().optional(),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error("Invalid environment variables:", parsed.error.format());
  process.exit(1);
}

export const env = parsed.data;

// Keep legacy Gmail variable names working while SMTP_* remains canonical.
env.SMTP_HOST ??= env.GMAIL_HOST;
env.SMTP_USER ??= env.GMAIL_USER;
env.SMTP_PASSWORD ??= env.GMAIL_PASSWORD;

const hasBothJwtKeys = Boolean(env.JWT_PRIVATE_KEY && env.JWT_PUBLIC_KEY);
const hasOneJwtKey =
  Boolean(env.JWT_PRIVATE_KEY) !== Boolean(env.JWT_PUBLIC_KEY);
const jwtPrivateKey = normalizePem(env.JWT_PRIVATE_KEY);
const jwtPublicKey = normalizePem(env.JWT_PUBLIC_KEY);

if (hasOneJwtKey || (env.NODE_ENV === "production" && !hasBothJwtKeys)) {
  console.error(
    "Set both JWT_PRIVATE_KEY and JWT_PUBLIC_KEY, or omit both outside production.",
  );
  process.exit(1);
}

if (!hasBothJwtKeys && env.NODE_ENV !== "production") {
  Object.defineProperties(env, {
    JWT_PRIVATE_KEY: {
      configurable: true,
      get: () => jwtPrivateKey ?? getTestKeyPair().privateKey,
    },
    JWT_PUBLIC_KEY: {
      configurable: true,
      get: () => jwtPublicKey ?? getTestKeyPair().publicKey,
    },
  });
} else {
  env.JWT_PRIVATE_KEY = jwtPrivateKey;
  env.JWT_PUBLIC_KEY = jwtPublicKey;
}
