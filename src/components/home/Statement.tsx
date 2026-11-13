"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

/** Twee regels die bij het scrollen langzaam langs elkaar schuiven, als een campagnebeeld. */
export function Statement() {
  const ref = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const shift = reduce ? 0 : 7;
  const x1 = useTransform(scrollYProgress, [0, 1], [`${shift}%`, `-${shift}%`]);
  const x2 = useTransform(scrollYProgress, [0, 1], [`-${shift}%`, `${shift}%`]);
  const line = useTransform(scrollYProgress, [0.15, 0.6], [0, 1]);

  return (
    <section ref={ref} className="overflow-hidden bg-espresso py-28 text-ivory lg:py-48" lang="en">
      <h2 className="display text-center text-[clamp(2.6rem,9.2vw,9.5rem)] leading-[0.95]">
        <motion.span className="block whitespace-nowrap" style={{ x: x1 }}>
          Not just a gift.
        </motion.span>
        <motion.span className="mt-2 block whitespace-nowrap text-blush" style={{ x: x2 }}>
          A memory to cherish.
        </motion.span>
      </h2>
      <motion.span
        aria-hidden
        className="mx-auto mt-12 block h-px w-[min(60vw,34rem)] origin-center bg-gold lg:mt-20"
        style={{ scaleX: line }}
      />
    </section>
  );
}
