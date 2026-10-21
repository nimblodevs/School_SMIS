import 'dotenv/config';
import argon2 from 'argon2';
import { eq, sql } from 'drizzle-orm';
import { pathToFileURL } from 'node:url';
import { closeDatabase, getDatabase } from '../src/db/client.js';
import { users } from '../src/db/schema.js';
import { seedUuid } from './seed.utils.js';

export function buildSuperAdminUser({ email, passwordHash }) {
    return {
        id: seedUuid('super-admin'),
        fullName: 'School SMIS Super Admin',
        username: null,
        email: email.trim().toLowerCase(),
        phone: null,
        passwordHash,
        role: 'SUPER_ADMIN',
        schoolId: null,
        isActive: true,
        mustChangePassword: false,
        emailVerifiedAt: new Date(),
    };
}

export async function seedSuperAdmin(database, user) {
    return database.transaction(async (tx) => {
        await tx.execute(sql`select set_config('app.is_super_admin', 'true', true)`);

        const [existingUser] = await tx
            .select({
                id: users.id,
                role: users.role,
                schoolId: users.schoolId,
            })
            .from(users)
            .where(eq(users.email, user.email))
            .limit(1);

        if (existingUser) {
            if (existingUser.role !== 'SUPER_ADMIN' || existingUser.schoolId !== null) {
                throw new Error(
                    `Refusing to change the existing account for ${user.email}; it is not a platform super admin.`,
                );
            }
            return { created: false, email: user.email };
        }

        await tx.insert(users).values(user);
        return { created: true, email: user.email };
    });
}

async function main() {
    if (process.env.NODE_ENV === 'production') {
        throw new Error('Refusing to seed a super-admin account in production.');
    }

    const email = process.env.SUPER_ADMIN_SEED_EMAIL?.trim();
    if (!email) {
        throw new Error('Set SUPER_ADMIN_SEED_EMAIL to the platform super-admin email address.');
    }

    const password =
        process.env.SUPER_ADMIN_SEED_PASSWORD || process.env.AUTH_SEED_PASSWORD;
    if (!password || password.length < 12) {
        throw new Error(
            'Set SUPER_ADMIN_SEED_PASSWORD or AUTH_SEED_PASSWORD to a development password of at least 12 characters.',
        );
    }

    const user = buildSuperAdminUser({
        email,
        passwordHash: await argon2.hash(password, { type: argon2.argon2id }),
    });
    const result = await seedSuperAdmin(getDatabase(), user);
    console.info(
        result.created
            ? `Created platform super-admin account for ${result.email}.`
            : `Platform super-admin account already exists for ${result.email}; its password was not changed.`,
    );
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
    try {
        await main();
    } catch (error) {
        console.error('Super-admin seed failed:', error);
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
