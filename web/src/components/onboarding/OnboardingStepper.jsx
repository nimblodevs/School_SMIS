import { Check } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function OnboardingStepper({ steps, currentStep }) {
  return (
    <ol className="space-y-0" aria-label="Onboarding steps">
      {steps.map((step, index) => {
        const complete = index < currentStep;
        const active = index === currentStep;

        return (
          <li key={step.id} className="flex gap-3">
            <div className="flex flex-col items-center">
              <span
                className={cn(
                  'flex size-9 items-center justify-center rounded-full border text-sm font-semibold transition-colors',
                  complete && 'border-mint-strong bg-mint-strong text-deep',
                  active && 'border-white bg-white text-forest shadow-md',
                  !complete && !active && 'border-white/30 bg-white/5 text-white/70',
                )}
              >
                {complete ? <Check className="size-4" strokeWidth={2.5} /> : index + 1}
              </span>
              {index < steps.length - 1 ? (
                <span
                  className={cn(
                    'my-1 w-px flex-1 min-h-8',
                    complete ? 'bg-mint-strong' : 'bg-white/20',
                  )}
                />
              ) : null}
            </div>
            <div className={cn('pb-8', index === steps.length - 1 && 'pb-0')}>
              <p
                className={cn(
                  'text-sm font-semibold',
                  active ? 'text-white' : complete ? 'text-mint-strong' : 'text-white/70',
                )}
              >
                {step.title}
              </p>
              <p className="mt-0.5 text-xs leading-relaxed text-white/60">{step.description}</p>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
