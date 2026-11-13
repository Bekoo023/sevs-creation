"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Tekst die per woord vanachter een rand omhoog komt.
 * Geef regels als array om de regelval zelf te bepalen.
 */
export function RiseText({
  lines,
  className,
  delay = 0,
  immediate = false,
  as: Tag = "span",
}: {
  lines: ReactNode[][] | string[];
  className?: string;
  delay?: number;
  immediate?: boolean;
  as?: "span" | "h1" | "h2" | "p";
}) {
  const reduce = useReducedMotion();
  let index = 0;
  const MotionTag = motion[Tag];
  return (
    <MotionTag
      className={className}
      initial={reduce ? false : "hidden"}
      {...(immediate
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -12% 0px" } })}
    >
      {lines.map((line, li) => {
        const words = typeof line === "string" ? line.split(" ") : line;
        return (
          <span key={li} className="block">
            {words.map((word, wi) => {
              const i = index++;
              return (
                <span key={wi} className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom">
                  <motion.span
                    className="inline-block will-change-transform"
                    variants={{
                      hidden: { y: "112%" },
                      shown: {
                        y: 0,
                        transition: { duration: 1.05, ease: EASE, delay: delay + i * 0.075 },
                      },
                    }}
                  >
                    {word}
                  </motion.span>
                  {wi < words.length - 1 ? " " : null}
                </span>
              );
            })}
          </span>
        );
      })}
    </MotionTag>
  );
}

/** Beeld dat van onder naar boven wordt onthuld terwijl het iets uitzoomt. */
export function MaskReveal({
  children,
  className,
  delay = 0,
  immediate = false,
  from = "bottom",
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
  from?: "bottom" | "left" | "right";
}) {
  const reduce = useReducedMotion();
  const hidden =
    from === "bottom" ? "inset(100% 0% 0% 0%)" : from === "left" ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)";
  return (
    <motion.div
      className={className}
      initial={reduce ? false : "hidden"}
      {...(immediate
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -10% 0px" } })}
      variants={{
        hidden: { clipPath: hidden },
        shown: { clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 1.5, ease: EASE, delay } },
      }}
    >
      <motion.div
        className="h-full w-full"
        variants={{
          hidden: { scale: 1.16 },
          shown: { scale: 1, transition: { duration: 2, ease: EASE, delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Een blok tekst dat als geheel vanachter een rand omhoog schuift. */
export function RiseBlock({
  children,
  className,
  delay = 0,
  immediate = false,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  immediate?: boolean;
}) {
  const reduce = useReducedMotion();
  // De waarneming zit op de buitenste laag: de binnenste is bij de start volledig afgesneden.
  return (
    <motion.div
      className={`overflow-hidden ${className ?? ""}`}
      initial={reduce ? false : "hidden"}
      {...(immediate
        ? { animate: "shown" }
        : { whileInView: "shown", viewport: { once: true, margin: "0px 0px -8% 0px" } })}
    >
      <motion.div
        variants={{
          hidden: { y: "105%" },
          shown: { y: 0, transition: { duration: 1.1, ease: EASE, delay } },
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/** Dunne lijn die zichzelf tekent. */
export function DrawLine({ className, delay = 0 }: { className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  return (
    <motion.span
      aria-hidden
      className={`block h-px origin-left bg-current ${className ?? ""}`}
      initial={reduce ? false : { scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.4, ease: EASE, delay }}
    />
  );
}
