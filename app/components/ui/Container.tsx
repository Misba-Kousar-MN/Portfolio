import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'default' | 'narrow' | 'wide' | 'full';
  className?: string;
}

export const Container = forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, size = 'default', children, ...props }, ref) => {
    const sizes = {
      default: 'mx-auto max-w-7xl px-4 sm:px-6 lg:px-8',
      narrow: 'mx-auto max-w-3xl px-4 sm:px-6 lg:px-8',
      wide: 'mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8',
      full: 'w-full px-4 sm:px-6 lg:px-8',
    };

    return (
      <div ref={ref} className={cn(sizes[size], className)} {...props}>
        {children}
      </div>
    );
  }
);

Container.displayName = 'Container';