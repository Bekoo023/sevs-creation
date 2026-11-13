"use client";

import type Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

let locks = 0;

/** Vergrendelt de pagina-scroll voor drawers en overlays. Telt mee bij nesting. */
export function lockScroll(lock: boolean) {
  locks = Math.max(0, locks + (lock ? 1 : -1));
  const locked = locks > 0;
  document.documentElement.style.overflow = locked ? "hidden" : "";
  if (locked) window.__lenis?.stop();
  else window.__lenis?.start();
}
