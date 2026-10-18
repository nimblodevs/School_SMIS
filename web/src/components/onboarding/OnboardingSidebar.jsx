import { BookOpen, GraduationCap, ShieldCheck, Sparkles } from 'lucide-react';
import { OnboardingStepper } from './OnboardingStepper.jsx';

const BENEFITS = [
  {
    icon: GraduationCap,
    title: 'A trusted school identity',
    copy: 'Your name, motto, and mission become the foundation of every record.',
  },
  {
    icon: ShieldCheck,
    title: 'Accurate contact details',
    copy: 'Families and staff will know exactly how to reach the school.',
  },
  {
    icon: Sparkles,
    title: 'Ready for day one',
    copy: 'Complete setup once so the rest of School SMIS can follow.',
  },
];

export function OnboardingSidebar({ steps, currentStep, progress }) {
  return (
    <aside className="relative flex flex-col justify-between overflow-hidden bg-deep px-6 py-8 text-white lg:min-h-screen lg:px-10 lg:py-12">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(circle at 20% 20%, rgba(47,143,91,0.45), transparent 40%), radial-gradient(circle at 90% 80%, rgba(232,244,238,0.12), transparent 36%)',
        }}
      />

      <div className="relative">
        <div className="mb-10 flex items-center gap-3">
          <span className="flex size-11 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20">
            <BookOpen className="size-5 text-mint-strong" />
          </span>
          <div>
            <p className="text-sm font-semibold tracking-wide">School SMIS</p>
            <p className="text-xs text-white/60">School Management Information System</p>
          </div>
        </div>

        <h1 className="max-w-sm text-3xl font-semibold tracking-tight text-white lg:text-4xl">
          Let&apos;s set up your school
        </h1>
        <p className="mt-3 max-w-sm text-sm leading-relaxed text-white/70">
          A few details about your institution is all it takes. We&apos;ll walk you through
          identity, contact information, and a final review before your workspace is ready.
        </p>

        <div className="mt-10 hidden lg:block">
          <OnboardingStepper steps={steps} currentStep={currentStep} />
        </div>
      </div>

      <div className="relative mt-10 space-y-6">
        <div className="hidden space-y-4 lg:block">
          {BENEFITS.map((benefit) => (
            <div key={benefit.title} className="flex gap-3">
              <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/8 ring-1 ring-white/10">
                <benefit.icon className="size-4 text-mint-strong" />
              </span>
              <div>
                <p className="text-sm font-medium text-white">{benefit.title}</p>
                <p className="mt-0.5 text-xs leading-relaxed text-white/60">{benefit.copy}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-2xl bg-white/8 p-4 ring-1 ring-white/10">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="font-medium text-white/80">Setup progress</span>
            <span className="font-semibold text-mint-strong">{progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-mint-strong transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>
    </aside>
  );
}
