import { env } from '../../config/env.js';
import {
    SCHOOL_PHONE_PATTERN,
    SCHOOL_SLUG_PATTERN,
} from './onboarding.constants.js';

const MAX_SLUG_LENGTH = 60;
const MIN_SLUG_LENGTH = 3;

// Format gates for the availability endpoint. It answers "is this usable?" with a structured
// verdict instead of throwing validation errors, so half-typed identifiers return INVALID.
export function isSlugFormat(value) {
    return (
        typeof value === 'string' &&
        value.length >= MIN_SLUG_LENGTH &&
        value.length <= MAX_SLUG_LENGTH &&
        SCHOOL_SLUG_PATTERN.test(value)
    );
}

export function isPhoneFormat(value) {
    return typeof value === 'string' && value.length <= 20 && SCHOOL_PHONE_PATTERN.test(value);
}

// Mirror of the web onboarding slug suggestion so a server-derived slug never disagrees with the UI.
export function toSchoolSlug(value) {
    return value
        .normalize('NFKD')
        .replaceAll(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replaceAll('&', ' and ')
        .replaceAll(/[^a-z0-9]+/g, '-')
        .replaceAll(/-{2,}/g, '-')
        .replaceAll(/^-|-$/g, '')
        .slice(0, MAX_SLUG_LENGTH);
}

// Canonical form for the globally unique School.phone column so duplicate detection is reliable.
export function normalizePhoneNumber(value) {
    const trimmed = value.trim();
    const digits = trimmed.replaceAll(/\D/g, '');
    return trimmed.startsWith('+') ? `+${digits}` : digits;
}

export function buildPortalUrl(slug) {
    const base = (env.SCHOOL_PORTAL_BASE_URL ?? 'https://schools.smis.app').replace(/\/+$/, '');
    return `${base}/${slug}`;
}

export function buildOnboardingReference(school) {
    const fragment = school.id.replaceAll('-', '').slice(0, 6).toUpperCase();
    return `SMIS-ONB-${school.schoolCode}-${fragment}`;
}
