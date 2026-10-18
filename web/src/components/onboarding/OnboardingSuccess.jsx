import { ArrowLeft, CheckCircle2, PartyPopper } from 'lucide-react';
import { Button } from '../ui/Button.jsx';

export function OnboardingSuccess({ schoolName, schoolAdmins, onReset }) {
  return (
    <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-12 text-center">
      <div className="relative mb-6">
        <span className="flex size-20 items-center justify-center rounded-full bg-mint text-success shadow-inner">
          <CheckCircle2 className="size-10" strokeWidth={1.75} />
        </span>
        <span className="absolute -right-1 -bottom-1 flex size-8 items-center justify-center rounded-full bg-white text-forest shadow-md ring-1 ring-line">
          <PartyPopper className="size-4" />
        </span>
      </div>

      <p className="text-xs font-semibold tracking-[0.18em] text-forest uppercase">
        Onboarding complete
      </p>
      <h2 className="mt-2 max-w-md text-3xl font-semibold tracking-tight text-deep">
        {schoolName || 'Your school'} is ready
      </h2>
      <p className="mt-3 max-w-md text-sm leading-relaxed text-muted">
        School details have been saved in this session. In a live system, this is where
        your workspace would open. You can return to the overview to review or adjust
        anything.
      </p>

      {schoolAdmins?.length ? (
        <section className="mt-6 w-full max-w-md rounded-2xl border border-line bg-page/70 p-4 text-left">
          <h3 className="text-sm font-semibold text-deep">School admin account details</h3>
          <p className="mt-1 text-xs text-muted">
            The first ownership contact is the primary school admin.
          </p>
          <div className="mt-4 space-y-3">
            {schoolAdmins.map((admin) => (
              <div
                key={admin.email}
                className="rounded-xl border border-line bg-white p-3 text-sm"
              >
                <p className="font-semibold text-deep">
                  {admin.isPrimary ? 'Primary school admin' : 'Additional school admin'}
                </p>
                <p className="mt-1 text-ink">{admin.name}</p>
                <p className="text-muted">{admin.email}</p>
                <p className="text-muted">{admin.mobile}</p>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <Button
        type="button"
        onClick={onReset}
        size="lg"
        className="mt-8"
      >
        <ArrowLeft className="size-4" />
        Return to onboarding overview
      </Button>
    </div>
  );
}
