import "dotenv/config";
import { pathToFileURL } from "node:url";
import { inArray, sql } from "drizzle-orm";
import { closeDatabase, getDatabase } from "../src/db/client.js";
import { schoolBranches, schools } from "../src/db/schema.js";
import { SEED_SCHOOLS, SEED_SCHOOL_BRANCHES } from "./data.js";
import {
  SEED_SCHOOL_COUNT,
  seedSchoolId,
  seedUuid,
  sequence,
} from "./seed.utils.js";

const branchesBySchool = new Map(
  SEED_SCHOOL_BRANCHES.map(({ schoolName, branches }) => [
    schoolName,
    branches,
  ]),
);

export function buildSeedSchools() {
  return SEED_SCHOOLS.map((schoolName, schoolIndex) => {
    const schoolNumber = schoolIndex + 1;
    const label = sequence(schoolNumber);

    return {
      id: seedSchoolId(schoolNumber),
      schoolName,
      schoolCode: `S${String(schoolNumber).padStart(3, "0")}`,
      schoolSlug: schoolName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, ""),
      schoolMotto: "Learning for every future",
      visionStatement: "A thriving learning community.",
      missionStatement: "To provide an inclusive, quality education.",
      schoolType: branchesBySchool.has(schoolName)
        ? "multi-branch"
        : "standalone",
      schoolLocation: { area: `Seed Town ${label}`, county: "Nairobi" },
      officialPhone: `+254700${String(100000 + schoolNumber).padStart(6, "0")}`,
      schoolEmail: `school${label}@seed.smis.test`,
    };
  });
}

export function buildSeedSchoolBranches() {
  return SEED_SCHOOL_BRANCHES.flatMap(({ schoolName, branches }) => {
    const schoolNumber = SEED_SCHOOLS.indexOf(schoolName) + 1;
    if (schoolNumber === 0) {
      throw new Error(`Branch seed references unknown school "${schoolName}".`);
    }

    return branches.map((branch, branchIndex) => ({
      id: seedUuid(
        `branch:${sequence(schoolNumber)}:${sequence(branchIndex + 1)}`,
      ),
      schoolId: seedSchoolId(schoolNumber),
      ...branch,
    }));
  });
}

export async function seedSchools(database) {
  const schoolRows = buildSeedSchools();
  const branchRows = buildSeedSchoolBranches();

  return database.transaction(async (tx) => {
    await tx.execute(sql`select set_config('app.is_super_admin', 'true', true)`);
    await tx
      .insert(schools)
      .values(schoolRows)
      .onConflictDoUpdate({
        target: schools.id,
        set: {
          schoolName: sql`excluded.school_name`,
          schoolCode: sql`excluded.school_code`,
          schoolSlug: sql`excluded.school_slug`,
          schoolMotto: sql`excluded.school_motto`,
          visionStatement: sql`excluded.vision_statement`,
          missionStatement: sql`excluded.mission_statement`,
          schoolType: sql`excluded.school_type`,
          schoolLocation: sql`excluded.school_location`,
          officialPhone: sql`excluded.official_phone`,
          schoolEmail: sql`excluded.school_email`,
        },
      });
    await tx
      .insert(schoolBranches)
      .values(branchRows)
      .onConflictDoUpdate({
        target: schoolBranches.id,
        set: {
          schoolId: sql`excluded.school_id`,
          name: sql`excluded.name`,
          county: sql`excluded.county`,
          subCounty: sql`excluded.sub_county`,
          ward: sql`excluded.ward`,
          area: sql`excluded.area`,
          latitude: sql`excluded.latitude`,
          longitude: sql`excluded.longitude`,
          nearestLandmark: sql`excluded.nearest_landmark`,
        },
      });
    const storedSchools = await tx
      .select({ id: schools.id })
      .from(schools)
      .where(
        inArray(
          schools.id,
          schoolRows.map(({ id }) => id),
        ),
      );

    if (storedSchools.length !== SEED_SCHOOL_COUNT) {
      throw new Error(
        `Expected ${SEED_SCHOOL_COUNT} seed schools, found ${storedSchools.length}. Check for conflicting seed school identifiers.`,
      );
    }

    return { schoolCount: storedSchools.length };
  });
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    throw new Error("Refusing to seed schools in production.");
  }

  const result = await seedSchools(getDatabase());
  console.info(`Ensured ${result.schoolCount} seed schools.`);
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  try {
    await main();
  } catch (error) {
    console.error("School seed failed:", error);
    process.exitCode = 1;
  } finally {
    try {
      await closeDatabase();
    } catch (error) {
      console.error("Failed to close the database connection:", error);
      process.exitCode = 1;
    }
  }
}
