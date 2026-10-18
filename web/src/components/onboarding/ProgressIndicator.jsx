import { cn } from '../../lib/cn.js';

export function ProgressIndicator({ currentStep, totalSteps, className }) {
  const percent = Math.round(((currentStep + 1) / totalSteps) * 100);

  return (
    <div className={cn('space-y-2', className)} aria-hidden="true">
      <div className="flex items-center justify-between text-xs font-medium">
        <span className="text-muted">
          Step {currentStep + 1} of {totalSteps}
        </span>
        <span className="text-forest">{percent}% complete</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-mint">
        <div
          className="h-full rounded-full bg-forest transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
