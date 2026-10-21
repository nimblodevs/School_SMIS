export async function nextInvoiceNo(tx, schoolId) {
    const year = new Date().getUTCFullYear();
    const [row] = await tx.$queryRaw`
    INSERT INTO invoice_sequences (school_id, year, next_val)
    VALUES (${schoolId}, ${year}, 1)
    ON CONFLICT (school_id, year)
    DO UPDATE SET next_val = invoice_sequences.next_val + 1
    RETURNING next_val
  `;
    return `INV-${year}-${String(row.next_val).padStart(6, '0')}`;
}

export async function nextPayslipNo(tx, schoolId) {
    const year = new Date().getUTCFullYear();
    const [row] = await tx.$queryRaw`
    INSERT INTO payslip_sequences (school_id, year, next_val)
    VALUES (${schoolId}, ${year}, 1)
    ON CONFLICT (school_id, year)
    DO UPDATE SET next_val = payslip_sequences.next_val + 1
    RETURNING next_val
  `;
    return `PS-${year}-${String(row.next_val).padStart(6, '0')}`;
}

export async function nextCreditNoteNo(tx, schoolId) {
    const year = new Date().getUTCFullYear();
    const [row] = await tx.$queryRaw`
    INSERT INTO credit_note_sequences (school_id, year, next_val)
    VALUES (${schoolId}, ${year}, 1)
    ON CONFLICT (school_id, year)
    DO UPDATE SET next_val = credit_note_sequences.next_val + 1
    RETURNING next_val
  `;
    return `CN-${year}-${String(row.next_val).padStart(6, '0')}`;
}

export function schoolInitials(schoolName) {
    const words = schoolName.replace(/['’]/g, '').match(/[\p{L}\p{N}]+/gu) || [];
    const initials = words
        .filter((word) => /^\p{L}/u.test(word))
        .map((word) => word[0].toUpperCase())
        .join('');
    return initials || 'SCH';
}

export async function nextAdmissionNo(tx, schoolId, schoolName) {
    const school = await tx.school.update({
        where: { id: schoolId },
        data: { nextStudentSequence: { increment: 1 } },
        select: { nextStudentSequence: true },
    });
    return `${schoolInitials(schoolName)}${String(school.nextStudentSequence).padStart(4, '0')}`;
}

export async function nextAdmissionApplicationNo(tx, schoolId, schoolName, year) {
    const [row] = await tx.$queryRaw`
    INSERT INTO admission_application_sequences ("schoolId", year, next_val)
    VALUES (${schoolId}, ${year}, 1)
    ON CONFLICT ("schoolId", year)
    DO UPDATE SET next_val = admission_application_sequences.next_val + 1
    RETURNING next_val
  `;
    const shortYear = String(year).slice(-2);
    return `${schoolInitials(schoolName)}${shortYear}${String(row.next_val).padStart(6, '0')}`;
}
