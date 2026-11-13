"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { ItemThumb } from "@/components/cart/CartDrawer";
import { formatPrice } from "@/lib/format";
import { lockScroll } from "@/lib/scroll";
import type { Product } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

export function SearchOverlay({
  open,
  onClose,
  products,
}: {
  open: boolean;
  onClose: () => void;
  products: Product[];
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    lockScroll(true);
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return products.filter((p) => p.featured);
    return products.filter((p) =>
      [p.name, p.subtitle, p.category.name, p.description, p.animal ?? ""].join(" ").toLowerCase().includes(q),
    );
  }, [query, products]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label="Zoeken"
          data-lenis-prevent
          className="fixed inset-0 z-[70] overflow-y-auto bg-ivory"
          initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
          animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
          exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
          transition={{ duration: 0.8, ease: EASE }}
        >
          <div className="shell py-6">
            <div className="flex justify-end">
              <button type="button" onClick={onClose} className="grid size-11 place-items-center" aria-label="Zoeken sluiten">
                <X size={22} strokeWidth={1.25} />
              </button>
            </div>
            <div className="mx-auto mt-6 max-w-3xl lg:mt-14">
              <label htmlFor="zoekveld" className="label text-mocha">
                Zoeken
              </label>
              <input
                id="zoekveld"
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Olifant, boeket, lila"
                autoComplete="off"
                className="mt-2 w-full border-b border-espresso/30 bg-transparent pb-3 font-serif text-[clamp(2rem,6vw,3.75rem)] leading-tight placeholder:text-espresso/25 focus:border-espresso focus:outline-none"
              />
              <p className="label mt-10 text-mocha" aria-live="polite">
                {query.trim()
                  ? `${results.length} ${results.length === 1 ? "resultaat" : "resultaten"}`
                  : "Uitgelicht"}
              </p>
              {results.length === 0 ? (
                <p className="display t-3 mt-6">Niets gevonden voor “{query.trim()}”.</p>
              ) : (
                <ul className="mt-4">
                  {results.map((p) => (
                    <li key={p.id} className="border-b border-espresso/10">
                      <Link href={`/shop/${p.slug}`} onClick={onClose} className="group flex items-center gap-5 py-4">
                        <ItemThumb item={{ image: p.images[0]?.src ?? null, name: p.name }} size="h-20 w-16" />
                        <span className="flex-1">
                          <span className="link-line group-draw font-serif text-2xl leading-tight">{p.name}</span>
                          <span className="block text-[0.8125rem] text-mocha">{p.subtitle}</span>
                        </span>
                        <span className="text-sm tabular-nums">{formatPrice(p.priceCents)}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
