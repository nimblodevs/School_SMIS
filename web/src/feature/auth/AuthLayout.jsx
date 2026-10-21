import { BookOpen, Check, ShieldCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { Footer } from "../../components/layout/footer.jsx";

export function AuthLayout({ children }) {
  return (
    <section className="flex min-h-svh w-full flex-col">
      <div className="grid w-full flex-1 grid-cols-1 overflow-hidden bg-[#fbfdfb] lg:grid-cols-[0.92fr_1.08fr]">
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
              Bring your school’s people, places, and daily work together in one
              thoughtful workspace.
            </p>
            <div className="mt-8 space-y-3">
              {[
                "One organized home for your school",
                "A clear view of your school information",
                "A workspace that grows with your community",
              ].map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-3 text-xs font-medium text-deep/80"
                >
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
        <main className="relative flex min-h-[calc(100svh-3.5rem)] items-center justify-center bg-transparent p-5 sm:p-8 lg:p-10 xl:p-14">
          <div className="w-full max-w-md">
            <Link
              to="/"
              aria-label="School SMIS home"
              className="mx-auto mb-8 flex w-fit items-center justify-center gap-2.5 rounded-xl focus-visible:ring-4 focus-visible:ring-mint focus-visible:outline-none lg:hidden"
            >
              <span className="grid size-10 place-items-center rounded-[14px] bg-forest text-white shadow-[0_8px_18px_-10px_rgba(26,107,69,0.8)]">
                <BookOpen aria-hidden="true" className="size-[18px]" />
              </span>
              <span className="text-left text-sm font-bold tracking-tight text-deep">
                School<span className="text-forest">SMIS</span>
                <span className="mt-0.5 block text-[9px] font-semibold tracking-[0.12em] text-muted">
                  SCHOOL MANAGEMENT
                </span>
              </span>
            </Link>
            {children}
          </div>
        </main>
      </div>
      <Footer />
    </section>
  );
}
