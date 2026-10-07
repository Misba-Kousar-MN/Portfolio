'use client';

import { cn } from '@/lib/utils';

interface HeroBackgroundProps {
  className?: string;
  contained?: boolean;
}

/**
 * HeroBackground
 *
 * Lightweight ambient gradient panel — replaces the previous Three.js canvas.
 * The rotating 3D torus knot has been removed per design direction.
 * Renders a soft radial pastel gradient that complements the sky-blue + lavender palette.
 */
export function HeroBackground({ className, contained = false }: HeroBackgroundProps) {
  return (
    <div
      className={cn(
        contained ? 'w-full h-full min-h-[460px] relative' : 'absolute inset-0 -z-10',
        className
      )}
      aria-hidden="true"
      style={{
        background:
          'radial-gradient(ellipse 80% 70% at 60% 50%, rgba(216,191,216,0.22) 0%, rgba(198,228,245,0.18) 45%, transparent 80%)',
      }}
    />
  );
}