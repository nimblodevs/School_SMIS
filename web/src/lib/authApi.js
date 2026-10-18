const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

export class AuthApiError extends Error {
  constructor(message, { code, status, cause } = {}) {
    super(message, { cause });
    this.name = 'AuthApiError';
    this.code = code;
    this.status = status;
  }
}

async function request(path, body, method = 'POST') {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}/auth${path}`, {
      method,
      credentials: 'include',
      ...(body === undefined
        ? {}
        : {
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
          }),
    });
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
  verifyEmail: (values) => request('/verify-email', values),
  resendCode: (values) => request('/resend-code', values),
  forgotPassword: (values) => request('/forgot-password', values),
  resetPassword: (values) => request('/reset-password', values),
  changePassword: (values) => request('/change-password', values),
  currentUser: () => request('/me', undefined, 'GET'),
  logout: () => request('/logout'),
};
