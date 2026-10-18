import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ClipboardCheck,
  GraduationCap,
  Layers3,
  ShieldCheck,
  Sparkles,
  UsersRound,
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../lib/useAuth.js';

const features = [
  {
    icon: GraduationCap,
    title: 'A home for your school',
    description:
      'Bring your school identity, essential details, and everyday administration together in one organized place.',
    color: 'bg-mint text-forest',
  },
  {
    icon: UsersRound,
    title: 'Made for your community',
    description:
      'Build a foundation for the staff, families, and learners who make your school unique.',
    color: 'bg-mint text-forest',
  },
  {
    icon: ShieldCheck,
    title: 'Thoughtful by design',
    description:
      'A clear, guided setup helps you share accurate school information with confidence.',
    color: 'bg-mint text-forest',
  },
];

const setupSteps = [
  'Tell us about your school',
  'Add contact information',
  'Review and confirm',
];

function Brand() {
  return (
    <Link
      to="/"
      aria-label="School SMIS home"
      className="inline-flex items-center gap-3 rounded-xl focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
    >
      <span className="flex size-10 items-center justify-center rounded-[14px] bg-forest text-white shadow-[0_7px_18px_-8px_rgba(26,107,69,0.8)]">
        <BookOpen aria-hidden="true" className="size-5" />
      </span>
      <span>
        <span className="block text-[15px] font-bold tracking-tight text-deep">
          School<span className="text-forest">SMIS</span>
        </span>
        <span className="block whitespace-nowrap text-[10px] font-semibold tracking-[0.12em] text-muted">
          SCHOOL MANAGEMENT
        </span>
      </span>
    </Link>
  );
}

