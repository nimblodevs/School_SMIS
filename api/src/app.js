import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import pino from "pino";
import pinoHttp from "pino-http";
import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { env } from "./config/env.js";
import authModuleRouter from "./modules/auth/auth.router.js";
import schoolModuleRouter from "./modules/schools/school.router.js";
import onboardingModuleRouter from "./modules/onboarding/onboarding.router.js";
import userModuleRouter from "./modules/users/user.router.js";
import { rlsContextMiddleware } from "./middlewares/rlsContextMiddleware.js";
import { AppError } from "./shared/errors/AppError.js";

const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  redact: ["req.headers.authorization", "req.headers.cookie"],
  ...(process.env.NODE_ENV === "development"
    ? {
        transport: {
          target: "pino-pretty",
          options: { colorize: true, translateTime: "SYS:standard" },
        },
      }
    : {}),
});

const openApiDocument = swaggerJSDoc({
  definition: {
    openapi: "3.0.3",
    info: {
      title: "School SMIS API",
      version: "1.0.0",
      description:
        "Development API for school onboarding, profile, branches, logos, directory search, and PDF export.",
    },
    servers: [{ url: "/api" }],
  },
  apis: ["./src/modules/**/*.js"],
});

function getTrustedProxySetting() {
  const value = process.env.TRUST_PROXY?.trim();
  if (!value) return undefined;

  if (value.toLowerCase() === "false") return false;
  if (value.toLowerCase() === "true") {
    throw new Error(
      "TRUST_PROXY=true is not allowed; configure an exact hop count or trusted proxy IP/CIDR list.",
    );
  }
  if (/^\d+$/.test(value)) return Number(value);

  const addresses = value.split(",").map((address) => address.trim());
  if (addresses.some((address) => !address)) {
    throw new Error(
      "TRUST_PROXY must be a hop count or a comma-separated list of trusted proxy addresses/CIDRs.",
    );
  }
  return addresses;
}

export function createApp(options = {}) {
  const app = express();
  const allowedOrigins = (process.env.WEB_ORIGIN || "http://localhost:5173")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);
  const requestLogger = options.logger || logger;

  app.disable("x-powered-by");
  const trustedProxySetting = getTrustedProxySetting();
  if (trustedProxySetting !== undefined)
    app.set("trust proxy", trustedProxySetting);
  app.use(helmet());
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
          return;
        }
        callback(new Error("Origin is not permitted by the API CORS policy."));
      },
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
      credentials: true,
      maxAge: 600,
    }),
  );
  app.use(hpp());
  app.use(express.json({ limit: "1mb" }));
  app.use(express.urlencoded({ extended: false, limit: "1mb" }));
  app.use(
    pinoHttp({
      logger: requestLogger,
      autoLogging: { ignore: (request) => request.url === "/api/health" },
      customLogLevel: (_request, response, error) => {
        if (error || response.statusCode >= 500) return "error";
        if (response.statusCode >= 400) return "warn";
        return "info";
      },
    }),
  );

  app.get("/api/health", (_request, response) => {
    response.json({ status: "ok", service: "school-smis-api" });
  });
  app.get("/api/openapi.json", (_request, response) =>
    response.json(openApiDocument),
  );
  app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  if (env.NODE_ENV !== "test") app.use("/api", rlsContextMiddleware);

  const authRateLimit = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 20,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    message: {
      error: {
        code: "RATE_LIMITED",
        message: "Too many authentication requests. Try again shortly.",
      },
    },
  });
  app.use("/api/v1/auth", authRateLimit, authModuleRouter);
  app.use("/api/v1/onboarding", onboardingModuleRouter);
  app.use("/api/v1/schools", schoolModuleRouter);
  app.use("/api/v1/users", userModuleRouter);

  app.use((request, response) => {
    response.status(404).json({
      error: {
        code: "NOT_FOUND",
        message: `No API route for ${request.method} ${request.path}.`,
      },
    });
  });

  app.use((error, request, response, _next) => {
    const logDetails = { err: error, method: request.method, path: request.path };
    if (error instanceof AppError && error.statusCode < 500) {
      requestLogger.warn(logDetails, "API request rejected");
    } else {
      requestLogger.error(logDetails, "API request failed");
    }
    if (response.headersSent) return;

    if (error instanceof AppError) {
      response.status(error.statusCode).json({
        success: false,
        error: {
          code: error.code,
          message: error.message,
          ...(error.errors ? { details: error.errors } : {}),
        },
      });
      return;
    }
    if (error.code === "23505" && error.constraint?.startsWith("schools_")) {
      response.status(409).json({
        error: {
          code: "SCHOOL_IDENTIFIER_CONFLICT",
          message: "A school with that school code or slug already exists.",
        },
      });
      return;
    }
    if (error.code === "AUTH_EMAIL_NOT_CONFIGURED") {
      response.status(503).json({
        error: {
          code: error.code,
          message:
            "Email delivery is not configured. Set the SMTP environment variables before using email verification or password recovery.",
        },
      });
      return;
    }
    if (error.code === "AUTH_EMAIL_DELIVERY_FAILED") {
      response.status(503).json({
        error: {
          code: "AUTH_EMAIL_DELIVERY_FAILED",
          message:
            "The authentication email could not be delivered. Please try again later.",
        },
      });
      return;
    }
    if (error.message?.startsWith("Neon Object Storage is not configured")) {
      response.status(503).json({
        error: {
          code: "OBJECT_STORAGE_NOT_CONFIGURED",
          message: error.message,
        },
      });
      return;
    }
    response.status(500).json({
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message: "The API could not complete this request.",
      },
    });
  });

  return app;
}

export { logger };
