import { Variants } from 'framer-motion';

// ─── Precision Easing Curves ──────────────────────────────────────────────────
export const easeExpo = [0.16, 1, 0.3, 1] as const;
export const easeOutExpo = [0.19, 1, 0.22, 1] as const;
export const easeSpring = [0.34, 1.56, 0.64, 1] as const;
export const easeEditorial = [0.25, 1, 0.5, 1] as const;
export const easeSnappy = [0.4, 0, 0.2, 1] as const;

// ─── Hero Choreographed Entrance Sequence ─────────────────────────────────────
export const heroSequenceContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.12,
    },
  },
};

export const heroEyebrowVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const heroHeadlineVariant: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: easeOutExpo },
  },
};

export const heroSupportingVariant: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: easeOutExpo },
  },
};

export const heroBadgesVariant: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      staggerChildren: 0.06,
      duration: 0.4,
      ease: easeSpring,
    },
  },
};

export const heroCtasVariant: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

export const heroVisualVariant: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.9, ease: easeEditorial, delay: 0.2 },
  },
};

// ─── General Reveal Variants (Variants A - G) ──────────────────────────────────
// Variant A: Standard Fade Up
export const fadeUpVariant: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

// Variant B: Scale In & Fade
export const scaleRevealVariant: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.6, ease: easeSpring },
  },
};

// Variant C: Directional Slide (Left / Right)
export const slideLeftVariant: Variants = {
  hidden: { opacity: 0, x: 36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

export const slideRightVariant: Variants = {
  hidden: { opacity: 0, x: -36 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.65, ease: easeOutExpo },
  },
};

// Variant D: Masked Reveal
export const maskedRevealVariant: Variants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: '0%',
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

// Variant E: Staggered Container & Children
export const staggerContainerVariant: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.05,
    },
  },
};

export const staggerItemVariant: Variants = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: easeOutExpo },
  },
};

// Variant F: Image / Project Visual Reveal
export const projectVisualVariant: Variants = {
  hidden: { opacity: 0, scale: 1.05, y: 20 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.9, ease: easeEditorial },
  },
};

// Variant G: Line / Path Draw
export const lineDrawVariant: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    originX: 0,
    transition: { duration: 0.8, ease: easeOutExpo },
  },
};

export const timelineStemVariant: Variants = {
  hidden: { scaleY: 0, originY: 0 },
  visible: {
    scaleY: 1,
    originY: 0,
    transition: { duration: 1.2, ease: easeEditorial },
  },
};

// ─── Micro-Interactions & Hover States ─────────────────────────────────────────
export const cardHoverVariant: Variants = {
  initial: { y: 0, boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' },
  hover: {
    y: -5,
    boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)',
    transition: { duration: 0.35, ease: easeOutExpo },
  },
};

export const badgeHoverVariant: Variants = {
  initial: { y: 0 },
  hover: {
    y: -2,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
};

export const buttonHoverVariant: Variants = {
  initial: { scale: 1, y: 0 },
  hover: {
    scale: 1.02,
    y: -1,
    transition: { duration: 0.2, ease: easeOutExpo },
  },
  tap: {
    scale: 0.98,
    y: 0,
    transition: { duration: 0.1, ease: easeExpo },
  },
};

// ─── Legacy Aliases & System Helpers ──────────────────────────────────────────
export const fadeIn = fadeUpVariant;
export const fadeOut: Variants = {
  visible: { opacity: 1 },
  hidden: { opacity: 0, transition: { duration: 0.35, ease: easeExpo } },
};
export const slideUp = fadeUpVariant;
export const slideDown: Variants = {
  hidden: { opacity: 0, y: -20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: easeExpo } },
};
export const slideLeft = slideLeftVariant;
export const slideRight = slideRightVariant;
export const scaleIn = scaleRevealVariant;
export const staggerContainer = staggerContainerVariant;
export const staggerItem = staggerItemVariant;
export const textReveal = maskedRevealVariant;
export const lineReveal = lineDrawVariant;
export const sectionReveal = fadeUpVariant;
export const listReveal = staggerContainerVariant;
export const listItemReveal = staggerItemVariant;
export const cardHover = cardHoverVariant;
export const magneticButton = buttonHoverVariant;

export const counterReveal: Variants = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: easeSpring },
  },
};

export const navbarVariants: Variants = {
  initial: { y: -70, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { duration: 0.55, ease: easeOutExpo } },
  shrink: { y: 0, opacity: 1, transition: { duration: 0.25 } },
};

export const mobileMenuVariants: Variants = {
  closed: { opacity: 0, height: 0, overflow: 'hidden' },
  open: { opacity: 1, height: 'auto', transition: { duration: 0.35, ease: easeOutExpo } },
};

export const cursorVariants: Variants = {
  initial: { scale: 1, opacity: 1 },
  hover: { scale: 1.8, opacity: 0.6, transition: { duration: 0.25, ease: easeOutExpo } },
  click: { scale: 0.75, transition: { duration: 0.1, ease: easeExpo } },
  hidden: { opacity: 0, scale: 0 },
};

export const loadingVariants: Variants = {
  initial: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 1.02, transition: { duration: 0.6, ease: easeExpo } },
};

export const pageTransition: Variants = {
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: easeOutExpo } },
  exit: { opacity: 0, y: -16, transition: { duration: 0.25, ease: easeExpo } },
};