import { sql } from 'drizzle-orm';
import { schools } from '../db/schema.js';
import { BadRequestError } from './errors/AppError.js';

const MAX_SCHOOL_CODE_LENGTH = 4;
const MAX_PREFIX_LENGTH = 4;

function schoolCodePrefix(schoolName) {
  const initials = schoolName
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .match(/[A-Za-z0-9]+/g)
    ?.map((word) => word[0])
    .join('')
    .toUpperCase()
    .slice(0, MAX_PREFIX_LENGTH);

  return initials || 'SCH';
}

export async function generateSchoolCode(tx, schoolName) {
  const prefix = schoolCodePrefix(schoolName);

  await tx.execute(sql`SELECT pg_advisory_xact_lock(hashtextextended('school_code_generation', 0))`);
  const existingRows = await tx
    .select({ schoolCode: schools.schoolCode })
    .from(schools);

  const existingCodes = new Set(existingRows.map(({ schoolCode }) => schoolCode.toUpperCase()));
  if (!existingCodes.has(prefix)) return prefix;

  for (let suffix = 1; suffix <= 10 ** MAX_SCHOOL_CODE_LENGTH - 1; suffix += 1) {
    const suffixText = String(suffix);
    const code = `${prefix.slice(0, MAX_SCHOOL_CODE_LENGTH - suffixText.length)}${suffixText}`;
    if (!existingCodes.has(code)) return code;
  }

  throw new BadRequestError(`No available school code can be generated from "${schoolName}"`);
}

export async function previewSchoolCode(database, schoolName) {
  return database.transaction((tx) => generateSchoolCode(tx, schoolName));
}
