const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';

let sessionRefresh;

async function refreshSession() {
  if (!sessionRefresh) {
    sessionRefresh = fetch(`${apiBaseUrl}/auth/refresh`, {
      method: 'POST',
      credentials: 'include',
    })
      .then((response) => {
        if (!response.ok && [400, 401].includes(response.status)) {
          window.dispatchEvent(new Event('schoolSmisSessionExpired'));
        }
        return response.ok;
      })
      .finally(() => {
        sessionRefresh = undefined;
      });
  }
  return sessionRefresh;
}

export async function fetchWithSessionRefresh(url, options, refreshOnUnauthorized = true) {
  const response = await fetch(url, options);
  if (response.status !== 401 || !refreshOnUnauthorized) return response;

  const refreshed = await refreshSession();
  return refreshed ? fetch(url, options) : response;
}
