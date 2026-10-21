import { describe, expect, it } from "vitest";
import request from "supertest";
import { createApp } from "../src/app.js";

describe("application configuration", () => {
  it("accepts TRUST_PROXY=false without parsing it as an IP address", () => {
    const original = process.env.TRUST_PROXY;
    process.env.TRUST_PROXY = "false";

    try {
      expect(createApp().get("trust proxy")).toBe(false);
    } finally {
      if (original === undefined) delete process.env.TRUST_PROXY;
      else process.env.TRUST_PROXY = original;
    }
  });

  it("does not allow TRUST_PROXY=true to trust every proxy", () => {
    const original = process.env.TRUST_PROXY;
    process.env.TRUST_PROXY = "true";

    try {
      expect(() => createApp()).toThrow("TRUST_PROXY=true is not allowed");
    } finally {
      if (original === undefined) delete process.env.TRUST_PROXY;
      else process.env.TRUST_PROXY = original;
    }
  });

  it("mounts the modular auth API and validates login requests before database access", async () => {
    const response = await request(createApp())
      .post("/api/v1/auth/login")
      .send({});

    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("BAD_REQUEST");
  });

  it("does not mount the removed compatibility auth and school routes", async () => {
    const authResponse = await request(createApp())
      .post("/api/auth/login")
      .send({});
    const schoolsResponse = await request(createApp()).get("/api/schools");

    expect(authResponse.status).toBe(404);
    expect(schoolsResponse.status).toBe(404);
  });

  it("requires authentication for modular school onboarding", async () => {
    const app = createApp();
    const [response, codeResponse, wizardResponse] = await Promise.all([
      request(app).get("/api/v1/onboarding/availability?slug=green-school"),
      request(app).get("/api/v1/onboarding/school-code?name=Green%20School"),
      request(app).post("/api/v1/onboarding/school/wizard"),
    ]);

    expect(response.status).toBe(401);
    expect(response.body.error.code).toBe("UNAUTHORIZED");
    expect(codeResponse.status).toBe(401);
    expect(codeResponse.body.error.code).toBe("UNAUTHORIZED");
    expect(wizardResponse.status).toBe(401);
    expect(wizardResponse.body.error.code).toBe("UNAUTHORIZED");
  });
});
