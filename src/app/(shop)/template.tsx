"use client";

import { motion } from "motion/react";
import { useEffect } from "react";

// De eerste weergave komt van de server en blijft direct zichtbaar (goed voor LCP).
// Alleen bij navigatie binnen de site speelt de overgang.
let hydrated = false;

/** Rustige overgang bij elke paginawissel. */
export default function Template({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    hydrated = true;
  }, []);
  return (
    <motion.div
      initial={hydrated ? { opacity: 0, y: 14 } : false}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
