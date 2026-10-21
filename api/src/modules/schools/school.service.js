import { randomUUID } from "node:crypto";
import { and, asc, count, eq, ilike, inArray, or, sql } from "drizzle-orm";
import { getDatabase } from "../../db/client.js";
import {
  parents,
  schoolBranches,
  schoolSettings,
  schools,
  staff,
  students,
  teachers,
  users,
} from "../../db/schema.js";
import { recordAudit } from "../../shared/audit.js";
import { generateSchoolCode } from "../../shared/school-code.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../shared/errors/AppError.js";

function isUniqueConstraintError(error) {
  return error?.code === "23505";
}

function schoolView(row, counts = {}, branches = []) {
  const location = row.schoolLocation ?? {};
  return {
    id: row.id,
    name: row.schoolName,
    slug: row.schoolSlug,
    schoolCode: row.schoolCode,
    schoolName: row.schoolName,
    schoolSlug: row.schoolSlug,
    schoolNemisNo: row.schoolNemisNo,
    schoolKraPin: row.schoolKraPin,
    schoolMotto: row.schoolMotto,
    visionStatement: row.visionStatement,
    missionStatement: row.missionStatement,
    officialPhone: row.officialPhone,
    schoolEmail: row.schoolEmail,
    motto: row.schoolMotto,
    vision: row.visionStatement,
    mission: row.missionStatement,
    address: row.headOfficeAddress,
    city: location.area ?? "",
    county: location.county ?? "",
    postalCode: location.postalCode ?? "",
    phone: row.officialPhone,
    email: row.schoolEmail,
    website: row.website,
    schoolType: row.schoolType,
    isActive: row.isActive,
    branches,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
    nextTeacherSequence: row.nextTeacherSequence,
    nextStaffSequence: row.nextStaffSequence,
    _count: counts,
  };
}

function mapSchoolPatch(input) {
  const data = {};
  const directFields = {
    name: ["schoolName"],
    slug: ["schoolSlug"],
    schoolNemisNo: ["schoolNemisNo"],
    schoolKraPin: ["schoolKraPin"],
    motto: ["schoolMotto"],
    vision: ["visionStatement"],
    mission: ["missionStatement"],
    address: ["headOfficeAddress"],
    phone: ["officialPhone"],
    email: ["schoolEmail"],
    website: ["website"],
    isActive: ["isActive"],
  };
  for (const [field, columns] of Object.entries(directFields)) {
    if (input[field] !== undefined) {
      const value =
        field === "name" ? input[field].toUpperCase() : (input[field] ?? "");
      for (const column of columns) data[column] = value;
    }
  }

  const locationFields = ["city", "county", "postalCode"].filter(
    (field) => input[field] !== undefined,
  );
  if (locationFields.length) {
    data.schoolLocation = sql`coalesce(${schools.schoolLocation}, '{}'::jsonb) || ${JSON.stringify(
      Object.fromEntries(
        locationFields.map((field) => [
          field === "city" ? "area" : field,
          input[field] ?? "",
        ]),
      ),
    )}::jsonb`;
  }
  data.updatedAt = new Date();
  return data;
}

async function schoolCounts(db, ids) {
  if (!ids.length) return new Map();
  const [userRows, teacherRows, staffRows, studentRows, parentRows] =
    await Promise.all([
      db
        .select({ schoolId: users.schoolId, total: count() })
        .from(users)
        .where(inArray(users.schoolId, ids))
        .groupBy(users.schoolId),
      db
        .select({ schoolId: teachers.schoolId, total: count() })
        .from(teachers)
        .where(inArray(teachers.schoolId, ids))
        .groupBy(teachers.schoolId),
      db
        .select({ schoolId: staff.schoolId, total: count() })
        .from(staff)
        .where(inArray(staff.schoolId, ids))
        .groupBy(staff.schoolId),
      db
        .select({ schoolId: students.schoolId, total: count() })
        .from(students)
        .where(inArray(students.schoolId, ids))
        .groupBy(students.schoolId),
      db
        .select({ schoolId: parents.schoolId, total: count() })
        .from(parents)
        .where(inArray(parents.schoolId, ids))
        .groupBy(parents.schoolId),
    ]);
  const bySchool = new Map(
    ids.map((id) => [
      id,
      { users: 0, teachers: 0, staff: 0, students: 0, parents: 0 },
    ]),
  );
  for (const [key, rows] of [
    ["users", userRows],
    ["teachers", teacherRows],
    ["staff", staffRows],
    ["students", studentRows],
    ["parents", parentRows],
  ]) {
    rows.forEach(({ schoolId, total }) => {
      bySchool.get(schoolId)[key] = Number(total);
    });
  }
  return bySchool;
}

