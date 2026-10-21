import { and, eq } from "drizzle-orm";
import { z } from "zod";
import { getDatabase, setDatabaseRlsContext } from "../db/client.js";
import { schoolBranches, schools } from "../db/schema.js";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../shared/errors/AppError.js";

export async function resolveSchoolContext(req, _res, next) {
  try {
    const requestedSchoolId = req.get("x-school-id") || req.query.schoolId;
    const schoolId = requestedSchoolId || req.user?.schoolId;
    if (!schoolId)
      throw new BadRequestError("A schoolId is required for this operation");
    if (req.user?.role !== "SUPER_ADMIN" && schoolId !== req.user?.schoolId) {
      throw new ForbiddenError("You do not have access to this school");
    }

    const [school] = await getDatabase()
      .select({ id: schools.id })
      .from(schools)
      .where(eq(schools.id, schoolId))
      .limit(1);
    if (!school) throw new NotFoundError("School not found");

    req.selectedSchoolId = school.id;
    req.user.schoolId = school.id;
    const requestedBranchId = req.get("x-branch-id") || req.query.branchId;
    if (requestedBranchId && requestedBranchId !== "unassigned") {
      const branchIdValidation = z.string().uuid().safeParse(requestedBranchId);
      if (!branchIdValidation.success)
        throw new BadRequestError("branchId must be a valid UUID or 'unassigned'");
      const [branch] = await getDatabase()
        .select({ id: schoolBranches.id })
        .from(schoolBranches)
        .where(
          and(
            eq(schoolBranches.id, requestedBranchId),
            eq(schoolBranches.schoolId, school.id),
          ),
        )
        .limit(1);
      if (!branch) throw new NotFoundError("Branch not found in this school");
    }
    req.selectedBranchId = requestedBranchId || null;
    await setDatabaseRlsContext({ schoolId: school.id });
    return next();
  } catch (error) {
    return next(error);
  }
}
