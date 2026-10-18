import { BookOpen, ChevronRight } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getMockSchoolAccount } from '../../lib/mockSchoolAccount.js';
import { mockSession } from '../../lib/mockSession.js';
import { useAuth } from '../../lib/useAuth.js';
import { ProfileMenu } from './ProfileMenu.jsx';

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
  '/auth/reset-password': 'Reset password',
  '/auth/change-password': 'Change password',
  '/auth/resend-otp': 'Request a new code',
};

export function Navbar() {
  const { pathname, state } = useLocation();
  const { user } = useAuth();
  const title = pageTitles[pathname] || 'Page not found';
  const account = getMockSchoolAccount();
  const signedIn = user
    ? {
        user: { ...user, name: user.fullName },
        isSchoolAdmin: user.role === 'school_admin',
      }
    : null;
  const schoolName =
    account?.school?.schoolName || state?.school?.schoolName || mockSession.school.name;

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
            <ChevronRight aria-hidden="true" className="size-3.5 shrink-0 text-line" />
            <span className="truncate text-sm font-semibold text-deep">{title}</span>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-1 text-sm sm:gap-2">
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
    </header>
  );
}
