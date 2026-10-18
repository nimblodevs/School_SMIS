import { forwardRef, useId, useState } from 'react';
import { CheckCircle2, Eye, EyeOff, KeyRound, Mail } from 'lucide-react';
import { cn } from '../../lib/cn.js';

const iconByType = {
  email: Mail,
  password: KeyRound,
};

export const InputField = forwardRef(function InputField(
  {
    label,
    error,
    hint,
    icon,
    type = 'text',
    id,
    name,
    className = '',
    success = false,
    disabled = false,
    registration,
    autoComplete,
    inputMode,
    ...props
  },
  ref,
) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const [isVisible, setIsVisible] = useState(false);
  const isPassword = type === 'password';
  const InputIcon = icon || iconByType[type];
  const inputType = isPassword && isVisible ? 'text' : type;
  const describedBy = [
    error ? `${inputId}-error` : null,
    !error && hint ? `${inputId}-hint` : null,
  ]
    .filter(Boolean)
    .join(' ') || undefined;

  const setRefs = (element) => {
    if (typeof registration?.ref === 'function') registration.ref(element);
    if (typeof ref === 'function') ref(element);
    else if (ref) ref.current = element;
  };

  return (
    <div className="space-y-1.5">
      <div className="group relative">
        {InputIcon ? (
          <InputIcon
            aria-hidden="true"
            className={cn(
              'pointer-events-none absolute top-1/2 left-4 z-10 size-4 -translate-y-1/2 transition-colors',
              error
                ? 'text-error'
                : success
                  ? 'text-success'
                  : 'text-muted group-focus-within:text-forest',
            )}
          />
        ) : null}

        <input
          {...props}
          {...registration}
          ref={setRefs}
          id={inputId}
          name={registration?.name || name || inputId}
          type={inputType}
          placeholder=" "
          disabled={disabled}
          autoComplete={autoComplete}
          inputMode={inputMode}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          className={cn(
            'peer relative w-full rounded-xl border bg-white px-4 pt-5 pb-3 text-sm text-ink outline-none transition focus:border-forest focus:ring-4 focus:ring-mint',
            InputIcon ? 'pl-11' : '',
            isPassword || success ? 'pr-12' : '',
            'placeholder:text-transparent disabled:cursor-not-allowed disabled:bg-page disabled:text-muted',
            error
              ? 'border-error-border focus:border-error focus:ring-error-soft'
              : success
                ? 'border-success/70 focus:border-success'
                : 'border-line hover:border-mint-strong',
            className,
          )}
        />

        <label
          htmlFor={inputId}
          className={cn(
            'pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 bg-white px-1 text-sm text-muted transition-all',
            InputIcon ? 'left-11' : '',
            'peer-focus:top-0 peer-focus:text-xs peer-focus:font-semibold peer-focus:text-forest',
            'peer-[:not(:placeholder-shown)]:top-0 peer-[:not(:placeholder-shown)]:text-xs peer-[:not(:placeholder-shown)]:font-semibold',
            error && 'peer-focus:text-error peer-[:not(:placeholder-shown)]:text-error',
            success &&
              'peer-[:not(:placeholder-shown)]:text-success peer-focus:text-success',
            disabled && 'opacity-70',
          )}
        >
          {label}
        </label>

        {isPassword ? (
          <button
            type="button"
            aria-label={isVisible ? 'Hide password' : 'Show password'}
            onClick={() => setIsVisible((visible) => !visible)}
            className="absolute right-3 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-lg text-muted transition hover:bg-page hover:text-deep focus-visible:ring-2 focus-visible:ring-forest focus-visible:outline-none"
          >
            {isVisible ? (
              <EyeOff aria-hidden="true" className="size-4" />
            ) : (
              <Eye aria-hidden="true" className="size-4" />
            )}
          </button>
        ) : success ? (
          <CheckCircle2
            aria-hidden="true"
            className="absolute top-1/2 right-3.5 size-4 -translate-y-1/2 text-success"
          />
        ) : null}
      </div>

      {error ? (
        <p id={`${inputId}-error`} role="alert" className="px-1 text-xs font-medium text-error">
          {error}
        </p>
      ) : null}
      {!error && hint ? (
        <p id={`${inputId}-hint`} className="px-1 text-xs text-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
});
