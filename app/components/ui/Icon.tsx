import { type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface IconProps {
  icon: LucideIcon;
  size?: number | string;
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

export function Icon({ icon: IconComponent, size = 20, className, 'aria-label': ariaLabel, 'aria-hidden': ariaHidden = true, ...props }: IconProps) {
  return (
    <IconComponent
      size={size}
      className={cn('flex-shrink-0', className)}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
}