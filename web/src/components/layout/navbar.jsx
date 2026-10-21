import { useEffect, useState } from 'react';
import { BookOpen, ChevronRight } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { getMockSchoolAccount } from '../../lib/mockSchoolAccount.js';
import { mockSession } from '../../lib/mockSession.js';
import { authApi } from '../../lib/authApi.js';
import { listSchoolBranches, listSchools } from '../../lib/schoolApi.js';
import { useAuth } from '../../lib/useAuth.js';
import { ProfileMenu } from './ProfileMenu.jsx';

const scopeStorageKeys = {
  school: 'schoolSmisSupportSchoolId',
  branch: 'schoolSmisSupportBranchId',
};

const pageTitles = {
  '/': 'School name',
  '/overview': 'Overview',
  '/onboarding': 'School onboarding',
  '/school/profile': 'School profile',
  '/school/directory': 'School directory',
  '/profile': 'My profile',
  '/auth': 'Sign in',
  '/auth/login': 'Sign in',
  '/auth/register': 'Create account',
  '/auth/forgot-password': 'Recover account',
  '/auth/verify-otp': 'Verify email',
  '/auth/verify-login-otp': 'Verify login',
  '/auth/reset-password': 'Reset password',
  '/auth/change-password': 'Change password',
  '/auth/resend-otp': 'Request a new code',
};

