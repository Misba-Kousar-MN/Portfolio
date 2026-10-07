'use client';

import { motion, type MotionProps, useMotionValue, useTransform } from 'framer-motion';
import { useEffect, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { magneticButton } from '@/lib/animations';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MagneticButtonProps extends Omit<MotionProps, 'whileHover' | 'whileTap'> {
  children: ReactNode;
  className?: string;
  strength?: number;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

export function MagneticButton({
  children,
  className,
  strength = 30,
  onClick,
  ...props
}: MagneticButtonProps) {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLButtonElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  useEffect(() => {
    if (reducedMotion || !ref.current) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = ref.current!.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (event.clientX - centerX) / strength;
      const deltaY = (event.clientY - centerY) / strength;

      x.set(deltaX);
      y.set(deltaY);
    };

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    const element = ref.current;
    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [x, y, strength, reducedMotion]);

  const transformX = useTransform(x, (latest) => latest);
  const transformY = useTransform(y, (latest) => latest);

  if (reducedMotion) {
    return (
      <motion.button
        ref={ref}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className={cn('btn-primary', className)}
        onClick={onClick}
        {...props}
      >
        {children}
      </motion.button>
    );
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: transformX, y: transformY }}
      whileHover={{ scale: 1.02, transition: { duration: 0.2, ease: [0.19, 1, 0.22, 1] } }}
      whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.16, 1, 0.3, 1] } }}
      className={cn('btn-primary', className)}
      onClick={onClick}
      {...props}
    >
      {children}
    </motion.button>
  );
}