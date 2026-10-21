import { describe, expect, it } from "vitest";
import { schoolWizardSchema } from "../src/modules/onboarding/onboarding.validation.js";

const standaloneSchool = {
  schoolCode: "TST",
  schoolName: "Test Academy",
  schoolSlug: "test-academy",
  schoolNemisNo: "DEMO-NEMIS-001",
  schoolKraPin: "DUMMY-KRA-001",
  schoolMotto: "TEST ONLY - Learn for the future",
  visionStatement: "TEST ONLY - A thriving learning community.",
  missionStatement: "TEST ONLY - Provide inclusive education.",
  schoolType: "standalone",
  schoolLocation: {
    county: "Nairobi",
    subCounty: "Demo Sub County",
    ward: "Demo Ward",
    area: "Demo Area",
    latitude: "",
    longitude: "",
    nearestLandmark: "",
  },
  branches: [],
  officialPhone: "+254700000001",
  schoolEmail: "school@example.test",
  website: "",
  headOfficeAddress: "",
  ownerships: [
    {
      ownershipType: "private",
      schoolAdminName: "Demo Admin",
      schoolAdminEmail: "admin@example.test",
      schoolAdminMobile: "+254700000002",
      alternativeMobile: "",
    },
  ],
  confirmedAccurate: true,
};

describe("full school onboarding validation", () => {
  it("accepts a valid standalone wizard submission", () => {
    expect(schoolWizardSchema.safeParse(standaloneSchool).success).toBe(true);
  });

  it("requires a branch for multi-branch schools", () => {
    const result = schoolWizardSchema.safeParse({
      ...standaloneSchool,
      schoolType: "multi-branch",
      branches: [],
    });

    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((issue) => issue.path[0] === "branches"),
    ).toBe(true);
  });

  it("requires affirmative accuracy confirmation", () => {
    const result = schoolWizardSchema.safeParse({
      ...standaloneSchool,
      confirmedAccurate: false,
    });

    expect(result.success).toBe(false);
    expect(
      result.error.issues.some(
        (issue) => issue.path[0] === "confirmedAccurate",
      ),
    ).toBe(true);
  });

  it("rejects duplicate admin emails instead of provisioning the same login twice", () => {
    const result = schoolWizardSchema.safeParse({
      ...standaloneSchool,
      ownerships: [
        ...standaloneSchool.ownerships,
        {
          ...standaloneSchool.ownerships[0],
          schoolAdminName: "Second Demo Admin",
          schoolAdminEmail: " ADMIN@example.test ",
        },
      ],
    });

    expect(result.success).toBe(false);
    expect(
      result.error.issues.some((issue) => issue.path[0] === "ownerships"),
    ).toBe(true);
  });
});
