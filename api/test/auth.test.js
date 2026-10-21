import argon2 from "argon2";
import { createHash } from "node:crypto";
import request from "supertest";
import { describe, expect, it } from "vitest";
import { createApp } from "../src/app.js";
import {
  hashOtp,
  isImpersonationTargetEligible,
  matchesPasswordHash,
} from "../src/modules/auth/auth.service.js";
import { resendCodeSchema } from "../src/modules/auth/auth.validation.js";
import { assertAuthenticationEmailConfigured } from "../src/shared/email.js";

describe("authentication API", () => {
  it("stores OTPs as keyed hashes rather than plaintext or an unkeyed digest", () => {
    const otp = "123456";
    const otpHash = hashOtp(otp);

    expect(otpHash).toMatch(/^[a-f\d]{64}$/);
    expect(otpHash).not.toBe(otp);
    expect(otpHash).not.toBe(createHash("sha256").update(otp).digest("hex"));
  });

  it("validates login requests before accessing the database", async () => {
    const response = await request(createApp())
      .post("/api/v1/auth/login")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("routes resend-code requests and validates the request body", async () => {
    const response = await request(createApp())
      .post("/api/v1/auth/resend-code")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("validates registration and email verification requests on their routes", async () => {
    const app = createApp();
    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({});
    const verification = await request(app)
      .post("/api/v1/auth/verify-email")
      .send({});

    expect(registration.status).toBe(400);
    expect(registration.body.error.code).toBe("BAD_REQUEST");
    expect(verification.status).toBe(400);
    expect(verification.body.error.code).toBe("BAD_REQUEST");
  });

  it("accepts email verification as a resend purpose", () => {
    expect(
      resendCodeSchema.safeParse({
        email: "person@example.com",
        purpose: "email_verification",
      }).success,
    ).toBe(true);
  });

  it("rejects malformed email verification resends through request validation", async () => {
    const response = await request(createApp())
      .post("/api/v1/auth/resend-code")
      .send({ email: "not-an-email", purpose: "email_verification" });

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("requires a valid session for the current-user endpoint", async () => {
    const response = await request(createApp()).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
  });

  it("allows impersonation of every active non-super-admin role only", () => {
    for (const role of [
      "ADMIN",
      "MANAGER",
      "TEACHER",
      "STAFF",
      "STUDENT",
      "PARENT",
      "BURSAR",
    ]) {
      expect(isImpersonationTargetEligible({ role, isActive: true })).toBe(
        true,
      );
    }
    expect(
      isImpersonationTargetEligible({ role: "SUPER_ADMIN", isActive: true }),
    ).toBe(false);
    expect(
      isImpersonationTargetEligible({ role: "TEACHER", isActive: false }),
    ).toBe(false);
  });

  it("keeps production impersonation limited to the existing support roles", () => {
    expect(
      isImpersonationTargetEligible(
        { role: "TEACHER", isActive: true },
        "production",
      ),
    ).toBe(true);
    expect(
      isImpersonationTargetEligible(
        { role: "ADMIN", isActive: true },
        "production",
      ),
    ).toBe(false);
  });

  it("matches a candidate password against stored password-history hashes", async () => {
    const previousPassword = "PreviousPass123!";
    const previousPasswordHash = await argon2.hash(previousPassword);

    await expect(
      matchesPasswordHash(previousPassword, [previousPasswordHash]),
    ).resolves.toBe(true);
    await expect(
      matchesPasswordHash("DifferentPass456!", [previousPasswordHash]),
    ).resolves.toBe(false);
  });

  it("accepts Gmail SMTP configuration without an explicit sender address", () => {
    const keys = [
      "GMAIL_HOST",
      "GMAIL_USER",
      "GMAIL_PASSWORD",
      "SMTP_PORT",
      "GMAIL_SECURE",
      "AUTH_EMAIL_FROM",
    ];
    const original = Object.fromEntries(
      keys.map((key) => [key, process.env[key]]),
    );
    Object.assign(process.env, {
      GMAIL_HOST: "smtp.gmail.com",
      GMAIL_USER: "school@example.test",
      GMAIL_PASSWORD: "app-password",
      SMTP_PORT: "587",
      GMAIL_SECURE: "false",
    });
    delete process.env.AUTH_EMAIL_FROM;

    try {
      expect(assertAuthenticationEmailConfigured).not.toThrow();
    } finally {
      for (const [key, value] of Object.entries(original)) {
        if (value === undefined) delete process.env[key];
        else process.env[key] = value;
      }
    }
  });
});
