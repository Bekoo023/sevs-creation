"use client";

import { useEffect } from "react";
import { useCart } from "@/components/cart/store";

/** Leegt de winkelwagen zodra een bestelling is afgerond. */
export function ClearCart() {
  useEffect(() => {
    const clear = () => useCart.getState().clear();
    if (useCart.persist.hasHydrated()) clear();
    return useCart.persist.onFinishHydration(clear);
  }, []);
  return null;
}
