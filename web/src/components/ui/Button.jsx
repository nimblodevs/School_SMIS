import { cn } from '../../lib/cn.js';

const variants = {
  primary:
    'bg-forest text-white shadow-sm hover:bg-forest-dark focus-visible:ring-mint',
  outline:
    'border border-line text-deep hover:bg-page focus-visible:ring-mint disabled:opacity-40',
  ghost: 'text-forest hover:bg-mint focus-visible:ring-mint',
  auth:
    'group bg-deep text-white shadow-[0_10px_24px_-14px_rgba(13,47,34,0.7)] transition-all hover:-translate-y-0.5 hover:bg-sidebar hover:shadow-[0_14px_28px_-14px_rgba(13,47,34,0.55)] active:translate-y-0 focus-visible:ring-mint',
};

const sizes = {
  sm: 'h-8 rounded-lg px-2.5 text-xs',
  md: 'h-11 rounded-xl px-4 text-sm',
  lg: 'h-12 rounded-xl px-5 text-sm',
};

export function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  className,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-semibold transition-colors focus-visible:ring-4 focus-visible:outline-none disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
