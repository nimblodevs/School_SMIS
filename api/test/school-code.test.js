import { describe, expect, it, vi } from "vitest";
import {
  generateSchoolCode,
  previewSchoolCode,
} from "../src/shared/school-code.js";

function createTransaction(existingCodes = []) {
  return {
    execute: vi.fn().mockResolvedValue(undefined),
    select: () => ({
      from: async () => existingCodes.map((schoolCode) => ({ schoolCode })),
    }),
  };
}

describe("school code generation", () => {
  it("uses the initials of the school name when available", async () => {
    const transaction = createTransaction();

    await expect(
      generateSchoolCode(transaction, "Green Valley High"),
    ).resolves.toBe("GVH");
    expect(transaction.execute).toHaveBeenCalledOnce();
  });

  it("increments the numeric suffix when the initials are already used", async () => {
    const transaction = createTransaction(["GVH", "GVH1"]);

    await expect(
      generateSchoolCode(transaction, "Green Valley High"),
    ).resolves.toBe("GVH2");
  });

  it("keeps four-letter initials and their numeric suffixes within the four-character limit", async () => {
    const firstTransaction = createTransaction(["ABCD"]);
    const secondTransaction = createTransaction(["ABCD", "ABC1"]);

    await expect(
      generateSchoolCode(firstTransaction, "Alpha Beta Central District"),
    ).resolves.toBe("ABC1");
    await expect(
      generateSchoolCode(secondTransaction, "Alpha Beta Central District"),
    ).resolves.toBe("ABC2");
  });

  it("normalizes accented letters and falls back for names without alphanumerics", async () => {
    await expect(
      generateSchoolCode(createTransaction(), "École Française"),
    ).resolves.toBe("EF");
    await expect(generateSchoolCode(createTransaction(), "学校")).resolves.toBe(
      "SCH",
    );
  });

  it("previews the same collision-aware code generator used during school creation", async () => {
    const transaction = createTransaction(["LPS"]);
    const database = {
      transaction: (callback) => callback(transaction),
    };

    await expect(
      previewSchoolCode(database, "Lakeview Preparatory School"),
    ).resolves.toBe("LPS1");
  });
});
