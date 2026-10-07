import { forwardRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  className?: string;
  id?: string;
  size?: 'default' | 'sm' | 'lg';
  background?: 'default' | 'secondary' | 'tertiary' | 'gradient';
}

export const Section = forwardRef<HTMLElement, SectionProps>(
  ({ className, children, id, size = 'default', background = 'default', ...props }, ref) => {
    const sizes = {
      default: 'py-16 sm:py-24 lg:py-32',
      sm: 'py-12 sm:py-16 lg:py-24',
      lg: 'py-20 sm:py-28 lg:py-36',
    };

    const backgrounds = {
      default: 'bg-background-primary',
      secondary: 'bg-background-secondary',
      tertiary: 'bg-background-tertiary',
      gradient: 'bg-gradient-to-b from-background-primary via-background-secondary to-background-primary',
    };

    return (
      <section
        ref={ref}
        id={id}
        className={cn('scroll-mt-20', sizes[size], backgrounds[background], className)}
        {...props}
      >
        <div className="container">{children}</div>
      </section>
    );
  }
);

Section.displayName = 'Section';

export const SectionHeader = ({
  title,
  subtitle,
  align = 'center',
  className,
}: {
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
}) => {
  const alignments = {
    left: 'text-left',
    center: 'text-center',
    right: 'text-right',
  };

  return (
    <div className={cn('mb-16 max-w-3xl mx-auto', alignments[align], className)}>
      <h2 className="font-serif text-3xl sm:text-4xl text-text-primary tracking-tight font-normal">
        {title}
      </h2>
      <div className={cn('mt-2 h-0.5 w-12 bg-gradient-to-r from-[#D8BFD8] to-[#FFD1DC] rounded-full', align === 'center' ? 'mx-auto' : '')} />
      {subtitle && (
        <p className="mt-4 text-body text-text-secondary max-w-2xl mx-auto text-pretty font-sans leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};