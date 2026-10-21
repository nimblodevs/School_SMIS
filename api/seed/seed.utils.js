import { createHash } from 'node:crypto';
import { SEED_SCHOOLS } from './data.js';

export const SEED_SCHOOL_COUNT = SEED_SCHOOLS.length;
export const SEED_USERS_PER_SCHOOL = 20;

export function sequence(value) {
  return String(value).padStart(3, '0');
}

export function seedUuid(value) {
  const bytes = createHash('sha1')
    .update(`school-smis-auth-seed:${value}`)
    .digest()
    .subarray(0, 16);
  bytes[6] = (bytes[6] & 0x0f) | 0x50;
  bytes[8] = (bytes[8] & 0x3f) | 0x80;
  const hex = bytes.toString('hex');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

export function seedSchoolId(schoolNumber) {
  return seedUuid(`school:${sequence(schoolNumber)}`);
}
