'use client';

import { motion, type Variants } from 'framer-motion';
import React from 'react';
import { cn } from '@/lib/utils';
import {
  fadeUpVariant,
  scaleRevealVariant,
  slideLeftVariant,
  slideRightVariant,
  staggerContainerVariant,
  staggerItemVariant,
  projectVisualVariant,
  lineDrawVariant,
} from '@/lib/animations';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'fadeUp' | 'scale' | 'slideLeft' | 'slideRight' | 'list' | 'visual' | 'line' | 'default' | 'section';
  threshold?: number;
  delay?: number;
}

const variantMap: Record<string, Variants> = {
  fadeUp: fadeUpVariant,
  default: fadeUpVariant,
  section: fadeUpVariant,
  scale: scaleRevealVariant,
  slideLeft: slideLeftVariant,
  slideRight: slideRightVariant,
  list: staggerContainerVariant,
  visual: projectVisualVariant,
  line: lineDrawVariant,
};

export function ScrollReveal({
  children,
  className,
  variant = 'fadeUp',
  threshold = 0.12,
  delay,
}: ScrollRevealProps) {
  const isList = variant === 'list';
  const selectedVariant = variantMap[variant] ?? fadeUpVariant;

  const motionProps = delay !== undefined && delay > 0
    ? { transition: { delay } }
    : {};

  return (
    <motion.div
      className={cn(className)}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: threshold }}
      variants={selectedVariant}
      {...motionProps}
    >
      {isList
        ? React.Children.map(children, (child) => {
            if (!React.isValidElement(child)) return child;
            return <motion.div variants={staggerItemVariant}>{child}</motion.div>;
          })
        : children}
    </motion.div>
  );
}