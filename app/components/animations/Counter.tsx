'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';
import { counterReveal } from '@/lib/animations';

interface CounterProps {
  end: number;
  start?: number;
  duration?: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
  onComplete?: () => void;
}

export function Counter({
  end,
  start = 0,
  duration = 2,
  decimals = 0,
  prefix = '',
  suffix = '',
  className,
  onComplete,
}: CounterProps) {
  const [count, setCount] = useState(start);
  const [isVisible, setIsVisible] = useState(false);
  const reducedMotion = useReducedMotion();
  const frameRef = useRef<number>();
  const startTimeRef = useRef<number>();
  const containerRef = useRef<HTMLSpanElement>(null);

  const formattedCount = count.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry) return;
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isVisible || reducedMotion) {
      setCount(end);
      return;
    }

    const animate = (currentTime: number) => {
      if (!startTimeRef.current) startTimeRef.current = currentTime;
      const elapsed = currentTime - startTimeRef.current;
      const progress = Math.min(elapsed / (duration * 1000), 1);
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const current = start + (end - start) * easedProgress;

      setCount(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(animate);
      } else {
        setCount(end);
        onComplete?.();
      }
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [isVisible, end, start, duration, reducedMotion, onComplete]);

  return (
    <motion.span
      ref={containerRef}
      variants={counterReveal}
      initial="hidden"
      animate={isVisible || reducedMotion ? 'visible' : 'hidden'}
      className={cn('font-display font-bold tabular-nums', className)}
    >
      {prefix}{formattedCount}{suffix}
    </motion.span>
  );
}