'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { useScroll } from '@/hooks/useScroll';

export function BackToTop() {
  const { scrollY, scrollTo } = useScroll();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(scrollY > 400);
  }, [scrollY]);

  const handleScrollToTop = () => {
    scrollTo(0, { duration: 1.0 });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          initial={{ opacity: 0, scale: 0.85, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 12 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          onClick={handleScrollToTop}
          className="fixed bottom-6 right-6 z-40 p-3 rounded-full bg-background-secondary/90 backdrop-blur-md border border-border shadow-card text-text-secondary hover:text-accent hover:border-border-hover transition-all duration-200 active:scale-95 cursor-pointer"
          aria-label="Back to top"
        >
          <ArrowUp className="h-4 w-4" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
