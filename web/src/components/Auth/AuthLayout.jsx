import {
  ArrowLeft,
  BookOpen,
  Check,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export function AuthLayout({
  eyebrow,
  title,
  description,
  children,
  footer,
  formCard = false,
  centeredHeader = false,
  brandDetails = false,
  showBackLink = true,
}) {
  const shouldCenterHeader = centeredHeader || !brandDetails;

  return (
    <section className="flex min-h-svh w-full items-center justify-center">
      <div
        className={`w-full ${
          brandDetails
            ? 'grid min-h-svh grid-cols-1 overflow-hidden bg-[#fbfdfb] lg:grid-cols-[0.92fr_1.08fr]'
            : 'flex min-h-svh items-center justify-center bg-[radial-gradient(ellipse_at_top,rgba(232,244,238,0.65),transparent_48%),linear-gradient(145deg,#fff,#f8faf8)] px-5 py-8 sm:px-8'
        }`}
      >
        {brandDetails ? (
        <aside className="relative hidden overflow-hidden bg-transparent p-9 text-deep lg:flex lg:flex-col lg:justify-between xl:p-12">
          <Link
            to="/"
            aria-label="School SMIS home"
              className="relative inline-flex w-fit items-center gap-3 rounded-xl focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
          >
              <span className="grid size-11 place-items-center rounded-2xl border border-forest/10 bg-white text-forest shadow-[0_8px_24px_-16px_rgba(13,47,34,0.35)]">
              <BookOpen aria-hidden="true" className="size-5" />
            </span>
            <span>
              <span className="block text-base font-bold tracking-tight">
                  School<span className="text-forest">SMIS</span>
              </span>
                <span className="block text-[9px] font-semibold tracking-[0.14em] text-muted">
                SCHOOL MANAGEMENT
              </span>
            </span>
          </Link>

          <div className="relative mx-auto w-full max-w-md">
              <span className="inline-flex items-center gap-2 rounded-full border border-forest/10 bg-white/75 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-forest shadow-sm">
                <Sparkles aria-hidden="true" className="size-3.5 text-forest" />
              Your school, in sync
            </span>
            <h2 className="mt-6 text-4xl font-normal leading-[1.12] tracking-tight text-accent xl:text-[2.8rem]">
              A clearer way to manage school life.
            </h2>
            <p className="mt-4 max-w-sm text-sm leading-6 text-muted">
              Sign in to your workspace and bring your school’s people, places, and daily work together.
            </p>
            <div className="mt-8 space-y-3">
              {[
                'One organized home for your school',
                'A clear view of your school information',
                'A workspace that grows with your community',
              ].map((item) => (
                <div key={item} className="flex items-center gap-3 text-xs font-medium text-deep/80">
                  <span className="grid size-6 place-items-center rounded-full bg-mint text-forest">
                    <Check aria-hidden="true" className="size-3.5" />
                  </span>
                  {item}
                </div>
              ))}
            </div>
          </div>

          <div className="relative flex items-center gap-2 text-[11px] font-medium text-muted">
            <ShieldCheck aria-hidden="true" className="size-4 text-forest/70" />
            A thoughtful foundation for your school
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 -right-28 size-72 rounded-full border border-forest/[0.08]"
          />
        </aside>
        ) : null}

        <div
          className={`relative flex items-center justify-center ${
            brandDetails
              ? 'min-h-svh bg-transparent p-5 sm:p-8 lg:p-10 xl:p-14'
              : 'w-full max-w-xl'
          }`}
        >
          <div className="w-full max-w-md">
            <div
              className={
                brandDetails && formCard
                  ? 'rounded-[1.75rem] border border-[#dfe8e0] p-6 sm:p-8'
                  : !brandDetails
                  ? 'rounded-[1.75rem] border border-[#dfe8e0] bg-white p-6 shadow-[0_24px_60px_-38px_rgba(13,47,34,0.22)] sm:p-8'
                  : ''
              }
            >
              {showBackLink ? (
                <Link
                  to="/"
                  aria-label="School SMIS home"
                  className="mx-auto mb-8 flex w-fit items-center justify-center gap-2.5 rounded-xl focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
                >
                  <span className="grid size-10 place-items-center rounded-[14px] bg-forest text-white shadow-[0_8px_18px_-10px_rgba(26,107,69,0.8)]">
                    <BookOpen aria-hidden="true" className="size-[18px]" />
                  </span>
                  <span className="text-sm font-bold tracking-tight text-deep">
                    School<span className="text-forest">SMIS</span>
                    <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.12em] text-muted">
                      SCHOOL MANAGEMENT
                    </span>
                  </span>
                </Link>
              ) : null}
              <div className={`mb-7 ${shouldCenterHeader ? 'text-center' : ''}`}>
                <p
                  className="text-accent text-[11px] font-bold uppercase tracking-[0.2em]"
                >
                  {eyebrow}
                </p>
                <h1
                  className={`mt-3 text-3xl font-semibold leading-tight tracking-[-0.04em] text-deep sm:text-[2.2rem] ${
                    formCard ? 'font-serif' : ''
                  }`}
                >
                  {title}
                </h1>
                <p className={`mt-3 text-sm leading-6 text-[#66756b] ${
                  brandDetails && centeredHeader ? 'text-left' : shouldCenterHeader ? 'text-center' : ''
                }`}>
                  {description}
                </p>
              </div>

              <div>{children}</div>
            </div>
            {footer ? (
              <div className="mt-6 text-center text-xs leading-5 text-muted">
                {footer}
              </div>
            ) : null}

            {!brandDetails ? (
              <Link
                to="/"
                className="mt-6 inline-flex items-center gap-2 rounded-lg text-xs font-semibold text-accent transition hover:text-accent-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
              >
                <ArrowLeft aria-hidden="true" className="size-3.5" />
                Back to School SMIS
              </Link>
            ) : null}
          </div>
        </div>

      </div>
    </section>
  );
}
