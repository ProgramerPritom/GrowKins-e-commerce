import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export const PageLoader: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Fast, lightweight branded load animation (approx 650ms)
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, 650);

    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] bg-[#FAF7F1] flex flex-col items-center justify-center pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-3"
          >
            {/* Playful animated dot mark */}
            <div className="flex items-center gap-1.5">
              <motion.span
                animate={{
                  scale: [1, 1.25, 1],
                  backgroundColor: ['#F28F79', '#F7E198', '#F28F79'],
                }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }}
                className="w-3 h-3 rounded-full bg-[#F28F79]"
              />
              <span className="font-serif text-3xl font-bold tracking-tight text-[#24221F]">
                GrowKins
              </span>
            </div>

            {/* Subtle supporting motto */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.75 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="text-[11px] font-sans font-medium uppercase tracking-widest text-[#757169]"
            >
              Growing through play
            </motion.span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
