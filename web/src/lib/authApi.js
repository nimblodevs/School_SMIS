import { fetchWithSessionRefresh } from './apiRequest.js';

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export class AuthApiError extends Error {
  constructor(message, { code, status, cause } = {}) {
    super(message, { cause });
    this.name = 'AuthApiError';
    this.code = code;
    this.status = status;
  }
}

async function request(
  path,
  body,
  method = 'POST',
  headers = {},
  refreshOnUnauthorized = false,
) {
  let response;
  try {
    response = await fetchWithSessionRefresh(`${apiBaseUrl}/auth${path}`, {
      method,
      credentials: 'include',
      ...(Object.keys(headers).length ? { headers } : {}),
      ...(body === undefined
        ? {}
        : {
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }),
    }, refreshOnUnauthorized);
  } catch (error) {
    throw new AuthApiError('Cannot reach the authentication service. Check that the API server is running.', {
      cause: error,
    });
  }

  const result = response.status === 204
    ? null
    : (response.headers.get('content-type') || '').includes('application/json')
      ? await response.json()
      : null;
  if (!response.ok) {
    throw new AuthApiError(
      result?.error?.message || `Authentication request failed with status ${response.status}.`,
      { code: result?.error?.code, status: response.status },
    );
  }
  return result;
}

export const authApi = {
  register: (values) => request('/register', values),
  login: (values) => request('/login', values),
  verifyLoginOtp: (values) => request('/verify-login-otp', values),
  resendLoginOtp: (challengeToken) => request('/resend-login-otp', { challengeToken }),
  verifyEmail: (values) => request('/verify-email', values),
  verifyOtp: (values) => request('/verify-otp', values),
  resendCode: (values) => request('/resend-code', values),
  forgotPassword: (values) => request('/forgot-password', values),
  resetPassword: (values) => request('/reset-password', values),
  changePassword: (values) => request('/change-password', values, 'POST', {}, true),
  currentUser: () => request('/me', undefined, 'GET', {}, true),
  logout: () => request('/logout', undefined, 'POST', {}, true),
  impersonate: (userId) => request(`/impersonate/${encodeURIComponent(userId)}`, undefined, 'POST', {}, true),
  stopImpersonation: () => request('/stop-impersonation', undefined, 'POST', {}, true),
  listImpersonationUsers: (schoolId, branchId = 'all', search = '') => {
    const params = new URLSearchParams({ page: '1', pageSize: '100' });
    if (branchId !== 'all') params.set('branchId', branchId);
    if (search.trim()) params.set('search', search.trim());
    return request(
      `/users?${params}`,
      undefined,
      'GET',
      { 'x-school-id': schoolId },
      true,
    );
  },
};
