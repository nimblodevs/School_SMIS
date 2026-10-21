import { describe, expect, it } from "vitest";
import {
  buildSeedSchoolBranches,
  buildSeedSchools,
} from "../seed/schools.seed.js";

describe("school seed data", () => {
  it("builds the configured schools with unique identifiers and slugs", () => {
    const schools = buildSeedSchools();

    expect(schools).toHaveLength(19);
    expect(schools[0].schoolName).toBe("Nairobi Valley Academy");
    expect(schools[0].schoolSlug).toBe("nairobi-valley-academy");
    expect(new Set(schools.map(({ id }) => id)).size).toBe(19);
    expect(new Set(schools.map(({ schoolCode }) => schoolCode)).size).toBe(19);
    expect(new Set(schools.map(({ schoolSlug }) => schoolSlug)).size).toBe(19);
    expect(
      new Set(schools.map(({ officialPhone }) => officialPhone)).size,
    ).toBe(19);
    expect(
      schools.filter(({ schoolType }) => schoolType === "multi-branch"),
    ).toHaveLength(4);
  });

  it("builds uniquely identified branches for their configured schools", () => {
    const branches = buildSeedSchoolBranches();

    expect(branches).toHaveLength(8);
    expect(new Set(branches.map(({ id }) => id)).size).toBe(8);
    expect(
      new Set(branches.map(({ schoolId, name }) => `${schoolId}:${name}`)).size,
    ).toBe(8);
    expect(
      branches.every(
        ({ county, subCounty, ward, area }) =>
          county && subCounty && ward && area,
      ),
    ).toBe(true);
  });
});
