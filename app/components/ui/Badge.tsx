import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'success' | 'warning' | 'error' | 'blush' | 'sage' | 'peach' | 'lavender' | 'mint';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  className?: string;
}

export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'primary', size = 'md', dot = false, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center gap-1.5 rounded-full font-medium transition-all duration-fast';

    const variants = {
      primary: 'bg-accent-light text-accent border border-accent/20',
      secondary: 'bg-background-tertiary text-text-secondary border border-border',
      outline: 'border border-border bg-transparent text-text-secondary',
      blush: 'bg-[#FFD1DC]/40 text-[#452D34] border border-[#FFD1DC]/70 dark:text-[#FFD1DC] dark:border-[#FFD1DC]/30',
      sage: 'bg-[#CFDBC5]/45 text-[#243320] border border-[#CFDBC5]/70 dark:text-[#CFDBC5] dark:border-[#CFDBC5]/30',
      peach: 'bg-[#FFE4E1]/50 text-[#452B28] border border-[#FFE4E1]/80 dark:text-[#FFE4E1] dark:border-[#FFE4E1]/30',
      lavender: 'bg-[#D8BFD8]/45 text-[#3D263D] border border-[#D8BFD8]/70 dark:text-[#E2CBE4] dark:border-[#D8BFD8]/30',
      mint: 'bg-[#E0F7FA]/60 text-[#143B41] border border-[#E0F7FA] dark:text-[#B2EBF2] dark:border-[#E0F7FA]/30',
      success: 'bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300',
      warning: 'bg-amber-50 text-amber-700 border border-amber-200 dark:bg-amber-950/40 dark:text-amber-300',
      error: 'bg-rose-50 text-rose-700 border border-rose-200 dark:bg-rose-950/40 dark:text-rose-300',
    };

    const sizes = {
      sm: 'px-2.5 py-0.5 text-caption',
      md: 'px-3 py-1 text-caption',
      lg: 'px-4 py-1.5 text-body-sm',
    };

    return (
      <span
        ref={ref}
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        {...props}
      >
        {dot && <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />}
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';