export function parseTrustProxy(value) {
    if (value === false || value === undefined || value === null) return false;
    if (value === true) {
        throw new Error('TRUST_PROXY=true is unsafe; use a trusted proxy hop count or proxy address.');
    }
    if (typeof value === 'number') {
        if (!Number.isInteger(value) || value < 0) {
            throw new Error('TRUST_PROXY hop count must be a non-negative integer.');
        }
        return value;
    }

    const normalized = value.trim();
    if (!normalized || normalized.toLowerCase() === 'false') return false;
    if (normalized.toLowerCase() === 'true') {
        throw new Error('TRUST_PROXY=true is unsafe; use a trusted proxy hop count or proxy address.');
    }
    if (/^-\d+$/.test(normalized)) {
        throw new Error('TRUST_PROXY hop count must be a non-negative integer.');
    }
    if (/^\d+$/.test(normalized)) return Number(normalized);

    const proxyAddresses = normalized.split(',').map((address) => address.trim());
    if (proxyAddresses.some((address) => !address)) {
        throw new Error('TRUST_PROXY must contain valid proxy addresses.');
    }
    return proxyAddresses.length === 1 ? proxyAddresses[0] : proxyAddresses;
}
