"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Personalization } from "@/lib/types";

export type CartItem = {
  key: string;
  productId: string;
  slug: string;
  name: string;
  subtitle: string;
  image: string | null;
  /** Alleen voor weergave. De server berekent de prijs opnieuw bij het afrekenen. */
  unitPriceCents: number;
  quantity: number;
  frame?: string;
  background?: string;
  personalization?: Personalization;
  note?: string;
};

type CartState = {
  items: CartItem[];
  open: boolean;
  justAdded: string | null;
  favorites: string[];
  add: (item: Omit<CartItem, "key">) => void;
  remove: (key: string) => void;
  setQuantity: (key: string, quantity: number) => void;
  clear: () => void;
  setOpen: (open: boolean) => void;
  toggleFavorite: (productId: string) => void;
};

const makeKey = (i: Omit<CartItem, "key">) =>
  [i.productId, i.frame, i.background, JSON.stringify(i.personalization ?? null), i.note ?? ""].join("|");

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      open: false,
      justAdded: null,
      favorites: [],
      add: (item) =>
        set((s) => {
          const key = makeKey(item);
          const existing = s.items.find((i) => i.key === key);
          const items = existing
            ? s.items.map((i) =>
                i.key === key ? { ...i, quantity: Math.min(10, i.quantity + item.quantity) } : i,
              )
            : [{ ...item, key }, ...s.items];
          return { items, open: true, justAdded: key };
        }),
      remove: (key) => set((s) => ({ items: s.items.filter((i) => i.key !== key) })),
      setQuantity: (key, quantity) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.key === key ? { ...i, quantity: Math.max(1, Math.min(10, quantity)) } : i,
          ),
        })),
      clear: () => set({ items: [], justAdded: null }),
      setOpen: (open) => set((s) => ({ open, justAdded: open ? s.justAdded : null })),
      toggleFavorite: (id) =>
        set((s) => ({
          favorites: s.favorites.includes(id)
            ? s.favorites.filter((f) => f !== id)
            : [...s.favorites, id],
        })),
    }),
    {
      name: "sevs-cart",
      version: 1,
      partialize: (s) => ({ items: s.items, favorites: s.favorites }),
      skipHydration: true,
    },
  ),
);

export const cartCount = (items: CartItem[]) => items.reduce((n, i) => n + i.quantity, 0);
export const cartSubtotal = (items: CartItem[]) =>
  items.reduce((n, i) => n + i.unitPriceCents * i.quantity, 0);
