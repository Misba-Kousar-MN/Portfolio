'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface MascotProps {
  state?: 'hero' | 'contact' | 'projects' | 'idle';
  className?: string;
}

export function Mascot({ state = 'idle', className }: MascotProps) {
  const reducedMotion = useReducedMotion();
  const [mascotState, setMascotState] = useState<'wave' | 'walk' | 'sleep' | 'celebrate' | 'look'>('wave');
  const [isWaving, setIsWaving] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [isScrolling, setIsScrolling] = useState(false);
  const [isSleeping, setIsSleeping] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  
  // Motion values for smooth eye tracking
  const rawEyeX = useMotionValue(0);
  const rawEyeY = useMotionValue(0);
  const eyeX = useSpring(rawEyeX, { stiffness: 120, damping: 20 });
  const eyeY = useSpring(rawEyeY, { stiffness: 120, damping: 20 });

  // 1. Waving on mount
  useEffect(() => {
    const waveTimer = setTimeout(() => {
      setIsWaving(false);
    }, 3000);

    return () => clearTimeout(waveTimer);
  }, []);

  // 2. Scroll tracking for walking state
  useEffect(() => {
    let scrollTimeout: NodeJS.Timeout;

    const handleScroll = () => {
      setIsScrolling(true);
      setIsSleeping(false);
      clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        setIsScrolling(false);
      }, 300);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, []);

  // 3. Complete Idle detection to trigger Sleep mode
  useEffect(() => {
    let idleTimer: NodeJS.Timeout;

    const resetIdle = () => {
      setIsSleeping(false);
      clearTimeout(idleTimer);
      idleTimer = setTimeout(() => {
        setIsSleeping(true);
      }, 6000); // sleep after 6s of complete inactivity
    };

    window.addEventListener('mousemove', resetIdle, { passive: true });
    window.addEventListener('scroll', resetIdle, { passive: true });
    
    resetIdle();

    return () => {
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('scroll', resetIdle);
      clearTimeout(idleTimer);
    };
  }, []);

  // 4. Listen for viewport project celebration events
  useEffect(() => {
    const handleCelebrate = () => {
      setIsCelebrating(true);
      setIsSleeping(false);
      setTimeout(() => {
        setIsCelebrating(false);
      }, 1500);
    };

    window.addEventListener('mascot-celebrate', handleCelebrate);
    return () => window.removeEventListener('mascot-celebrate', handleCelebrate);
  }, []);

  // 5. Cursor eye tracking
  useEffect(() => {
    if (reducedMotion || isSleeping || isWaving || isCelebrating) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const robotCenterX = rect.left + rect.width / 2;
      const robotCenterY = rect.top + rect.height / 2;

      // Calculate relative delta vector
      const dx = e.clientX - robotCenterX;
      const dy = e.clientY - robotCenterY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      // Max eye offset boundaries
      const maxOffset = 5;
      if (distance > 0) {
        rawEyeX.set((dx / distance) * maxOffset);
        rawEyeY.set((dy / distance) * maxOffset);
      } else {
        rawEyeX.set(0);
        rawEyeY.set(0);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [reducedMotion, isSleeping, isWaving, isCelebrating, rawEyeX, rawEyeY]);

  // Determine active dynamic animation state
  useEffect(() => {
    if (isCelebrating) {
      setMascotState('celebrate');
    } else if (isWaving) {
      setMascotState('wave');
    } else if (isScrolling && state !== 'contact') {
      setMascotState('walk');
    } else if (isSleeping) {
      setMascotState('sleep');
    } else {
      setMascotState('look');
    }
  }, [isCelebrating, isWaving, isScrolling, isSleeping, state]);

  if (reducedMotion) return null;

  return (
    <div 
      ref={containerRef}
      className={`relative inline-flex flex-col items-center select-none w-20 h-24 ${className}`}
    >
      {/* Floating Zzz particles during sleep */}
      <AnimatePresence>
        {mascotState === 'sleep' && (
          <>
            <motion.span
              initial={{ opacity: 0, scale: 0.5, y: -10, x: 10 }}
              animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.7], y: -45, x: 25 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, ease: 'easeOut' }}
              className="absolute text-caption font-bold text-accent select-none pointer-events-none"
            >
              z
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5, y: -15, x: 15 }}
              animate={{ opacity: [0, 0.8, 0], scale: [0.5, 1.2, 0.8], y: -60, x: 35 }}
              exit={{ opacity: 0 }}
              transition={{ repeat: Infinity, duration: 2.2, delay: 0.7, ease: 'easeOut' }}
              className="absolute text-body-sm font-bold text-accent select-none pointer-events-none"
            >
              Z
            </motion.span>
          </>
        )}
      </AnimatePresence>

      {/* Mascot SVG Vector */}
      <motion.svg
        viewBox="0 0 100 120"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
        animate={
          mascotState === 'celebrate'
            ? { y: [0, -18, 0], scaleY: [1, 0.85, 1.1, 1], scaleX: [1, 1.1, 0.9, 1] }
            : mascotState === 'sleep'
            ? { y: [0, 2, 0] }
            : {}
        }
        transition={
          mascotState === 'celebrate'
            ? { duration: 0.6, repeat: 2, ease: 'easeInOut' }
            : mascotState === 'sleep'
            ? { duration: 2, repeat: Infinity, ease: 'easeInOut' }
            : {}
        }
      >
        {/* Antennas */}
        <g id="antenna">
          <rect x="47" y="10" width="6" height="15" fill="#5A4767" rx="3" />
          <motion.circle
            cx="50"
            cy="7"
            r="6"
            fill="#FFD1DC"
            stroke="#5A4767"
            strokeWidth="2.5"
            animate={mascotState === 'sleep' ? { opacity: [0.6, 1, 0.6] } : {}}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </g>

        {/* Arms */}
        {/* Left Arm (Waving Arm) */}
        <motion.path
          id="left-arm"
          d="M 26 55 C 16 55 12 55 12 55"
          stroke="#5A4767"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ transformOrigin: '26px 55px' }}
          animate={
            mascotState === 'wave'
              ? { rotate: [0, -45, 0, -45, 0] }
              : mascotState === 'celebrate'
              ? { rotate: [-140, -100, -140] }
              : mascotState === 'sleep'
              ? { rotate: [5, 10, 5] }
              : { rotate: 0 }
          }
          transition={{ duration: mascotState === 'sleep' ? 2 : 0.8, repeat: mascotState === 'look' ? 0 : Infinity }}
        />

        {/* Right Arm */}
        <motion.path
          id="right-arm"
          d="M 74 55 C 84 55 88 55 88 55"
          stroke="#5A4767"
          strokeWidth="7"
          strokeLinecap="round"
          style={{ transformOrigin: '74px 55px' }}
          animate={
            mascotState === 'celebrate'
              ? { rotate: [140, 100, 140] }
              : mascotState === 'sleep'
              ? { rotate: [-5, -10, -5] }
              : { rotate: 0 }
          }
          transition={{ duration: mascotState === 'sleep' ? 2 : 0.8, repeat: mascotState === 'look' ? 0 : Infinity }}
        />

        {/* Legs */}
        {/* Left Leg */}
        <motion.rect
          id="left-leg"
          x="35"
          y="90"
          width="10"
          height="18"
          rx="5"
          fill="#5A4767"
          style={{ transformOrigin: '40px 90px' }}
          animate={
            mascotState === 'walk'
              ? { rotate: [25, -25, 25] }
              : mascotState === 'celebrate'
              ? { y: [0, 4, 0] }
              : { rotate: 0 }
          }
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Right Leg */}
        <motion.rect
          id="right-leg"
          x="55"
          y="90"
          width="10"
          height="18"
          rx="5"
          fill="#5A4767"
          style={{ transformOrigin: '60px 90px' }}
          animate={
            mascotState === 'walk'
              ? { rotate: [-25, 25, -25] }
              : mascotState === 'celebrate'
              ? { y: [0, 4, 0] }
              : { rotate: 0 }
          }
          transition={{ duration: 0.4, repeat: Infinity, ease: 'linear' }}
        />

        {/* Body */}
        <rect x="25" y="48" width="50" height="46" rx="16" fill="#FDFBF7" stroke="#5A4767" strokeWidth="3" />
        <rect x="33" y="56" width="34" height="26" rx="8" fill="#FFE4E1" opacity="0.65" />

        {/* Delicate Heart icon on body in sit/contact state */}
        {state === 'contact' && (
          <path
            d="M 50 67 C 50 67 46 63 43 66 C 40 69 46 75 50 77 C 54 75 60 69 57 66 C 54 63 50 67 50 67 Z"
            fill="#D8BFD8"
          />
        )}

        {/* Head */}
        <motion.g 
          id="head"
          animate={
            mascotState === 'sleep'
              ? { rotate: [0, -3, 0] }
              : mascotState === 'celebrate'
              ? { y: [0, -2, 0] }
              : {}
          }
          transition={{ duration: 2, repeat: Infinity }}
          style={{ transformOrigin: '50px 45px' }}
        >
          <rect x="22" y="20" width="56" height="34" rx="12" fill="#FDFBF7" stroke="#5A4767" strokeWidth="3" />
          
          {/* Eyes Panel */}
          <rect x="29" y="26" width="42" height="18" rx="6" fill="#2E3A44" />

          {/* Blush Cheeks */}
          <circle cx="28" cy="40" r="3" fill="#FFD1DC" opacity="0.8" />
          <circle cx="72" cy="40" r="3" fill="#FFD1DC" opacity="0.8" />

          {/* Left Eye */}
          <motion.circle
            cx="39"
            cy="35"
            r={mascotState === 'sleep' ? 1.5 : 4}
            fill={mascotState === 'sleep' ? '#CFDBC5' : '#E0F7FA'}
            style={{ x: eyeX, y: eyeY }}
          />

          {/* Right Eye */}
          <motion.circle
            cx="61"
            cy="35"
            r={mascotState === 'sleep' ? 1.5 : 4}
            fill={mascotState === 'sleep' ? '#CFDBC5' : '#E0F7FA'}
            style={{ x: eyeX, y: eyeY }}
          />

          {/* Smile */}
          <path
            d={mascotState === 'sleep' ? 'M 47 45 Q 50 45 53 45' : 'M 46 45 Q 50 48 54 45'}
            stroke="#5A4767"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
        </motion.g>
      </motion.svg>
    </div>
  );
}
