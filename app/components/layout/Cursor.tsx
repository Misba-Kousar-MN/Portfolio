'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cursorVariants } from '@/lib/animations';
import { cn } from '@/lib/utils';

export function Cursor() {
  const reducedMotion = useReducedMotion();
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const fineQuery = window.matchMedia('(pointer: fine)');
    setIsFinePointer(fineQuery.matches);

    const handler = (e: MediaQueryListEvent) => setIsFinePointer(e.matches);
    fineQuery.addEventListener('change', handler);
    return () => fineQuery.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (reducedMotion || !isFinePointer || typeof window === 'undefined') return;

    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);

    document.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion, isFinePointer]);

  useEffect(() => {
    if (reducedMotion || !isFinePointer || typeof window === 'undefined') return;

    const handleHover = (e: Event) => {
      const target = e.target as HTMLElement;
      const isInteractive = Boolean(
        target.closest('a, button, input, textarea, select, [role="button"], [tabindex]:not([tabindex="-1"])')
      );
      setIsHovering(isInteractive);
    };

    document.addEventListener('mouseover', handleHover, true);
    document.addEventListener('mouseout', handleHover, true);

    return () => {
      document.removeEventListener('mouseover', handleHover, true);
      document.removeEventListener('mouseout', handleHover, true);
    };
  }, [reducedMotion, isFinePointer]);

  if (reducedMotion || !isFinePointer) return null;

  return (
    <motion.div
      className={cn(
        'fixed top-0 left-0 pointer-events-none z-[9999] mix-blend-difference transition-opacity duration-200 hidden md:block',
        !isVisible && 'opacity-0'
      )}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
      }}
      animate={isHovering ? 'hover' : isClicking ? 'click' : 'initial'}
      variants={cursorVariants}
      initial="initial"
      aria-hidden="true"
    >
      <div className="w-7 h-7 rounded-full border border-text-primary/70 bg-text-primary/10 backdrop-blur-[1px]" />
    </motion.div>
  );
}