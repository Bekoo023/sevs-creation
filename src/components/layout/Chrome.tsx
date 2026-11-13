"use client";

import { useCallback, useState } from "react";
import { CartDrawer } from "@/components/cart/CartDrawer";
import type { Product } from "@/lib/types";
import { Header } from "./Header";
import { SearchOverlay } from "./SearchOverlay";

/** Navigatie, zoeken en winkelwagen: alles wat boven de pagina's zweeft. */
export function Chrome({ products }: { products: Product[] }) {
  const [search, setSearch] = useState(false);
  const close = useCallback(() => setSearch(false), []);
  return (
    <>
      <a
        href="#inhoud"
        className="label fixed left-4 top-4 z-[80] -translate-y-24 bg-espresso px-4 py-3 text-ivory focus:translate-y-0"
      >
        Naar de inhoud
      </a>
      <Header onSearch={() => setSearch(true)} />
      <SearchOverlay open={search} onClose={close} products={products} />
      <CartDrawer />
    </>
  );
}
