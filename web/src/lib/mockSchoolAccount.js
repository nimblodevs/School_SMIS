const accountStorageKey = 'schoolSmisMockAccount';

export function saveMockSchoolAccount(account) {
  window.sessionStorage.setItem(accountStorageKey, JSON.stringify(account));
}

export function getMockSchoolAccount() {
  const storedAccount = window.sessionStorage.getItem(accountStorageKey);
  return storedAccount ? JSON.parse(storedAccount) : null;
}

export function signOutMockAccount() {
  window.sessionStorage.removeItem(accountStorageKey);
}

export function getSignedInMockAccount() {
  const account = getMockSchoolAccount();
  if (!account || account.requiresPasswordChange) return null;

  const user = account.user || account.primaryAdmin || null;
  const role = String(user?.role || account.role || '')
    .toLowerCase()
    .replace(/[_-]+/g, ' ');
  const isSchoolAdmin =
    role.includes('school admin') ||
    role.includes('school administrator') ||
    Boolean(account.primaryAdmin && account.school);
  const isSignedIn = Boolean(account.user || account.primaryAdmin || account.userId);

  return isSignedIn ? { account, user, isSchoolAdmin } : null;
}

export function completeMockFirstLogin() {
  const account = getMockSchoolAccount();
  if (!account) {
    throw new Error('Cannot complete first login without a mock school account.');
  }

  const updatedAccount = { ...account, requiresPasswordChange: false };
  saveMockSchoolAccount(updatedAccount);
  return updatedAccount;
}
