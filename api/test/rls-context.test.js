import { describe, expect, it, vi } from "vitest";
import {
  getDatabase,
  setDatabaseRlsContext,
  withDatabaseContext,
} from "../src/db/client.js";
import { requestOperations } from "../src/middlewares/rlsContextMiddleware.js";

describe("request database security context", () => {
  it("marks school-code previews as a school lookup", () => {
    expect(
      requestOperations({
        baseUrl: "/api/v1/onboarding",
        path: "/school-code",
        method: "GET",
      }),
    ).toEqual({
      authOperation: false,
      onboardingOperation: false,
      schoolLookup: true,
    });
  });

  it("marks wizard submissions as onboarding operations", () => {
    expect(
      requestOperations({
        baseUrl: "/api/v1/onboarding",
        path: "/school/wizard",
        method: "POST",
      }),
    ).toEqual({
      authOperation: false,
      onboardingOperation: true,
      schoolLookup: false,
    });
  });

  it("uses the request transaction and sets transaction-local tenant context", async () => {
    const transaction = { execute: vi.fn().mockResolvedValue({ rows: [] }) };
    const schoolId = "00000000-0000-4000-8000-000000000001";
    const userId = "00000000-0000-4000-8000-000000000002";

    await withDatabaseContext(transaction, async () => {
      expect(getDatabase()).toBe(transaction);
      await setDatabaseRlsContext({
        schoolId,
        userId,
        isSuperAdmin: false,
        authOperation: false,
      });
    });

    expect(transaction.execute).toHaveBeenCalledOnce();
    expect(transaction.execute.mock.calls[0][0]).toBeDefined();
  });

  it("rejects tenant context updates outside a request transaction", async () => {
    await expect(setDatabaseRlsContext({ schoolId: null })).rejects.toThrow(
      "RLS context can only be set within a request transaction.",
    );
  });
});
