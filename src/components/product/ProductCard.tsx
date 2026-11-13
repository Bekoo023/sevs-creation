"use client";

import { Heart } from "lucide-react";
import { motion } from "motion/react";
import Link from "next/link";
import { useCart } from "@/components/cart/store";
import { cx, formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";

export function FavoriteButton({ product, className }: { product: Pick<Product, "id" | "name">; className?: string }) {
  const active = useCart((s) => s.favorites.includes(product.id));
  const toggle = useCart((s) => s.toggleFavorite);
  return (
    <motion.button
      type="button"
      whileTap={{ scale: 0.82 }}
      transition={{ type: "spring", stiffness: 420, damping: 14 }}
      onClick={() => toggle(product.id)}
      aria-pressed={active}
      aria-label={active ? `${product.name} verwijderen uit favorieten` : `${product.name} bewaren als favoriet`}
      className={cx("grid size-11 place-items-center rounded-full bg-ivory/90 text-espresso", className)}
    >
      <motion.span animate={{ scale: active ? [1, 1.3, 1] : 1 }} transition={{ duration: 0.45 }}>
        <Heart size={17} strokeWidth={1.25} fill={active ? "#c79f9c" : "none"} stroke={active ? "#c79f9c" : "currentColor"} />
      </motion.span>
    </motion.button>
  );
}

export function ProductCard({
  product,
  onQuickView,
  ratio = "aspect-[4/5]",
  sizes = "(min-width: 1024px) 25vw, 50vw",
  priority,
}: {
  product: Product;
  onQuickView?: (product: Product) => void;
  ratio?: string;
  sizes?: string;
  priority?: boolean;
}) {
  const second = product.images[1];
  return (
    <article className="group relative">
      <div className={cx("relative overflow-hidden bg-champagne", ratio)}>
        <Link href={`/shop/${product.slug}`} className="absolute inset-0" aria-label={`${product.name}, ${product.subtitle}`}>
          <div className="absolute inset-0 transition-transform duration-[1400ms] ease-luxe group-hover:scale-[1.035]">
            <ProductVisual product={product} sizes={sizes} priority={priority} />
          </div>
          {second && (
            <div className="absolute inset-0 hidden transition-[clip-path] duration-[900ms] ease-luxe [clip-path:inset(0_0_100%_0)] group-hover:[clip-path:inset(0_0_0_0)] [@media(hover:hover)]:block">
              <ProductVisual product={product} index={1} sizes={sizes} />
            </div>
          )}
        </Link>
        <FavoriteButton product={product} className="absolute right-3 top-3" />
        {onQuickView && (
          <button
            type="button"
            onClick={() => onQuickView(product)}
            className="label absolute inset-x-3 bottom-3 hidden h-11 translate-y-[140%] bg-ivory/95 !text-[0.625rem] transition-transform duration-700 ease-luxe focus-visible:translate-y-0 group-hover:translate-y-0 [@media(hover:hover)]:block"
          >
            Snel bekijken
          </button>
        )}
      </div>
      <div className="mt-4 flex items-start justify-between gap-4">
        <div>
          <h3 className="font-serif text-[1.45rem] leading-tight">
            <Link href={`/shop/${product.slug}`}>{product.name}</Link>
          </h3>
          <p className="mt-0.5 text-[0.8125rem] text-mocha">{product.subtitle}</p>
        </div>
        <p className="shrink-0 pt-1 text-sm tabular-nums">{formatPrice(product.priceCents)}</p>
      </div>
    </article>
  );
}
