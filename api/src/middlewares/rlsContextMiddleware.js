import {
  getDatabase,
  setDatabaseRlsContext,
  withDatabaseContext,
} from "../db/client.js";

const PUBLIC_AUTH_PATHS = new Set([
  "/api/v1/auth/register",
  "/api/v1/auth/login",
  "/api/v1/auth/verify-login-otp",
  "/api/v1/auth/resend-login-otp",
  "/api/v1/auth/google",
  "/api/v1/auth/forgot-password",
  "/api/v1/auth/verify-otp",
  "/api/v1/auth/verify-email",
  "/api/v1/auth/reset-password",
  "/api/v1/auth/refresh",
]);

export function requestOperations(req) {
  const path = `${req.baseUrl ?? ""}${req.path ?? ""}`;
  return {
    authOperation: PUBLIC_AUTH_PATHS.has(path) && req.method === "POST",
    onboardingOperation:
      [
        "/api/v1/onboarding/school",
        "/api/v1/onboarding/school/wizard",
      ].includes(path) && req.method === "POST",
    schoolLookup:
      [
        "/api/v1/onboarding/availability",
        "/api/v1/onboarding/school-code",
      ].includes(path) && req.method === "GET",
  };
}

function waitForResponse(response) {
  return new Promise((resolve) => {
    const cleanup = () => {
      response.off("finish", finish);
      response.off("close", finish);
    };
    const finish = () => {
      cleanup();
      resolve();
    };
    response.once("finish", finish);
    response.once("close", finish);
  });
}

export async function rlsContextMiddleware(req, res, next) {
  try {
    await getDatabase().transaction(async (transaction) =>
      withDatabaseContext(transaction, async () => {
        const responseComplete = waitForResponse(res);
        await setDatabaseRlsContext({
          schoolId: null,
          userId: null,
          isSuperAdmin: false,
          ...requestOperations(req),
        });
        next();
        await responseComplete;
      }),
    );
  } catch (error) {
    next(error);
  }
}
