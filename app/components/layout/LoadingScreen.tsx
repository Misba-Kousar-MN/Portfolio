'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LoadingScreen() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Keep brief and crisp
    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.01 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-background-primary pointer-events-none"
        >
          <div className="flex flex-col items-center gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.45, ease: 'easeOut' }}
              className="w-14 h-14 rounded-2xl bg-accent-light border border-accent/20 flex items-center justify-center text-display-sm font-serif font-bold text-accent tracking-tight shadow-subtle"
            >
              MK
            </motion.div>

            <div className="w-20 h-[2px] bg-border rounded-full overflow-hidden relative">
              <motion.div
                initial={{ left: '-100%' }}
                animate={{ left: '100%' }}
                transition={{
                  repeat: Infinity,
                  duration: 0.9,
                  ease: 'easeInOut',
                }}
                className="absolute top-0 bottom-0 w-1/2 bg-accent rounded-full"
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
