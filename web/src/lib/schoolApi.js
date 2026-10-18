const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || '/api';
const accountStorageKey = 'schoolSmisMockAccount';

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${apiBaseUrl}${path}`, { credentials: 'include', ...options });
  } catch (error) {
    throw new Error('Cannot reach the school API. Start the API server and check its configuration.', {
      cause: error,
    });
  }

  const contentType = response.headers.get('content-type') || '';
  const result = contentType.includes('application/json')
    ? await response.json()
    : null;
  if (!response.ok) {
    throw new Error(
      result?.error?.message || `School API request failed with status ${response.status}.`,
    );
  }
  return result;
}

export function listSchools({
  page = 1,
  pageSize = 10,
  search = '',
  schoolType = 'all',
  ownershipType = 'all',
  sort = 'asc',
  signal,
} = {}) {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
    search,
    schoolType,
    ownershipType,
    sort,
  });
  return request(`/schools?${params}`, { signal });
}

export async function getSchool(schoolId, { signal } = {}) {
  const result = await request(`/schools/${encodeURIComponent(schoolId)}`, { signal });
  return result.data;
}

export async function createSchool(school, documents = {}) {
  const formData = new FormData();
  formData.append('school', JSON.stringify(school));
  Object.entries(documents).forEach(([documentType, file]) => {
    if (file) formData.append(documentType, file);
  });
  const result = await request('/schools', {
    method: 'POST',
    body: formData,
  });
  return result.data;
}

export async function ensureSchoolApiRecord() {
  const storedValue = window.sessionStorage.getItem(accountStorageKey);
  const account = storedValue ? JSON.parse(storedValue) : null;
  if (!account?.school) return null;

  const schoolId = account.schoolId || account.school.id;
  if (schoolId) {
    const school = await getSchool(schoolId);
    const updatedAccount = { ...account, schoolId, school, primaryAdmin: school.primaryAdmin };
    window.sessionStorage.setItem(accountStorageKey, JSON.stringify(updatedAccount));
    return updatedAccount;
  }

  const match = await listSchools({
    page: 1,
    pageSize: 100,
    search: account.school.schoolCode,
  });
  const existing = match.data.find(
    ({ schoolCode }) => schoolCode.toLowerCase() === account.school.schoolCode.toLowerCase(),
  );
  if (!existing) {
    throw new Error(
      'This school profile is only saved in this browser. Complete onboarding with the required documents to register it in the API.',
    );
  }
  const school = existing;
  const updatedAccount = {
    ...account,
    schoolId: school.id,
    school,
    primaryAdmin: school.primaryAdmin || account.primaryAdmin,
  };
  window.sessionStorage.setItem(accountStorageKey, JSON.stringify(updatedAccount));
  return updatedAccount;
}

export async function updateSchool(schoolId, school) {
  const result = await request(`/schools/${encodeURIComponent(schoolId)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(school),
  });
  return result.data;
}

export async function addSchoolBranch(schoolId, branch) {
  const result = await request(`/schools/${encodeURIComponent(schoolId)}/branches`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(branch),
  });
  return result.data;
}

export async function uploadSchoolLogo(schoolId, file) {
  const formData = new FormData();
  formData.append('logo', file);
  const result = await request(`/schools/${encodeURIComponent(schoolId)}/logo`, {
    method: 'POST',
    body: formData,
  });
  return result.data;
}

export async function removeSchoolLogo(schoolId) {
  const result = await request(`/schools/${encodeURIComponent(schoolId)}/logo`, {
    method: 'DELETE',
  });
  return result.data;
}