export function Navbar() {
  const { pathname, state } = useLocation();
  const navigate = useNavigate();
  const user = useAuth((state) => state.user);
  const setUser = useAuth((state) => state.setUser);
  const stopImpersonation = useAuth((state) => state.stopImpersonation);
  const [schools, setSchools] = useState([]);
  const [branches, setBranches] = useState([]);
  const [impersonationUsers, setImpersonationUsers] = useState([]);
  const [schoolId, setSchoolId] = useState(
    () => window.sessionStorage.getItem(scopeStorageKeys.school) || '',
  );
  const [branchId, setBranchId] = useState(
    () => window.sessionStorage.getItem(scopeStorageKeys.branch) || 'all',
  );
  const [userId, setUserId] = useState('');
  const [userSearch, setUserSearch] = useState('');
  const [scopeError, setScopeError] = useState('');
  const [isLoadingSchools, setIsLoadingSchools] = useState(false);
  const [isLoadingBranches, setIsLoadingBranches] = useState(false);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);
  const isSuperAdmin =
    !import.meta.env.PROD && user?.role === 'SUPER_ADMIN' && !user.isImpersonated;
  const isImpersonating = Boolean(user?.isImpersonated);

  useEffect(() => {
    if (!isSuperAdmin) return undefined;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active) setIsLoadingSchools(true);
        return listSchools({ page: 1, pageSize: 100, isActive: true });
      })
      .then((result) => {
        if (!active) return;
        const activeSchools = result.data.schools;
        setSchools(activeSchools);
        setSchoolId((currentId) => {
          const nextId = activeSchools.some(({ id }) => id === currentId)
            ? currentId
            : activeSchools[0]?.id || '';
          if (nextId) window.sessionStorage.setItem(scopeStorageKeys.school, nextId);
          else window.sessionStorage.removeItem(scopeStorageKeys.school);
          return nextId;
        });
      })
      .catch((error) => {
        if (active) setScopeError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingSchools(false);
      });
    return () => {
      active = false;
    };
  }, [isSuperAdmin]);

  useEffect(() => {
    if (!isSuperAdmin || !schoolId) return undefined;
    let active = true;
    Promise.resolve()
      .then(() => {
        if (active) {
          setIsLoadingBranches(true);
          setScopeError('');
        }
        return listSchoolBranches(schoolId);
      })
      .then((result) => {
        if (!active) return;
        setBranches(result);
        setBranchId((currentId) => {
          const nextId =
            currentId === 'all' ||
            currentId === 'unassigned' ||
            result.some(({ id }) => id === currentId)
              ? currentId
              : 'all';
          window.sessionStorage.setItem(scopeStorageKeys.branch, nextId);
          return nextId;
        });
      })
      .catch((error) => {
        if (active) setScopeError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingBranches(false);
      });
    return () => {
      active = false;
    };
  }, [isSuperAdmin, schoolId]);

  useEffect(() => {
    if (!isSuperAdmin || !schoolId) return undefined;
    let active = true;
    const searchTimer = window.setTimeout(() => {
      if (!active) return;
      setIsLoadingUsers(true);
      setScopeError('');
      void authApi.listImpersonationUsers(schoolId, branchId, userSearch)
        .then((result) => {
          if (!active) return;
          const activeUsers = result.data.users.filter(
            ({ role, isActive }) => role !== 'SUPER_ADMIN' && isActive,
          );
          setImpersonationUsers(activeUsers);
          setUserId((currentId) =>
            activeUsers.some(({ id }) => id === currentId) ? currentId : '',
          );
        })
        .catch((error) => {
          if (active) setScopeError(error.message);
        })
        .finally(() => {
          if (active) setIsLoadingUsers(false);
        });
    }, 250);
    return () => {
      active = false;
      window.clearTimeout(searchTimer);
    };
  }, [isSuperAdmin, schoolId, branchId, userSearch]);

  const changeSchool = (nextSchoolId) => {
    setSchoolId(nextSchoolId);
    setBranchId('all');
    setUserId('');
    window.sessionStorage.setItem(scopeStorageKeys.school, nextSchoolId);
    window.sessionStorage.setItem(scopeStorageKeys.branch, 'all');
    window.dispatchEvent(new Event('schoolSmisSupportScopeChanged'));
  };

  const changeBranch = (nextBranchId) => {
    setBranchId(nextBranchId);
    setUserId('');
    window.sessionStorage.setItem(scopeStorageKeys.branch, nextBranchId);
    window.dispatchEvent(new Event('schoolSmisSupportScopeChanged'));
  };

  const beginImpersonation = async () => {
    if (!userId) return;
    setScopeError('');
    setIsSwitching(true);
    try {
      const result = await authApi.impersonate(userId);
      setUser({
        ...result.data.user,
        isImpersonated: true,
        actorId: result.data.actorId,
      });
      navigate('/overview', { replace: true });
    } catch (error) {
      setScopeError(error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const endImpersonation = async () => {
    setScopeError('');
    setIsSwitching(true);
    try {
      await stopImpersonation();
      navigate('/overview', { replace: true });
    } catch (error) {
      setScopeError(error.message);
    } finally {
      setIsSwitching(false);
    }
  };

  const title = pageTitles[pathname] || 'Page not found';
  const account = getMockSchoolAccount();
  const signedIn = user
    ? {
        user: { ...user, name: user.fullName },
        isSchoolAdmin: user.role === 'school_admin',
      }
    : null;
  const selectedSchool = schools.find(({ id }) => id === schoolId);
  const selectedBranch = branches.find(({ id }) => id === branchId);
  const schoolName =
    (isSuperAdmin && selectedSchool?.schoolName) ||
    user?.school?.name ||
    state?.school?.schoolName ||
    (user?.schoolId && account?.schoolId === user.schoolId
      ? account.school?.schoolName
      : '') ||
    (user
      ? user.role === 'SUPER_ADMIN'
        ? 'School SMIS'
        : user.schoolId
          ? 'School workspace'
          : 'No school registered'
      : account?.school?.schoolName || mockSession.school.name);
  const scopeLabel = selectedBranch?.name || (branchId === 'unassigned' ? 'Unassigned people' : '');

  return (
    <header className="sticky top-0 z-20 col-span-full bg-white/95 backdrop-blur-xl">
      <div className="flex min-h-[4.5rem] items-stretch">
        <Link
          to="/"
          aria-label="School SMIS home"
          className="flex w-44 shrink-0 items-center gap-3 bg-sidebar px-4 text-white focus-visible:ring-4 focus-visible:ring-mint-strong/40 focus-visible:outline-none md:w-[17rem] md:px-6"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-[14px] bg-white text-forest shadow-[0_6px_14px_-7px_rgba(0,0,0,0.45)]">
            <BookOpen aria-hidden="true" className="size-5" />
          </span>
          <span className="min-w-0">
            <span className="block text-[15px] font-bold tracking-tight">
              School<span className="text-mint-strong">SMIS</span>
            </span>
            <span className="hidden text-[10px] font-medium tracking-wide text-white/50 sm:block">
              SCHOOL MANAGEMENT
            </span>
          </span>
        </Link>

        <div className="flex min-w-0 flex-1 items-center justify-between gap-3 px-3 sm:px-5 lg:px-8">
          <div className="hidden min-w-0 flex-1 items-center gap-2 lg:flex">
            <span className="truncate text-xs font-medium text-muted">{schoolName}</span>
            {isSuperAdmin && scopeLabel ? (
              <>
                <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-line" />
                <span className="truncate text-xs font-medium text-muted">{scopeLabel}</span>
              </>
            ) : null}
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-line" />
            <span className="truncate text-sm font-semibold text-deep">{title}</span>
          </div>

          <div className="ml-auto flex min-w-0 flex-wrap items-center justify-end gap-2 text-sm">
            {isSuperAdmin ? (
              <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto">
                <label className="sr-only" htmlFor="support-school">School context</label>
                <select
                  id="support-school"
                  aria-label="School context"
                  value={schoolId}
                  onChange={(event) => changeSchool(event.target.value)}
                  disabled={isLoadingSchools || schools.length === 0 || isSwitching}
                  className="max-w-52 rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                >
                  {isLoadingSchools && schools.length === 0 ? <option value="">Loading schools…</option> : null}
                  {schools.map((school) => (
                    <option key={school.id} value={school.id}>{school.schoolName}</option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="support-branch">Branch context</label>
                <select
                  id="support-branch"
                  aria-label="Branch context"
                  value={branchId}
                  onChange={(event) => changeBranch(event.target.value)}
                  disabled={isLoadingBranches || !schoolId || isSwitching}
                  className="max-w-44 rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                >
                  <option value="all">All branches</option>
                  <option value="unassigned">Unassigned people</option>
                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>{branch.name}</option>
                  ))}
                </select>
                <label className="sr-only" htmlFor="support-user-search">
                  Search users to impersonate
                </label>
                <input
                  id="support-user-search"
                  type="search"
                  value={userSearch}
                  onChange={(event) => setUserSearch(event.target.value)}
                  placeholder="Search users"
                  disabled={!schoolId || isSwitching}
                  className="max-w-36 rounded-xl border border-line bg-white px-3 py-2 text-xs text-deep placeholder:text-muted focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                />
                <label className="sr-only" htmlFor="support-user">Impersonate user</label>
                <select
                  id="support-user"
                  aria-label="User to impersonate"
                  value={userId}
                  onChange={(event) => setUserId(event.target.value)}
                  disabled={isLoadingUsers || !schoolId || isSwitching || impersonationUsers.length === 0}
                  className="max-w-52 rounded-xl border border-line bg-white px-3 py-2 text-xs font-medium text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
                >
                  <option value="">
                    {isLoadingUsers ? 'Loading users…' : impersonationUsers.length ? 'Select a user…' : 'No users found'}
                  </option>
                  {impersonationUsers.map((targetUser) => (
                    <option key={targetUser.id} value={targetUser.id}>
                      {targetUser.fullName} · {targetUser.role}
                    </option>
                  ))}
                </select>
                <button
                  type="button"
                  onClick={() => void beginImpersonation()}
                  disabled={!userId || isSwitching}
                  className="rounded-xl bg-forest px-3 py-2 text-xs font-semibold text-white transition hover:bg-deep disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSwitching ? 'Switching…' : 'View as'}
                </button>
              </div>
            ) : null}
            {isImpersonating ? (
              <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2">
                <span className="text-xs font-semibold text-amber-950">Impersonating {user.fullName || user.email}</span>
                <button
                  type="button"
                  onClick={() => void endImpersonation()}
                  disabled={isSwitching}
                  className="rounded-lg bg-amber-900 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-950 disabled:opacity-50"
                >
                  {isSwitching ? 'Returning…' : 'Stop'}
                </button>
              </div>
            ) : null}
            {signedIn ? (
              <ProfileMenu signedIn={signedIn} />
            ) : pathname.startsWith('/auth') ? (
              <Link
                to="/onboarding"
                className="inline-flex items-center gap-1.5 rounded-xl bg-deep px-3 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-forest focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:px-4 sm:text-sm"
              >
                Create school profile
              </Link>
            ) : (
              <>
                <Link
                  to="/auth/login"
                  className="inline-flex rounded-xl px-2 py-2.5 text-xs font-semibold text-accent transition-colors hover:bg-page hover:text-accent-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:px-3.5 sm:text-sm"
                >
                  Sign in
                </Link>
                <Link
                  to="/onboarding"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-deep px-2.5 py-2.5 text-[11px] font-semibold text-white shadow-sm transition-all hover:bg-forest focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:gap-2 sm:px-4 sm:text-sm"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
      {scopeError ? (
        <p role="alert" className="px-4 pb-2 text-right text-xs text-error sm:px-6 lg:px-8">
          {scopeError}
        </p>
      ) : null}
    </header>
  );
}
