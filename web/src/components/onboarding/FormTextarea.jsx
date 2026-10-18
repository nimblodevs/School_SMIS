import { CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/cn.js';

export function FormTextarea({
  id,
  label,
  error,
  success = false,
  disabled = false,
  registration,
  hint,
  rows = 4,
}) {
  const describedBy = [
    error ? `${id}-error` : null,
    hint ? `${id}-hint` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  return (
    <div className="space-y-1.5">
      <div className="relative">
        <textarea
          id={id}
          rows={rows}
          placeholder=" "
          disabled={disabled}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          {...registration}
          className={cn(
            'peer min-h-[120px] w-full resize-y rounded-xl border bg-white px-3.5 pt-6 pb-3 text-sm leading-relaxed text-ink shadow-sm transition-all outline-none',
            'placeholder:text-transparent',
            'disabled:cursor-not-allowed disabled:bg-page disabled:text-muted',
            error
              ? 'border-error-border focus:border-error focus:ring-4 focus:ring-error-soft'
              : success
                ? 'border-success/70 focus:border-success focus:ring-4 focus:ring-mint'
                : 'border-line hover:border-mint-strong focus:border-forest focus:ring-4 focus:ring-mint',
          )}
        />

        <label
          htmlFor={id}
          className={cn(
            'pointer-events-none absolute top-4 left-3.5 origin-left text-sm text-muted transition-all',
            'peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:tracking-wide peer-focus:text-forest',
            'peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:tracking-wide',
            error && 'peer-focus:text-error peer-[:not(:placeholder-shown)]:text-error',
            success &&
              'peer-[:not(:placeholder-shown)]:text-success peer-focus:text-success',
            disabled && 'opacity-70',
          )}
        >
          {label}
        </label>

        {success ? (
          <CheckCircle2
            aria-hidden="true"
            className="absolute top-3.5 right-3.5 size-4 text-success"
          />
        ) : null}
      </div>

      {hint && !error ? (
        <p id={`${id}-hint`} className="px-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}

      {error ? (
        <p id={`${id}-error`} role="alert" className="px-1 text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
    </div>
  );
}
