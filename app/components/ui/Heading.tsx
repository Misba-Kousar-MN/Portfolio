import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'display-xl' | 'display-lg' | 'display-md' | 'display-sm' | 'heading-xl' | 'heading-lg' | 'heading-md' | 'heading-sm';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  gradient?: boolean;
  gradientAccent?: boolean;
  className?: string;
}

const headingTags = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
} as const;

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ level = 1, size = 'display-md', weight = 'bold', gradient = false, gradientAccent = false, className, children, ...props }, ref) => {
    const Tag = headingTags[level];

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    return (
      <Tag
        ref={ref}
        className={cn(
          `text-${size}`,
          weights[weight],
          gradient && 'heading-gradient',
          gradientAccent && 'heading-gradient-accent',
          className
        )}
        {...props}
      >
        {children}
      </Tag>
    );
  }
);

Heading.displayName = 'Heading';