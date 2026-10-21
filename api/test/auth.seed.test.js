import { describe, expect, it } from 'vitest';
import { buildSeedUsers } from '../seed/auth.seed.js';
import { buildSeedSchools } from '../seed/schools.seed.js';
import { buildSuperAdminUser } from '../seed/super-admin.seed.js';

describe('authentication seed data', () => {
  it('builds 20 uniquely identified users for each seeded school', () => {
    const schools = buildSeedSchools();
    const users = buildSeedUsers('test-password-hash');

    expect(schools).toHaveLength(19);
    expect(users).toHaveLength(380);
    expect(new Set(users.map(({ id }) => id)).size).toBe(380);
    expect(new Set(users.map(({ email }) => email)).size).toBe(380);
    expect(new Set(users.map(({ username }) => username)).size).toBe(380);

    const usersBySchool = new Map();
    users.forEach((user) => {
      usersBySchool.set(user.schoolId, (usersBySchool.get(user.schoolId) ?? 0) + 1);
      expect(user.email.endsWith('.seed.smis.test')).toBe(true);
    });
    for (const school of schools) {
      expect(usersBySchool.get(school.id)).toBe(20);
    }
  });

  it('assigns the documented role mix at each school', () => {
    const users = buildSeedUsers('test-password-hash');
    const roleCounts = users.slice(0, 20).reduce((counts, { role }) => {
      counts[role] = (counts[role] ?? 0) + 1;
      return counts;
    }, {});

    expect(roleCounts).toEqual({
      ADMIN: 1,
      MANAGER: 1,
      TEACHER: 8,
      STAFF: 5,
      BURSAR: 2,
      PARENT: 2,
      STUDENT: 1,
    });
  });

  it('builds an unassigned platform super-admin with a normalized email', () => {
    const user = buildSuperAdminUser({
      email: '  Admin@School-SMIS.test ',
      passwordHash: 'test-password-hash',
    });

    expect(user).toMatchObject({
      fullName: 'School SMIS Super Admin',
      email: 'admin@school-smis.test',
      passwordHash: 'test-password-hash',
      role: 'SUPER_ADMIN',
      schoolId: null,
      isActive: true,
      mustChangePassword: false,
    });
    expect(user.id).toBeTruthy();
    expect(user.emailVerifiedAt).toBeInstanceOf(Date);
  });
});
