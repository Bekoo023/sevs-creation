"use client";

import { motion } from "motion/react";
import { useId } from "react";
import { cx } from "@/lib/format";
import { BACKGROUNDS, FRAMES } from "@/lib/options";
import type { BackgroundId, FrameId } from "@/lib/types";

/**
 * Kleurkeuze als staaltjes papier. Het gekozen staal krijgt een ring
 * die met een veer naar de nieuwe keuze glijdt.
 */
export function BackgroundSwatches({
  options,
  value,
  onChange,
  size = "size-11",
}: {
  options: BackgroundId[];
  value: BackgroundId;
  onChange: (v: BackgroundId) => void;
  size?: string;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label="Achtergrondkleur" className="flex flex-wrap gap-3">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={BACKGROUNDS[o].label}
            title={BACKGROUNDS[o].label}
            onClick={() => onChange(o)}
            className={cx("relative grid place-items-center rounded-full", size)}
          >
            {active && (
              <motion.span
                layoutId={`ring-${id}`}
                className="absolute inset-0 rounded-full border border-espresso"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span
              className="block size-[72%] rounded-full shadow-[inset_0_0_0_1px_rgba(52,43,41,0.14)] transition-transform duration-500 ease-luxe"
              style={{ background: BACKGROUNDS[o].color, transform: active ? "scale(0.92)" : undefined }}
            />
          </button>
        );
      })}
    </div>
  );
}

export function FrameToggle({
  options,
  value,
  onChange,
}: {
  options: FrameId[];
  value: FrameId;
  onChange: (v: FrameId) => void;
}) {
  const id = useId();
  return (
    <div role="radiogroup" aria-label="Fotolijst" className="inline-flex border border-espresso/20 p-1">
      {options.map((o) => {
        const active = o === value;
        return (
          <button
            key={o}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(o)}
            className="relative flex h-11 items-center gap-2.5 px-5 text-sm"
          >
            {active && (
              <motion.span
                layoutId={`frame-${id}`}
                className="absolute inset-0 bg-champagne"
                transition={{ type: "spring", stiffness: 380, damping: 32 }}
              />
            )}
            <span
              className="relative size-4 border border-espresso/30"
              style={{ boxShadow: `inset 0 0 0 3px ${FRAMES[o].color}`, background: "#e8dccf" }}
              aria-hidden
            />
            <span className="relative">{FRAMES[o].label}</span>
          </button>
        );
      })}
    </div>
  );
}
