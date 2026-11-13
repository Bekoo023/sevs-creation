"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { RiseText } from "@/components/motion/Reveal";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { cx } from "@/lib/format";
import type { Product } from "@/lib/types";

// Elke kaart krijgt een eigen plek in het raster: geen rij van vier gelijke blokken.
const PLACEMENT = [
  { col: "lg:col-span-5", ratio: "aspect-[4/5]", sizes: "(min-width: 1024px) 40vw, 100vw" },
  { col: "lg:col-span-3 lg:col-start-7 lg:mt-40", ratio: "aspect-[3/4]", sizes: "(min-width: 1024px) 24vw, 50vw" },
  { col: "lg:col-span-3 lg:col-start-10 lg:mt-12", ratio: "aspect-[3/4]", sizes: "(min-width: 1024px) 24vw, 50vw" },
  { col: "lg:col-span-4 lg:col-start-2 lg:mt-24", ratio: "aspect-square", sizes: "(min-width: 1024px) 32vw, 100vw" },
];

export function Featured({ products }: { products: Product[] }) {
  const [quick, setQuick] = useState<Product | null>(null);
  const close = useCallback(() => setQuick(null), []);
  return (
    <section className="py-24 lg:py-40">
      <div className="shell">
        <div className="grid gap-6 lg:grid-cols-12">
          <p className="label text-mocha lg:col-span-2 lg:pt-4">Collectie</p>
          <h2 className="display t-1 lg:col-span-8">
            <RiseText lines={["Met zorg voor jou", "geselecteerd."]} />
          </h2>
        </div>

        <div className="mt-16 grid grid-cols-2 gap-x-4 gap-y-12 lg:mt-24 lg:grid-cols-12 lg:gap-x-8 lg:gap-y-0">
          {products.slice(0, 4).map((product, i) => (
            <div key={product.id} className={cx(i === 0 || i === 3 ? "col-span-2" : "col-span-1", PLACEMENT[i].col)}>
              <ProductCard
                product={product}
                onQuickView={setQuick}
                ratio={PLACEMENT[i].ratio}
                sizes={PLACEMENT[i].sizes}
              />
            </div>
          ))}
          <div className="col-span-2 flex items-end lg:col-span-5 lg:col-start-8 lg:justify-end lg:pb-16">
            <Link href="/shop" className="btn btn-outline">
              Bekijk de hele collectie
            </Link>
          </div>
        </div>
      </div>
      <QuickView product={quick} onClose={close} />
    </section>
  );
}
