// Platform-level identifiers that must never become a school portal slug because they
// collide with workspace routes, API prefixes, or the demo tenant.
export const RESERVED_SCHOOL_SLUGS = Object.freeze([
    'admin',
    'api',
    'app',
    'auth',
    'dashboard',
    'login',
    'onboarding',
    'platform',
    'school',
    'schools',
    'smis',
    'super-admin',
    'workspace',
]);

export const SCHOOL_SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const SCHOOL_PHONE_PATTERN = /^\+?[\d][\d\s().-]{6,18}$/;

export const AVAILABILITY_REASONS = Object.freeze({
    available: 'AVAILABLE',
    taken: 'TAKEN',
    reserved: 'RESERVED',
    invalid: 'INVALID',
});
