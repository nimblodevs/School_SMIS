import { ArrowLeft, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <section className="flex min-h-[60vh] items-center justify-center px-6 py-12">
      <section className="w-full max-w-lg text-center">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-mint text-forest">
          <Compass aria-hidden="true" className="size-8" strokeWidth={1.75} />
        </div>

        <p className="mt-8 text-sm font-semibold tracking-[0.18em] text-forest uppercase">
          Page not found
        </p>
        <h1 className="mt-3 text-7xl font-semibold tracking-tight text-deep sm:text-8xl">
          404
        </h1>
        <p className="mt-4 text-lg font-semibold text-ink">
          We couldn’t find that page.
        </p>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-muted">
          The link may be outdated, or the page may have moved. Head back to the
          School SMIS home page to continue.
        </p>

        <Link
          to="/"
          className="mt-8 inline-flex h-12 items-center justify-center gap-2 rounded-xl bg-forest px-5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
        >
          <ArrowLeft aria-hidden="true" className="size-4" />
          Back to home
        </Link>
      </section>
    </section>
  );
}
