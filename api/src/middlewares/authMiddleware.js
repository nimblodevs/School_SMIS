import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { env } from "../config/env.js";
import { getDatabase, setDatabaseRlsContext } from "../db/client.js";
import { staffModuleAccess, schools, users } from "../db/schema.js";
import { UnauthorizedError } from "../shared/errors/AppError.js";
import { recordAudit } from "../shared/audit.js";

const STATE_CHANGING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);
const PASSWORD_EXEMPT_PATHS = [
  "/me",
  "/change-password",
  "/logout",
  "/reset-password",
];

function extractToken(req) {
  if (!req.cookies && req.headers.cookie) {
    req.cookies = Object.fromEntries(
      req.headers.cookie
        .split(";")
        .map((item) => {
          const separator = item.indexOf("=");
          if (separator < 0) return ["", ""];
          const key = item.slice(0, separator).trim();
          const value = item.slice(separator + 1).trim();
          try {
            return [key, decodeURIComponent(value)];
          } catch {
            return [key, value];
          }
        })
        .filter(([key]) => key),
    );
  }
  if (req.cookies?.token) return req.cookies.token;
  const header = req.headers.authorization;
  return header?.startsWith("Bearer ") ? header.slice(7) : null;
}

function pathMatches(req, suffixes) {
  const fullPath = `${req.baseUrl ?? ""}${req.path ?? ""}`;
  return suffixes.some((suffix) => fullPath.endsWith(suffix));
}

export const authenticate = async (req, _res, next) => {
  if (req.authenticated) return next();

  try {
    const token = extractToken(req);
    if (!token) throw new UnauthorizedError("Authentication token missing");

    let decoded;
    try {
      decoded = jwt.verify(token, env.JWT_PUBLIC_KEY, {
        algorithms: ["RS256"],
        issuer: env.JWT_ISSUER,
        audience: env.JWT_AUDIENCE,
      });
    } catch {
      throw new UnauthorizedError("Session expired or token invalid");
    }
    if (!decoded || typeof decoded.sub !== "string") {
      throw new UnauthorizedError("Session expired or token invalid");
    }

    if (env.NODE_ENV !== "test") {
      await setDatabaseRlsContext({ authOperation: true });
    }
    const db = getDatabase();
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.id, decoded.sub))
      .limit(1);
    if (!user || !user.isActive) {
      throw new UnauthorizedError("User account is invalid or deactivated");
    }

    let school = null;
    if (user.schoolId) {
      [school] = await db
        .select({ id: schools.id, isActive: schools.isActive })
        .from(schools)
        .where(eq(schools.id, user.schoolId))
        .limit(1);
      if (!school?.isActive) {
        throw new UnauthorizedError(
          "The school account associated with your profile is inactive",
        );
      }
    }

    const isImpersonated = Boolean(decoded.isImpersonated);
    let sessionOwner = user;
    if (isImpersonated) {
      [sessionOwner] = await db
        .select()
        .from(users)
        .where(eq(users.id, decoded.actorId ?? ""))
        .limit(1);
    }
    const expectedSessionId = isImpersonated
      ? decoded.actorSessionId
      : decoded.sessionId;
    if (
      !sessionOwner?.isActive ||
      !sessionOwner.currentSessionId ||
      sessionOwner.currentSessionId !== expectedSessionId
    ) {
      throw new UnauthorizedError("Session expired or invalid");
    }

    const moduleRows = await db
      .select({ module: staffModuleAccess.module })
      .from(staffModuleAccess)
      .where(eq(staffModuleAccess.userId, user.id));
    const normalizedRole =
      user.role.toUpperCase() === "SCHOOL_ADMIN" ? "ADMIN" : user.role;
    req.user = {
      id: user.id,
      email: user.email,
      role: normalizedRole,
      schoolId: req.selectedSchoolId ?? user.schoolId,
      modulePermissions: moduleRows.map(({ module }) => module),
      mustChangePassword: user.mustChangePassword,
      sessionId: decoded.sessionId,
      isImpersonated,
      actorId: decoded.actorId ?? null,
      targetUserId: decoded.targetUserId ?? null,
      actorSessionId: decoded.actorSessionId ?? null,
      actorSessionId: decoded.actorSessionId ?? null,
    };

    if (
      user.mustChangePassword &&
      !isImpersonated &&
      !pathMatches(req, PASSWORD_EXEMPT_PATHS)
    ) {
      throw new UnauthorizedError(
        "Password reset is required before accessing this resource",
      );
    }

    if (env.NODE_ENV !== "test") {
      await setDatabaseRlsContext({
        userId: user.id,
        schoolId: req.user.schoolId,
        isSuperAdmin: normalizedRole === "SUPER_ADMIN",
        authOperation: false,
      });
    }

    req.authenticated = true;
    if (isImpersonated && STATE_CHANGING_METHODS.has(req.method)) {
      await recordAudit({
        action: "IMPERSONATED_ACTION",
        actorId: decoded.actorId ?? null,
        schoolId: user.schoolId,
        entityType: "User",
        entityId: user.id,
        ipAddress: req.ip,
        userAgent: req.headers["user-agent"],
        metadata: {
          method: req.method,
          path: req.path,
          targetUserId: decoded.targetUserId,
        },
      });
    }
    return next();
  } catch (error) {
    return next(error);
  }
};
