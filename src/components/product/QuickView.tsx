"use client";

import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { useCart } from "@/components/cart/store";
import { formatPrice } from "@/lib/format";
import { lockScroll } from "@/lib/scroll";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

const EASE = [0.22, 1, 0.36, 1] as const;

export function QuickView({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const add = useCart((s) => s.add);
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!product) return;
    lockScroll(true);
    closeRef.current?.focus();
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [product, onClose]);

  return (
    <AnimatePresence>
      {product && (
        <div className="fixed inset-0 z-[55] grid place-items-center p-4">
          <motion.div
            className="absolute inset-0 bg-espresso/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={`Snel bekijken: ${product.name}`}
            data-lenis-prevent
            className="relative grid max-h-[90dvh] w-full max-w-4xl overflow-y-auto bg-ivory md:grid-cols-2"
            initial={{ clipPath: "inset(50% 0% 50% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(50% 0% 50% 0%)", transition: { duration: 0.4 } }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <div className="relative aspect-square md:aspect-auto md:min-h-[30rem]">
              <ProductVisual product={product} sizes="(min-width: 768px) 450px, 100vw" />
            </div>
            <div className="flex flex-col p-7 sm:p-10">
              <p className="label text-mocha">{product.category.name}</p>
              <h2 className="display t-2 mt-3">{product.name}</h2>
              <p className="mt-1 text-mocha">{product.subtitle}</p>
              <p className="mt-5 font-serif text-2xl tabular-nums">{formatPrice(product.priceCents)}</p>
              <p className="mt-5 text-mocha">{product.description}</p>
              <div className="mt-auto pt-8">
                {product.personalizable ? (
                  <Link href={`/shop/${product.slug}`} className="btn btn-primary w-full" onClick={onClose}>
                    Personaliseer
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="btn btn-primary w-full"
                    onClick={() => {
                      add({
                        productId: product.id,
                        slug: product.slug,
                        name: product.name,
                        subtitle: product.subtitle,
                        image: product.images[0]?.src ?? null,
                        unitPriceCents: product.priceCents,
                        quantity: 1,
                      });
                      onClose();
                    }}
                  >
                    In winkelwagen
                  </button>
                )}
                <Link href={`/shop/${product.slug}`} onClick={onClose} className="link-line is-drawn mt-4 text-sm">
                  Alle details bekijken
                </Link>
              </div>
            </div>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="absolute right-2 top-2 grid size-11 place-items-center bg-ivory/90"
              aria-label="Sluiten"
            >
              <X size={20} strokeWidth={1.25} />
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
