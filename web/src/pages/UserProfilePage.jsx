import { Link } from 'react-router-dom';
import { useAuth } from '../lib/useAuth.js';

export function UserProfilePage() {
  const user = useAuth((state) => state.user);

  const fullName = user.fullName || 'School SMIS user';
  const role = user.role || 'User';

  return (
    <section className="mx-auto w-full max-w-3xl space-y-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-forest">Account</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-deep">My profile</h1>
        <p className="mt-2 text-sm text-muted">Your personal account information.</p>
      </div>

      <dl className="divide-y divide-line rounded-3xl border border-line bg-white px-5 shadow-sm sm:px-7">
        {[
          ['Full name', fullName],
          ['Email address', user.email || 'Not provided'],
          ['Role', role],
        ].map(([label, value]) => (
          <div key={label} className="grid gap-1 py-5 sm:grid-cols-[160px_1fr] sm:gap-4">
            <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
            <dd className="text-sm font-medium text-deep">{value}</dd>
          </div>
        ))}
      </dl>

      <Link
        to="/overview"
        className="inline-flex min-h-10 items-center rounded-xl bg-forest px-4 text-sm font-semibold text-white transition hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
      >
        Go to dashboard
      </Link>
    </section>
  );
}
