"use client";

import { motion, useReducedMotion } from "motion/react";

/** De lijn met het hartje die op elke lijst onder de naam staat, hier als getekende handtekening. */
export function Flourish({ className }: { className?: string }) {
  const reduce = useReducedMotion();
  const draw = {
    hidden: { pathLength: 0 },
    shown: (d: number) => ({ pathLength: 1, transition: { duration: 1.6, ease: [0.65, 0, 0.35, 1] as const, delay: d } }),
  };
  return (
    <motion.svg
      viewBox="0 0 240 28"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth="1"
      strokeLinecap="round"
      aria-hidden
      initial={reduce ? false : "hidden"}
      whileInView="shown"
      viewport={{ once: true, margin: "0px 0px -10% 0px" }}
    >
      <motion.path d="M2 14 H96" variants={draw} custom={0} />
      <motion.path
        d="M120 23 C108 14 106 6 113 5 C117 4.5 120 8 120 10 C120 8 123 4.5 127 5 C134 6 132 14 120 23 Z"
        variants={draw}
        custom={0.5}
      />
      <motion.path d="M144 14 H238" variants={draw} custom={0.9} />
    </motion.svg>
  );
}
