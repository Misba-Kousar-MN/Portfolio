import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface TextProps extends HTMLAttributes<any> {
  size?: 'body-lg' | 'body' | 'body-sm' | 'caption';
  weight?: 'normal' | 'medium' | 'semibold' | 'bold';
  color?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'muted';
  align?: 'left' | 'center' | 'right' | 'justify';
  className?: string | undefined;
  as?: 'p' | 'span' | 'div' | 'li';
}

export const Text = forwardRef<any, TextProps>(
  ({ size = 'body', weight = 'normal', color = 'primary', align = 'left', className, as: Component = 'p', children, ...props }, ref) => {
    const sizes = {
      'body-lg': 'text-body-lg',
      body: 'text-body',
      'body-sm': 'text-body-sm',
      caption: 'text-caption',
    };

    const weights = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold',
    };

    const colors = {
      primary: 'text-text-primary',
      secondary: 'text-text-secondary',
      tertiary: 'text-text-tertiary',
      accent: 'text-accent',
      muted: 'text-text-tertiary',
    };

    const alignments = {
      left: 'text-left',
      center: 'text-center',
      right: 'text-right',
      justify: 'text-justify',
    };

    return (
      <Component
        ref={ref}
        className={cn(sizes[size], weights[weight], colors[color], alignments[align], className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

Text.displayName = 'Text';

export const Lead = ({ children, className, ...props }: TextProps) => (
  <Text size="body-lg" color="secondary" className={cn('max-w-2xl', className)} {...props}>
    {children}
  </Text>
);

export const Muted = ({ children, className, ...props }: TextProps) => (
  <Text color="tertiary" className={className} {...props}>
    {children}
  </Text>
);

export const AccentText = ({ children, className, ...props }: TextProps) => (
  <Text color="accent" weight="medium" className={className} {...props}>
    {children}
  </Text>
);