'use client';

import { motion, type MotionProps } from 'framer-motion';
import { textReveal, staggerContainer, staggerItem } from '@/lib/animations';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface TextRevealProps {
  children: React.ReactNode;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
  delay?: number;
  staggerLines?: boolean;
}

export function TextReveal({
  children,
  className,
  as: Component = 'p',
  delay = 0,
  staggerLines = false,
}: TextRevealProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Component className={cn('opacity-100', className)}>{children}</Component>;
  }

  const text = Array.isArray(children) ? children.join('') : String(children);
  const lines = staggerLines ? text.split('\n').filter(Boolean) : [text];

  return (
    <Component className={cn('overflow-hidden', className)}>
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        custom={delay}
      >
        {lines.map((line, index) => (
          <motion.span
            key={index}
            variants={textReveal}
            style={{ display: 'block' }}
            custom={index * 0.08}
          >
            {line}{' '}
          </motion.span>
        ))}
      </motion.div>
    </Component>
  );
}

interface FadeInUpProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  as?: React.ElementType;
}

export function FadeInUp({
  children,
  className,
  delay = 0,
  duration = 0.7,
  as: Component = 'div',
}: FadeInUpProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Component className={cn('opacity-100 translate-y-0', className)}>{children}</Component>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, ease: [0.19, 1, 0.22, 1], delay }}
      className={cn(className)}
    >
      <Component>{children}</Component>
    </motion.div>
  );
}

interface StaggerContainerProps {
  children: React.ReactNode;
  className?: string;
  staggerChildren?: number;
  delayChildren?: number;
  as?: React.ElementType;
}

export function StaggerContainer({
  children,
  className,
  staggerChildren = 0.08,
  delayChildren = 0.1,
  as: Component = 'div',
}: StaggerContainerProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Component className={cn('opacity-100', className)}>{children}</Component>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren, delayChildren },
        },
      }}
      initial="hidden"
      animate="visible"
      className={cn(className)}
    >
      <Component>{children}</Component>
    </motion.div>
  );
}

interface StaggerItemProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  y?: number;
  as?: React.ElementType;
}

export function StaggerItem({
  children,
  className,
  delay = 0,
  y = 20,
  as: Component = 'div',
}: StaggerItemProps) {
  const reducedMotion = useReducedMotion();

  if (reducedMotion) {
    return <Component className={cn('opacity-100', className)}>{children}</Component>;
  }

  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.19, 1, 0.22, 1], delay },
        },
      }}
      className={cn(className)}
    >
      <Component>{children}</Component>
    </motion.div>
  );
}