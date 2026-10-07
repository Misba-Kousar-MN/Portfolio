'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { cn } from '@/lib/utils';

interface FloatingGradientProps {
  className?: string;
  style?: CSSProperties;
  colors?: string[];
  speed?: number;
  intensity?: number;
}

export function FloatingGradient({
  className,
  style,
  colors = ['var(--accent)', 'var(--accent-hover)', '#C7DEF5', '#D9EAF7'],
  speed = 8,
  intensity = 0.15,
}: FloatingGradientProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || reducedMotion) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = 0;
    let height = 0;
    let time = 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width * window.devicePixelRatio;
      height = rect.height * window.devicePixelRatio;
      canvas.width = width;
      canvas.height = height;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
    };

    const draw = () => {
      if (!ctx) return;

      time += 1 / 60;

      ctx.clearRect(0, 0, width, height);

      const gradientCount = 3;
      const radius = Math.min(width, height) * 0.6;

      for (let i = 0; i < gradientCount; i++) {
        const angle = (time * speed * 0.01 + i * (Math.PI * 2) / gradientCount) % (Math.PI * 2);
        const x = width / 2 + Math.cos(angle) * radius * 0.3;
        const y = height / 2 + Math.sin(angle) * radius * 0.3;

        const gradient = ctx.createRadialGradient(x, y, 0, x, y, radius * intensity);
        gradient.addColorStop(0, `${colors[i % colors.length]}${Math.floor(255 * intensity).toString(16).padStart(2, '0')}`);
        gradient.addColorStop(1, `${colors[i % colors.length]}00`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius * intensity, 0, Math.PI * 2);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(draw);
    };

    resize();
    draw();

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [colors, speed, intensity, reducedMotion]);

  if (reducedMotion) {
    return (
      <div
        className={cn('relative overflow-hidden', className)}
        style={{ background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-hover) 50%, #C7DEF5 100%)', opacity: 0.05, ...style }}
        aria-hidden="true"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

function useReducedMotion(): boolean {
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setReducedMotion(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, []);
  return reducedMotion;
}