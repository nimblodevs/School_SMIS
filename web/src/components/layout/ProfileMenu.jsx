import { useState } from 'react';
import { BadgeCheck, ChevronDown, LogOut, School, UserRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/useAuth.js';

export function ProfileMenu({ signedIn }) {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');
  if (!signedIn) return null;

  const { user, isSchoolAdmin } = signedIn;
  const userName = user?.name || user?.fullName || user?.email || 'Account';
  const profilePath = isSchoolAdmin ? '/school/profile' : '/profile';
  const initials = userName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join('');

  const logOut = async () => {
    setError('');
    try {
      await logout();
    } catch (logoutError) {
      setError(logoutError.message);
      return;
    }
    setIsOpen(false);
    navigate('/', { replace: true });
  };

  return (
    <details
      className="group relative"
      open={isOpen}
      onToggle={(event) => setIsOpen(event.currentTarget.open)}
    >
      <summary
        aria-label="Open profile menu"
        className="flex cursor-pointer list-none items-center gap-2 rounded-2xl border border-line/80 bg-white p-1 pr-2 shadow-[0_5px_18px_-13px_rgba(13,47,34,0.55)] transition hover:border-forest/20 hover:shadow-[0_8px_22px_-13px_rgba(13,47,34,0.5)] focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none [&::-webkit-details-marker]:hidden"
      >
        <span className="relative grid size-9 place-items-center rounded-xl bg-gradient-to-br from-forest via-forest to-[#3d9164] text-xs font-bold text-white shadow-inner">
          {initials || <UserRound aria-hidden="true" className="size-4" />}
          <span
            aria-label="Signed in"
            className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-white bg-emerald-400"
          />
        </span>
        <span className="hidden max-w-32 text-left sm:block">
          <span className="block truncate text-xs font-semibold text-deep">{userName}</span>
          <span className="mt-0.5 block text-[10px] font-medium text-muted">
            {isSchoolAdmin ? 'School administrator' : user?.role || 'Account'}
          </span>
        </span>
        <ChevronDown
          aria-hidden="true"
          className="size-4 text-muted transition-transform group-open:rotate-180"
        />
      </summary>
      <div className="absolute right-0 z-50 mt-3 w-[min(19rem,calc(100vw-2rem))] origin-top-right overflow-hidden rounded-3xl border border-line/80 bg-white p-2 shadow-[0_24px_65px_-24px_rgba(13,47,34,0.42)] ring-1 ring-black/[0.03]">
        <div className="relative overflow-hidden rounded-[1.25rem] bg-sidebar px-4 py-4 text-white">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-80"
            style={{
              background:
                'radial-gradient(circle at 95% 5%, rgba(102,190,137,0.35), transparent 38%)',
            }}
          />
          <div className="relative flex items-center gap-3">
            <span className="grid size-11 shrink-0 place-items-center rounded-2xl border border-white/15 bg-white/10 text-sm font-bold text-mint-strong shadow-inner">
              {initials || <UserRound aria-hidden="true" className="size-5" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{userName}</p>
              {user?.email ? (
                <p className="mt-0.5 truncate text-xs text-white/60">{user.email}</p>
              ) : null}
            </div>
          </div>
          <span className="relative mt-3 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.08] px-2.5 py-1 text-[10px] font-semibold text-white/80">
            <BadgeCheck aria-hidden="true" className="size-3.5 text-mint-strong" />
            {isSchoolAdmin ? 'School administrator' : user?.role || 'Account'}
          </span>
        </div>
        <Link
          to={profilePath}
          onClick={() => setIsOpen(false)}
          className="mt-2 flex min-h-11 items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-deep transition hover:bg-mint/45 hover:text-accent focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-page text-forest">
            {isSchoolAdmin ? (
              <School aria-hidden="true" className="size-4" />
            ) : (
              <UserRound aria-hidden="true" className="size-4" />
            )}
          </span>
          <span className="flex-1">{isSchoolAdmin ? 'School profile' : 'My profile'}</span>
          <ChevronDown aria-hidden="true" className="size-3.5 -rotate-90 text-muted" />
        </Link>
        <div className="mx-2 my-1 border-t border-line/80" />
        <button
          type="button"
          onClick={() => void logOut()}
          className="flex min-h-11 w-full items-center gap-3 rounded-2xl px-3 text-sm font-semibold text-error transition hover:bg-error-soft/70 focus-visible:ring-2 focus-visible:ring-error focus-visible:outline-none"
        >
          <span className="grid size-8 place-items-center rounded-xl bg-error-soft">
            <LogOut aria-hidden="true" className="size-4" />
          </span>
          Log out
        </button>
        {error ? <p role="alert" className="px-3 py-2 text-xs text-error">{error}</p> : null}
      </div>
    </details>
  );
}