export class SchoolService {
  static async listBranches(schoolId, actor) {
    if (actor.role !== "SUPER_ADMIN" && actor.schoolId !== schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }
    return getDatabase()
      .select()
      .from(schoolBranches)
      .where(eq(schoolBranches.schoolId, schoolId))
      .orderBy(asc(schoolBranches.name));
  }

  static async addBranch(
    schoolId,
    input,
    actor,
    { ipAddress, userAgent } = {},
  ) {
    if (actor.role !== "SUPER_ADMIN" && actor.schoolId !== schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }
    const database = getDatabase();
    const [school] = await database
      .select({ id: schools.id, isActive: schools.isActive })
      .from(schools)
      .where(eq(schools.id, schoolId))
      .limit(1);
    if (!school) throw new NotFoundError("School not found");
    if (!school.isActive)
      throw new BadRequestError("The school account is inactive");

    const branch = await database.transaction(async (tx) => {
      const [createdBranch] = await tx
        .insert(schoolBranches)
        .values({ id: randomUUID(), schoolId, ...input })
        .returning();
      await tx
        .update(schools)
        .set({ schoolType: "multi-branch", updatedAt: new Date() })
        .where(eq(schools.id, schoolId));
      return createdBranch;
    });
    await recordAudit({
      action: "CREATE",
      actorId: actor.id,
      schoolId,
      entityType: "SchoolBranch",
      entityId: branch.id,
      ipAddress,
      userAgent,
      metadata: { name: branch.name },
    });
    return this.getById(schoolId, actor);
  }

