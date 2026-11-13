"use client";

import Lenis from "lenis";
import { MotionConfig } from "motion/react";
import { useEffect, type ReactNode } from "react";
import { useCart } from "@/components/cart/store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useCart.persist.rehydrate();
  }, []);

  // Zacht scrollen alleen met muis of trackpad en zonder voorkeur voor minder beweging.
  useEffect(() => {
    const fine = window.matchMedia("(pointer: fine)").matches;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!fine || reduce) return;
    const lenis = new Lenis({ duration: 1.05, anchors: true });
    window.__lenis = lenis;
    let raf = 0;
    const loop = (t: number) => {
      lenis.raf(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
