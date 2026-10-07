'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import Lenis from '@studio-freight/lenis';

interface ScrollContextType {
  lenis: Lenis | null;
  scrollY: number;
  scrollDirection: 'up' | 'down' | 'none';
  progress: number;
  scrollTo: (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [lenis, setLenis] = useState<Lenis | null>(null);
  const [scrollY, setScrollY] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | 'none'>('none');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      return;
    }

    const lenisInstance = new Lenis({
      duration: 1.1,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.8,
    });

    setLenis(lenisInstance);

    let rafId: number;
    function raf(time: number) {
      lenisInstance.raf(time);
      rafId = requestAnimationFrame(raf);
    }

    rafId = requestAnimationFrame(raf);

    lenisInstance.on('scroll', ({ scroll, direction, progress: scrollProgress }: { scroll: number; direction: number; progress: number }) => {
      setScrollY(scroll);
      setProgress(scrollProgress);
      setScrollDirection(direction === 1 ? 'down' : 'up');
    });

    // Unified smooth anchor link interception
    const handleAnchorClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (!anchor) return;

      const href = anchor.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        const element = document.querySelector(href) as HTMLElement | null;
        if (element) {
          e.preventDefault();
          lenisInstance.scrollTo(element, {
            offset: -84, // navbar offset
            duration: 1.1,
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      lenisInstance.destroy();
      cancelAnimationFrame(rafId);
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const scrollTo = (target: string | number | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (!lenis) {
      if (typeof target === 'string') {
        const element = document.querySelector(target) as HTMLElement | null;
        if (element) {
          const top = element.getBoundingClientRect().top + window.scrollY + (options?.offset ?? -84);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (typeof target === 'number') {
        window.scrollTo({ top: target, behavior: 'smooth' });
      }
      return;
    }

    if (typeof target === 'string') {
      const element = document.querySelector(target) as HTMLElement | null;
      if (element) {
        lenis.scrollTo(element, { offset: options?.offset ?? -84, duration: options?.duration ?? 1.1 });
      }
    } else if (typeof target === 'number') {
      lenis.scrollTo(target, { duration: options?.duration ?? 1.1 });
    } else {
      lenis.scrollTo(target, { offset: options?.offset ?? -84, duration: options?.duration ?? 1.1 });
    }
  };

  return (
    <ScrollContext.Provider value={{ lenis, scrollY, scrollDirection, progress, scrollTo }}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScroll() {
  const context = useContext(ScrollContext);
  if (!context) {
    throw new Error('useScroll must be used within a ScrollProvider');
  }
  return context;
}