import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AnimatedCounterProps {
  count: number;
  className?: string;
}

export const AnimatedCounter: React.FC<AnimatedCounterProps> = ({ count, className = '' }) => {
  return (
    <div className={`relative inline-flex overflow-hidden h-[1.2em] items-center ${className}`}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={count}
          initial={{ y: -16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 16, opacity: 0 }}
          transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
          className="inline-block"
        >
          {count}
        </motion.span>
      </AnimatePresence>
    </div>
  );
};
