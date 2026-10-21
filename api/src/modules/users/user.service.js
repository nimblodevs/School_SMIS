import argon2 from 'argon2';
import { randomBytes, randomUUID } from 'node:crypto';
import { and, eq, or, sql } from 'drizzle-orm';
import { getDatabase } from '../../db/client.js';
import { employeeNumbers, schoolBranches, schools, staff, teachers, users } from '../../db/schema.js';
import { env } from '../../config/env.js';
import { recordAudit } from '../../shared/audit.js';
import { sendTemporaryCredentials } from '../../shared/email.js';
import { BadRequestError, NotFoundError } from '../../shared/errors/AppError.js';
import { resolveSchoolId } from '../../shared/ownership.js';
import { schoolInitials } from '../../shared/sequences.js';

function generateTemporaryPassword(schoolCode) {
    return `SMIS-${schoolCode}-${randomBytes(12).toString('base64url')}`;
}

export class UserService {
    static async provisionEmployee(role, input, actor, { ipAddress, userAgent } = {}) {
        const schoolId = resolveSchoolId(actor, input.schoolId);
        const database = getDatabase();
        const [school] = await database
            .select({
                id: schools.id,
                name: schools.schoolName,
                schoolCode: schools.schoolCode,
                isActive: schools.isActive,
            })
            .from(schools)
            .where(eq(schools.id, schoolId))
            .limit(1);
        if (!school) throw new NotFoundError('School not found');
        if (!school.isActive) throw new BadRequestError('The school account is inactive');
        if (input.branchId) {
            const [branch] = await database
                .select({ id: schoolBranches.id })
                .from(schoolBranches)
                .where(
                    and(
                        eq(schoolBranches.id, input.branchId),
                        eq(schoolBranches.schoolId, schoolId),
                    ),
                )
                .limit(1);
            if (!branch) throw new BadRequestError('The selected branch does not belong to this school');
        }
        if (!/^(?:\d{5}|[A-Z][A-Z0-9-]{1,11})$/i.test(school.schoolCode)) {
            throw new BadRequestError('The school must have a valid school code');
        }

        const temporaryPassword = generateTemporaryPassword(school.schoolCode);
        const userId = randomUUID();
        const profileId = randomUUID();
        const passwordHash = await argon2.hash(temporaryPassword, { type: argon2.argon2id });
        let generatedOwnerKey;
        let generatedEmployeeNo;

        const user = await database.transaction(async (tx) => {
            const [existingUser] = await tx
                .select({ id: users.id })
                .from(users)
                .where(or(eq(users.email, input.email), eq(users.username, input.username)))
                .limit(1);
            if (existingUser) throw new BadRequestError('A user with this email or username already exists');

            const sequenceColumn = role === 'TEACHER' ? schools.nextTeacherSequence : schools.nextStaffSequence;
            const [sequence] = await tx
                .update(schools)
                .set({ [role === 'TEACHER' ? 'nextTeacherSequence' : 'nextStaffSequence']: sql`${sequenceColumn} + 1` })
                .where(eq(schools.id, schoolId))
                .returning({
                    nextSequence:
                        role === 'TEACHER' ? schools.nextTeacherSequence : schools.nextStaffSequence,
                });
            const ownerKey = `${role === 'TEACHER' ? 'T' : 'S'}:${profileId}`;
            const employeeNo = `${role === 'TEACHER' ? 'T' : 'S'}${schoolInitials(school.name)}${String(sequence.nextSequence).padStart(4, '0')}`;
            generatedOwnerKey = ownerKey;
            generatedEmployeeNo = employeeNo;
            await tx.insert(employeeNumbers).values({
                id: randomUUID(),
                schoolId,
                employeeNo,
                ownerKey,
            });

            const [createdUser] = await tx
                .insert(users)
                .values({
                    id: userId,
                    username: input.username,
                    fullName: [input.firstName, input.middleName, input.lastName].filter(Boolean).join(' '),
                    email: input.email,
                    phone: input.phone ?? null,
                    passwordHash,
                    mustChangePassword: true,
                    role,
                    schoolId,
                })
                .returning();

            const profile = {
                id: profileId,
                schoolId,
                branchId: input.branchId ?? null,
                userId: createdUser.id,
                employeeKey: ownerKey,
                firstName: input.firstName,
                middleName: input.middleName ?? null,
                lastName: input.lastName,
                nationalIdNumber: input.nationalIdNumber ?? null,
                passportNumber: input.passportNumber ?? null,
                nssfNumber: input.nssfNumber ?? null,
                kraPin: input.kraPin ?? null,
                shaNumber: input.shaNumber ?? null,
                jobGroupId: input.jobGroupId ?? null,
                hireDate: input.hireDate,
            };
            if (role === 'TEACHER') {
                await tx.insert(teachers).values(profile);
            } else {
                await tx.insert(staff).values({
                    ...profile,
                    department: input.department,
                    jobTitle: input.jobTitle,
                });
            }
            return createdUser;
        });

        try {
            await sendTemporaryCredentials({
                to: user.email,
                firstName: input.firstName,
                role,
                temporaryPassword,
            });
        } catch (error) {
            await database.update(users).set({ isActive: false }).where(eq(users.id, user.id));
            throw new BadRequestError(
                'Employee was created but credentials could not be delivered; the account has been deactivated.',
                null,
                { cause: error },
            );
        }

        await recordAudit({
            action: 'CREATE',
            actorId: actor.id,
            schoolId,
            entityType: role === 'TEACHER' ? 'Teacher' : 'Staff',
            entityId: profileId,
            ipAddress,
            userAgent,
            metadata: { userId: user.id, email: user.email, credentialsDelivered: true },
        });

        return {
            id: profileId,
            userId: user.id,
            email: user.email,
            role,
            schoolId,
            employeeKey: generatedOwnerKey,
            employeeNo: generatedEmployeeNo,
            mustChangePassword: true,
            ...(env.NODE_ENV !== 'production' ? { temporaryPassword } : {}),
        };
    }
}
