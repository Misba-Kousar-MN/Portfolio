import React, { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  children: ReactNode;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  asChild?: boolean;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      loading = false,
      children,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      disabled,
      asChild = false,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-base ease-expo focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background-primary disabled:opacity-50 disabled:pointer-events-none hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] cursor-pointer';

    const variants = {
      primary: 'bg-accent text-white hover:bg-accent-hover hover:shadow-md hover:shadow-accent/20 active:shadow-xs',
      secondary: 'bg-background-tertiary text-text-primary border border-border hover:bg-background-secondary hover:border-border-hover hover:shadow-xs active:shadow-none',
      ghost: 'bg-transparent text-text-secondary hover:bg-background-tertiary hover:text-text-primary hover:-translate-y-0',
      outline: 'border-2 border-accent text-accent bg-transparent hover:bg-accent hover:text-white hover:shadow-xs',
    };

    const sizes = {
      sm: 'px-4 py-2 text-body-sm',
      md: 'px-6 py-3 text-body',
      lg: 'px-8 py-4 text-body-lg',
    };

    const width = fullWidth ? 'w-full' : '';
    const buttonClasses = cn(baseStyles, variants[variant], sizes[size], width, className);

    const content = (
      <>
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!loading && icon && iconPosition === 'left' && <span aria-hidden="true">{icon}</span>}
        <span>{children}</span>
        {!loading && icon && iconPosition === 'right' && <span aria-hidden="true">{icon}</span>}
      </>
    );

    if (asChild && React.isValidElement(children)) {
      const child = React.Children.only(children) as React.ReactElement<any>;
      return React.cloneElement(child, {
        className: cn(buttonClasses, child.props.className),
        ...props,
        children: (
          <>
            {!loading && icon && iconPosition === 'left' && <span className="inline-flex mr-2" aria-hidden="true">{icon}</span>}
            {child.props.children}
            {!loading && icon && iconPosition === 'right' && <span className="inline-flex ml-2" aria-hidden="true">{icon}</span>}
          </>
        )
      });
    }

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || loading}
        {...props}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';