function ProductPreview() {
  return (
    <div className="relative mx-auto w-full max-w-[570px]">
      <div
        aria-hidden="true"
        className="absolute -inset-8 rounded-[3rem] bg-[radial-gradient(ellipse_at_center,rgba(183,221,198,0.55),transparent_68%)] blur-2xl"
      />
      <div className="relative rounded-[1.75rem] border border-white/80 bg-white p-3 shadow-[0_32px_90px_-38px_rgba(13,47,34,0.35)] sm:p-4">
        <div className="overflow-hidden rounded-[1.2rem] border border-line-soft bg-soft">
          <div className="flex items-center justify-between border-b border-line-soft bg-white px-4 py-3 sm:px-5">
            <div className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-[10px] bg-forest text-white">
                <BookOpen aria-hidden="true" className="size-4" />
              </span>
              <span>
                <span className="block text-xs font-bold text-deep">Green Valley Academy</span>
                <span className="block text-[10px] text-muted">School workspace</span>
              </span>
            </div>
            <span className="hidden items-center gap-1.5 rounded-full bg-mint-soft px-2.5 py-1 text-[10px] font-semibold text-forest sm:inline-flex">
              <span className="size-1.5 rounded-full bg-success" />
              Profile in progress
            </span>
          </div>

          <div className="grid gap-3 p-3 sm:grid-cols-[1fr_0.78fr] sm:gap-4 sm:p-5">
            <div className="rounded-2xl border border-line-soft bg-white p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
                    School profile
                  </p>
                  <h3 className="mt-1 text-sm font-bold text-deep">Let’s get started</h3>
                </div>
                <span className="flex size-8 items-center justify-center rounded-xl bg-mint text-forest">
                  <ClipboardCheck aria-hidden="true" className="size-4" />
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {setupSteps.map((step, index) => (
                  <div key={step} className="flex items-center gap-3">
                    <span
                      className={`flex size-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                        index === 0
                          ? 'bg-forest text-white'
                          : 'border border-line-strong bg-white text-muted'
                      }`}
                    >
                      {index === 0 ? <Check aria-hidden="true" className="size-3.5" /> : index + 1}
                    </span>
                    <span className={`text-[11px] ${index === 0 ? 'font-semibold text-deep' : 'text-muted'}`}>
                      {step}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-xl bg-page p-3">
                <div className="flex items-center justify-between text-[10px]">
                  <span className="font-medium text-muted">Setup progress</span>
                  <span className="font-bold text-forest">33%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mint-strong/40">
                  <div className="h-full w-1/3 rounded-full bg-forest" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div className="rounded-2xl bg-deep p-4 text-white">
                <span className="flex size-8 items-center justify-center rounded-xl bg-white/10 text-mint-strong">
                  <Layers3 aria-hidden="true" className="size-4" />
                </span>
                <p className="mt-5 text-[10px] font-medium text-white/55">One connected place</p>
                <p className="mt-1 text-sm font-semibold leading-5">Your school, clearly organized.</p>
                <div className="mt-4 flex items-center gap-1.5 text-[10px] font-semibold text-mint-strong">
                  Ready when you are
                  <ArrowRight aria-hidden="true" className="size-3" />
                </div>
              </div>

              <div className="flex flex-1 items-center gap-3 rounded-2xl border border-line-soft bg-white p-4">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-mint text-forest">
                  <Sparkles aria-hidden="true" className="size-4" />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-deep">A guided beginning</p>
                  <p className="mt-0.5 text-[10px] leading-4 text-muted">
                    Add details one step at a time.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center justify-between border-t border-line-soft bg-white px-4 py-3 sm:px-5">
            <span className="text-[10px] text-muted">A simpler way to get set up</span>
            <span className="flex items-center gap-1.5 text-[10px] font-semibold text-forest">
              Designed for schools
              <GraduationCap aria-hidden="true" className="size-3.5" />
            </span>
          </div>
        </div>
      </div>
      <div className="absolute -bottom-5 -left-2 hidden items-center gap-2 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-[0_18px_45px_-24px_rgba(13,47,34,0.38)] sm:flex">
        <span className="flex size-8 items-center justify-center rounded-xl bg-mint text-forest">
          <Check aria-hidden="true" className="size-4" />
        </span>
        <span>
          <span className="block text-[11px] font-bold text-deep">Every detail has a place</span>
          <span className="block text-[10px] text-muted">Your school profile, made simple</span>
        </span>
      </div>
    </div>
  );
}

export function LandingPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;
  if (user) {
    return <Navigate to="/overview" replace />;
  }

  return (
    <div className="min-h-screen overflow-hidden bg-page">
      <header className="relative z-10 border-b border-line-soft bg-white/85 backdrop-blur-xl">
        <nav
          aria-label="Main navigation"
          className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-5 px-5 sm:px-8 lg:px-10"
        >
          <Brand />
          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
            >
              Features
            </a>
            <a
              href="#getting-started"
              className="text-sm font-medium text-accent transition-colors hover:text-accent-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
            >
              Getting started
            </a>
          </div>
          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              to="/auth/login"
              className="whitespace-nowrap rounded-xl px-2 py-2.5 text-xs font-semibold text-accent transition-colors hover:text-accent-dark hover:bg-page focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:px-4 sm:text-sm"
            >
              Sign in
            </Link>
            <Link
              to="/auth/register"
              className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl bg-forest px-2.5 py-2.5 text-[11px] font-semibold text-white shadow-[0_8px_18px_-10px_rgba(26,107,69,0.75)] transition-all hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none sm:gap-2 sm:px-4 sm:text-sm"
            >
              Get started
              <ArrowUpRight aria-hidden="true" className="size-4 text-mint-strong" />
            </Link>
          </div>
        </nav>
      </header>

      <main>
        <section className="relative isolate">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 76% 38%, rgba(183,221,198,0.5), transparent 35%), radial-gradient(ellipse at 0% 5%, rgba(232,244,238,0.7), transparent 30%)',
            }}
          />
          <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-14 sm:px-8 sm:pb-28 sm:pt-20 lg:grid-cols-[0.93fr_1.07fr] lg:gap-10 lg:px-10 lg:pb-32 lg:pt-24">
            <div className="relative z-10 max-w-xl">
              <span className="inline-flex items-center gap-2 rounded-full border border-line-strong bg-white/80 px-3.5 py-2 text-xs font-semibold text-forest shadow-sm">
                <Sparkles aria-hidden="true" className="size-3.5" />
                A fresh start for your school
              </span>
              <h1 className="mt-7 text-[2.75rem] font-semibold leading-[1.08] tracking-[-0.055em] text-deep sm:text-6xl lg:text-[4.25rem]">
                School life,
                <br />
                <span className="relative inline-block text-forest">
                  thoughtfully
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 290 14"
                    className="absolute -bottom-1 left-0 w-full text-mint-strong"
                    fill="none"
                  >
                    <path d="M4 9C72 3 190 2 286 8" stroke="currentColor" strokeWidth="7" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                managed.
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-muted sm:text-lg sm:leading-8">
                Meet School SMIS: a calm, connected place to bring your school’s
                information and everyday administration together.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/auth/register"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-forest px-5 text-sm font-semibold text-white shadow-[0_12px_25px_-13px_rgba(26,107,69,0.85)] transition-all hover:-translate-y-0.5 hover:bg-forest-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
                >
                  Get started for your school
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
                <a
                  href="#getting-started"
                  className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-line-strong bg-white/80 px-5 text-sm font-semibold text-accent transition-colors hover:border-accent/30 hover:bg-white hover:text-accent-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
                >
                  Explore school setup
                  <ArrowDown aria-hidden="true" className="size-4 text-forest" />
                </a>
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-3.5 text-forest" />
                  Guided school setup
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check aria-hidden="true" className="size-3.5 text-forest" />
                  Built around your school
                </span>
              </div>
            </div>

            <div className="relative lg:pl-2">
              <ProductPreview />
            </div>
          </div>
          <a
            href="#features"
            aria-label="Explore School SMIS features"
            className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent transition-colors hover:text-accent-dark focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none lg:inline-flex"
          >
            Scroll to explore
            <ArrowDown aria-hidden="true" className="size-3.5" />
          </a>
        </section>

        <section id="features" className="scroll-mt-10 border-y border-line-soft bg-white py-20 sm:py-24">
          <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">A better foundation</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-deep sm:text-4xl">
                Everything starts with your school
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
                Start with a clear picture of your school. School SMIS gives you a
                straightforward foundation to grow from.
              </p>
            </div>

            <div className="mt-12 grid gap-5 md:grid-cols-3">
              {features.map(({ icon: Icon, title, description, color }, index) => (
                <article
                  key={title}
                  className="group rounded-2xl border border-line-soft bg-soft p-6 transition-all duration-200 hover:-translate-y-1 hover:border-mint-strong hover:shadow-[0_20px_45px_-32px_rgba(13,47,34,0.35)] sm:p-7"
                >
                  <div className="flex items-center justify-between">
                    <span className={`flex size-11 items-center justify-center rounded-2xl ${color}`}>
                      <Icon aria-hidden="true" className="size-5" strokeWidth={1.8} />
                    </span>
                    <span className="text-xs font-semibold text-muted/60">0{index + 1}</span>
                  </div>
                  <h3 className="mt-6 text-lg font-semibold tracking-tight text-deep">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted">{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="getting-started" className="scroll-mt-10 bg-mint-soft py-20 sm:py-24">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
            <div className="max-w-lg">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest">Getting started</p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-deep sm:text-4xl">
                Your school’s first steps, made simple.
              </h2>
              <p className="mt-4 text-sm leading-6 text-muted sm:text-base">
                Follow a guided flow to add your school identity, contact details,
                and confirm everything is ready.
              </p>
              <Link
                to="/auth/register"
                className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-deep px-5 text-sm font-semibold text-white transition-colors hover:bg-forest focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none"
              >
                Start school setup
                <ArrowRight aria-hidden="true" className="size-4 text-mint-strong" />
              </Link>
            </div>

            <div className="rounded-[1.75rem] border border-white bg-white p-5 shadow-[0_24px_65px_-42px_rgba(13,47,34,0.3)] sm:p-7">
              <div className="flex items-start gap-4">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-mint text-forest">
                  <ClipboardCheck aria-hidden="true" className="size-5" />
                </span>
                <div>
                  <h3 className="text-base font-semibold text-deep">A simple, guided setup</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">
                    Move through each step at your own pace. Your progress is easy to follow.
                  </p>
                </div>
              </div>
              <ol className="mt-6 space-y-3">
                {setupSteps.map((step, index) => (
                  <li key={step} className="flex items-center gap-3 rounded-xl bg-soft px-4 py-3">
                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full border border-line-strong bg-white text-xs font-semibold text-forest">
                      {index + 1}
                    </span>
                    <span className="text-sm font-medium text-deep">{step}</span>
                    <span className="ml-auto text-xs text-muted">{index === 0 ? 'A few details' : 'Next'}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section className="bg-deep px-5 py-16 text-center text-white sm:px-8 sm:py-20">
          <div className="mx-auto max-w-2xl">
            <span className="mx-auto flex size-11 items-center justify-center rounded-2xl bg-white/10 text-mint-strong">
              <BookOpen aria-hidden="true" className="size-5" />
            </span>
            <h2 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
              Let’s make room for what matters.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/65 sm:text-base">
              Start building a clearer, more connected home for your school.
            </p>
            <Link
              to="/auth/register"
              className="mt-7 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-semibold text-deep transition-colors hover:bg-mint focus-visible:ring-4 focus-visible:ring-mint-strong/40 focus-visible:outline-none"
            >
              Get started
              <ArrowUpRight aria-hidden="true" className="size-4 text-forest" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-line-soft bg-white px-5 py-6 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Brand />
          <p className="text-center text-xs text-muted">
            © {new Date().getFullYear()} School SMIS. School management, made simple.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium text-muted">
            <Link className="text-accent transition-colors hover:text-accent-dark" to="/auth/login">Sign in</Link>
            <Link className="text-accent transition-colors hover:text-accent-dark" to="/auth/register">School setup</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
