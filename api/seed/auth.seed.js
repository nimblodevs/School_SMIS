import 'dotenv/config';
import argon2 from 'argon2';
import { pathToFileURL } from 'node:url';
import { inArray, sql } from 'drizzle-orm';
import { closeDatabase, getDatabase } from '../src/db/client.js';
import { schools, users } from '../src/db/schema.js';
import { SEED_FIRST_NAMES, SEED_LAST_NAMES } from './data.js';
import {
    SEED_SCHOOL_COUNT,
    SEED_USERS_PER_SCHOOL,
    seedSchoolId,
    seedUuid,
    sequence,
} from './seed.utils.js';

const USER_ROLES = [
    'ADMIN',
    'MANAGER',
    ...Array(8).fill('TEACHER'),
    ...Array(5).fill('STAFF'),
    ...Array(2).fill('BURSAR'),
    ...Array(2).fill('PARENT'),
    'STUDENT',
];
export function buildSeedUsers(passwordHash) {
    return Array.from({ length: SEED_SCHOOL_COUNT }, (_, schoolIndex) => {
        const schoolNumber = schoolIndex + 1;
        const schoolId = seedSchoolId(schoolNumber);

        return USER_ROLES.map((role, userIndex) => {
            const userNumber = userIndex + 1;
            const schoolLabel = sequence(schoolNumber);
            const userLabel = sequence(userNumber);

            return {
                id: seedUuid(`user:${schoolLabel}:${userLabel}`),
                fullName: `${SEED_FIRST_NAMES[userIndex]} ${SEED_LAST_NAMES[(schoolIndex + userIndex) % SEED_LAST_NAMES.length]}`,
                username: `seed.s${schoolLabel}.u${userLabel}`,
                email: `user${userLabel}@school${schoolLabel}.seed.smis.test`,
                phone: `+254711${String(schoolIndex * SEED_USERS_PER_SCHOOL + userNumber).padStart(6, '0')}`,
                passwordHash,
                role,
                schoolId,
                isActive: true,
                mustChangePassword: false,
                emailVerifiedAt: new Date(),
            };
        });
    }).flat();
}

export async function seedAuthData(database, passwordHash) {
    const userRows = buildSeedUsers(passwordHash);
    const schoolIds = Array.from({ length: SEED_SCHOOL_COUNT }, (_, index) => seedSchoolId(index + 1));

    return database.transaction(async (tx) => {
        await tx.execute(sql`select set_config('app.is_super_admin', 'true', true)`);
        const storedSchools = await tx
            .select({ id: schools.id })
            .from(schools)
            .where(inArray(schools.id, schoolIds));
        if (storedSchools.length !== SEED_SCHOOL_COUNT) {
            throw new Error(
                `Expected ${SEED_SCHOOL_COUNT} seed schools before seeding users, found ${storedSchools.length}. Run the school seed first.`,
            );
        }

        await tx.insert(users).values(userRows).onConflictDoNothing();
        const storedUsers = await tx
            .select({ id: users.id, schoolId: users.schoolId })
            .from(users)
            .where(inArray(users.id, userRows.map(({ id }) => id)));
        const expectedSchoolByUserId = new Map(
            userRows.map(({ id, schoolId }) => [id, schoolId]),
        );
        const usersMatchSchools =
            storedUsers.length === SEED_SCHOOL_COUNT * SEED_USERS_PER_SCHOOL &&
            storedUsers.every(
                (user) => user.schoolId === expectedSchoolByUserId.get(user.id),
            );
        if (!usersMatchSchools) {
            throw new Error(
                `Expected ${SEED_SCHOOL_COUNT * SEED_USERS_PER_SCHOOL} seed users linked to their seed schools, found ${storedUsers.length}. Check for conflicting seed user identifiers.`,
            );
        }

        return { schoolCount: storedSchools.length, userCount: storedUsers.length };
    });
}

async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Refusing to seed authentication data in production.');
    }

    const password = process.env.AUTH_SEED_PASSWORD;
    if (!password || password.length < 12) {
        throw new Error('Set AUTH_SEED_PASSWORD to a development password of at least 12 characters.');
    }

    const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
    const result = await seedAuthData(getDatabase(), passwordHash);
    console.info(`Ensured ${result.userCount} seed users.`);
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        await main();
    } catch (error) {
        console.error('Authentication seed failed:', error);
        process.exitCode = 1;
    } finally {
        try {
            await closeDatabase();
        } catch (error) {
            console.error('Failed to close the database connection:', error);
            process.exitCode = 1;
        }
    }
}