  static async create(input, actor, { ipAddress, userAgent } = {}) {
    try {
      const [school] = await getDatabase().transaction(async (tx) => {
        const schoolCode = await generateSchoolCode(tx, input.name);
        const [created] = await tx
          .insert(schools)
          .values({
            id: randomUUID(),
            schoolName: input.name.toUpperCase(),
            schoolSlug: input.slug,
            schoolCode,
            schoolNemisNo: input.schoolNemisNo || null,
            schoolKraPin: input.schoolKraPin || null,
            schoolMotto: input.motto ?? "",
            visionStatement: input.vision ?? "",
            missionStatement: input.mission ?? "",
            schoolType: "standalone",
            schoolLocation: {
              area: input.city ?? "",
              county: input.county ?? "",
              postalCode: input.postalCode ?? "",
            },
            officialPhone: input.phone ?? "",
            schoolEmail: input.email ?? "",
            website: input.website ?? "",
            headOfficeAddress: input.address ?? "",
          })
          .returning();
        await tx
          .insert(schoolSettings)
          .values({ id: randomUUID(), schoolId: created.id })
          .onConflictDoNothing();
        return [created];
      });
      await recordAudit({
        action: "CREATE",
        actorId: actor.id,
        entityType: "School",
        entityId: school.id,
        metadata: {
          name: school.schoolName,
          slug: school.schoolSlug,
          schoolCode: school.schoolCode,
        },
        ipAddress,
        userAgent,
      });
      return schoolView(school);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new BadRequestError(
          "School name identifiers or code already exist",
        );
      }
      throw error;
    }
  }

  static async list({ page = 1, pageSize = 50, search, isActive } = {}) {
    const filters = [];
    if (typeof isActive === "boolean")
      filters.push(eq(schools.isActive, isActive));
    if (search) {
      const term = `%${search}%`;
      filters.push(
        or(
          ilike(schools.schoolName, term),
          ilike(schools.schoolSlug, term),
          ilike(schools.schoolCode, term),
        ),
      );
    }
    const where = filters.length ? and(...filters) : undefined;
    const database = getDatabase();
    const [rows, [{ total }], [{ registeredTotal }], [{ multiBranchTotal }]] =
      await Promise.all([
        database
          .select()
          .from(schools)
          .where(where)
          .orderBy(asc(schools.schoolName))
          .limit(pageSize)
          .offset((page - 1) * pageSize),
        database.select({ total: count() }).from(schools).where(where),
        database.select({ registeredTotal: count() }).from(schools),
        database
          .select({ multiBranchTotal: count() })
          .from(schools)
          .where(eq(schools.schoolType, "multi-branch")),
      ]);
    const schoolIds = rows.map((school) => school.id);
    const [counts, branchRows] = await Promise.all([
      schoolCounts(database, schoolIds),
      schoolIds.length
        ? database
            .select()
            .from(schoolBranches)
            .where(inArray(schoolBranches.schoolId, schoolIds))
            .orderBy(asc(schoolBranches.name))
        : [],
    ]);
    const branchesBySchool = new Map(schoolIds.map((id) => [id, []]));
    branchRows.forEach((branch) =>
      branchesBySchool.get(branch.schoolId).push(branch),
    );
    const schoolRows = rows.map((row) =>
      schoolView(row, counts.get(row.id), branchesBySchool.get(row.id)),
    );
    return {
      schools: schoolRows,
      total: Number(total),
      page,
      pageSize,
      totalPages: Math.ceil(Number(total) / pageSize),
      summary: {
        registeredSchools: Number(registeredTotal),
        multiBranchSchools: Number(multiBranchTotal),
      },
    };
  }

  static async getById(schoolId, actor) {
    if (actor.role !== "SUPER_ADMIN" && actor.schoolId !== schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }
    const [school] = await getDatabase()
      .select()
      .from(schools)
      .where(eq(schools.id, schoolId))
      .limit(1);
    if (!school) throw new NotFoundError("School not found");
    const counts = await schoolCounts(getDatabase(), [schoolId]);
    const branches = await this.listBranches(schoolId, actor);
    return schoolView(school, counts.get(schoolId), branches);
  }

  static async update(schoolId, input, actor, { ipAddress, userAgent } = {}) {
    if (actor.role !== "SUPER_ADMIN" && actor.schoolId !== schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }
    const editableProfileFields = [
      "motto",
      "vision",
      "mission",
      "address",
      "city",
      "county",
      "postalCode",
      "website",
    ];
    const data =
      actor.role === "SUPER_ADMIN"
        ? mapSchoolPatch(input)
        : mapSchoolPatch(
            Object.fromEntries(
              Object.entries(input).filter(([field]) =>
                editableProfileFields.includes(field),
              ),
            ),
          );
    if (Object.keys(data).length === 1) {
      throw new ForbiddenError(
        "Only super admins can change the school name, email, phone, slug, or active status",
      );
    }
    try {
      const [school] = await getDatabase()
        .update(schools)
        .set(data)
        .where(eq(schools.id, schoolId))
        .returning();
      if (!school) throw new NotFoundError("School not found");
      await recordAudit({
        action: "UPDATE",
        actorId: actor.id,
        schoolId,
        entityType: "School",
        entityId: schoolId,
        metadata: { fields: Object.keys(input) },
        ipAddress,
        userAgent,
      });
      return schoolView(school);
    } catch (error) {
      if (error?.code === "23505") {
        throw new BadRequestError(
          "School slug or payment identifier already exists",
        );
      }
      throw error;
    }
  }

  static async getSettings(schoolId, actor) {
    await this.getById(schoolId, actor);
    const database = getDatabase();
    await database
      .insert(schoolSettings)
      .values({ id: randomUUID(), schoolId })
      .onConflictDoNothing();
    const [settings] = await database
      .select({
        schoolId: schoolSettings.schoolId,
        mpesaShortcode: schoolSettings.mpesaShortcode,
        mpesaEnabled: schoolSettings.mpesaEnabled,
        createdAt: schoolSettings.createdAt,
        updatedAt: schoolSettings.updatedAt,
      })
      .from(schoolSettings)
      .where(eq(schoolSettings.schoolId, schoolId))
      .limit(1);
    return settings;
  }

  static async updateSettings(
    schoolId,
    input,
    actor,
    { ipAddress, userAgent } = {},
  ) {
    await this.getById(schoolId, actor);
    if (actor.role !== "SUPER_ADMIN" && actor.schoolId !== schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }
    const [settings] = await getDatabase()
      .insert(schoolSettings)
      .values({ id: randomUUID(), schoolId, ...input })
      .onConflictDoUpdate({
        target: schoolSettings.schoolId,
        set: { ...input, updatedAt: new Date() },
      })
      .returning({
        schoolId: schoolSettings.schoolId,
        mpesaShortcode: schoolSettings.mpesaShortcode,
        mpesaEnabled: schoolSettings.mpesaEnabled,
        createdAt: schoolSettings.createdAt,
        updatedAt: schoolSettings.updatedAt,
      });
    await recordAudit({
      action: "UPDATE",
      actorId: actor.id,
      schoolId,
      entityType: "SchoolSettings",
      entityId: schoolId,
      metadata: { fields: Object.keys(input) },
      ipAddress,
      userAgent,
    });
    return settings;
  }
}
