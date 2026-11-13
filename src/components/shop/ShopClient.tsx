"use client";

import { SlidersHorizontal } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo, useState } from "react";
import { useCart } from "@/components/cart/store";
import { ProductCard } from "@/components/product/ProductCard";
import { QuickView } from "@/components/product/QuickView";
import { cx, formatPrice } from "@/lib/format";
import { BACKGROUNDS, FRAMES } from "@/lib/options";
import type { BackgroundId, FrameId, Product } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;
type Sort = "relevantie" | "nieuwste" | "prijs-op" | "prijs-af";

export function ShopClient({
  products,
  categories,
}: {
  products: Product[];
  categories: { slug: string; name: string; description: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const category = params.get("categorie") ?? "alle";
  const favorites = useCart((s) => s.favorites);

  const prices = products.map((p) => p.priceCents);
  const maxAvailable = Math.ceil(Math.max(...prices, 0) / 500) * 500;
  const minAvailable = Math.floor(Math.min(...prices, maxAvailable) / 500) * 500;

  const [maxPrice, setMaxPrice] = useState(maxAvailable);
  const [color, setColor] = useState<BackgroundId | null>(null);
  const [frame, setFrame] = useState<FrameId | null>(null);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [sort, setSort] = useState<Sort>("relevantie");
  const [panel, setPanel] = useState(false);
  const [quick, setQuick] = useState<Product | null>(null);
  const closeQuick = useCallback(() => setQuick(null), []);

  const colors = useMemo(
    () => [...new Set(products.flatMap((p) => p.backgrounds))].filter((c) => c in BACKGROUNDS),
    [products],
  );
  const frames = useMemo(
    () => [...new Set(products.flatMap((p) => p.frames))].filter((f) => f in FRAMES),
    [products],
  );

  const visible = useMemo(() => {
    const list = products.filter(
      (p) =>
        (category === "alle" || p.category.slug === category) &&
        p.priceCents <= maxPrice &&
        (!color || p.backgrounds.includes(color)) &&
        (!frame || p.frames.includes(frame)) &&
        (!onlyFavorites || favorites.includes(p.id)),
    );
    const sorted = [...list];
    if (sort === "prijs-op") sorted.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "prijs-af") sorted.sort((a, b) => b.priceCents - a.priceCents);
    if (sort === "nieuwste") sorted.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    if (sort === "relevantie") sorted.sort((a, b) => Number(b.featured) - Number(a.featured));
    return sorted;
  }, [products, category, maxPrice, color, frame, onlyFavorites, favorites, sort]);

  const activeCount =
    Number(maxPrice < maxAvailable) + Number(!!color) + Number(!!frame) + Number(onlyFavorites);

  const setCategory = (slug: string) =>
    router.replace(slug === "alle" ? "/shop" : `/shop?categorie=${slug}`, { scroll: false });

  const reset = () => {
    setMaxPrice(maxAvailable);
    setColor(null);
    setFrame(null);
    setOnlyFavorites(false);
  };

  const current = categories.find((c) => c.slug === category);

  return (
    <div className="shell pb-28 pt-32 lg:pt-44">
      <header className="grid gap-6 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label text-mocha">Shop</p>
          <h1 className="display t-1 mt-4">{current?.name ?? "Alle creaties"}</h1>
        </div>
        <p className="max-w-md text-mocha lg:col-span-4 lg:col-start-9">
          {current?.description ??
            "Geboortelijsten en satijnen boeketten, met de hand gemaakt en op naam afgewerkt."}
        </p>
      </header>

      <div className="mt-12 flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-y border-espresso/15 py-3">
        <div role="tablist" aria-label="Categorie" className="no-scrollbar -mx-1 flex gap-6 overflow-x-auto px-1">
          {[{ slug: "alle", name: "Alles" }, ...categories].map((c) => (
            <button
              key={c.slug}
              role="tab"
              type="button"
              aria-selected={category === c.slug}
              onClick={() => setCategory(c.slug)}
              className={cx(
                "link-line label min-h-11 shrink-0 !tracking-[0.2em]",
                category === c.slug ? "is-drawn" : "text-mocha",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => setPanel((p) => !p)}
            aria-expanded={panel}
            aria-controls="filters"
            className="label flex min-h-11 items-center gap-2.5 !tracking-[0.2em]"
          >
            <SlidersHorizontal size={15} strokeWidth={1.25} />
            Filters{activeCount > 0 ? ` (${activeCount})` : ""}
          </button>
          <label className="label flex min-h-11 items-center gap-2 !tracking-[0.2em]">
            <span className="text-mocha max-sm:sr-only">Sorteer</span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
              className="label cursor-pointer bg-transparent py-2 !tracking-[0.2em] focus:outline-none"
            >
              <option value="relevantie">Relevantie</option>
              <option value="nieuwste">Nieuwste</option>
              <option value="prijs-op">Prijs oplopend</option>
              <option value="prijs-af">Prijs aflopend</option>
            </select>
          </label>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {panel && (
          <motion.div
            id="filters"
            initial={{ height: 0 }}
            animate={{ height: "auto" }}
            exit={{ height: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="overflow-hidden border-b border-espresso/15"
          >
            <div className="grid gap-x-12 gap-y-8 py-8 sm:grid-cols-2 lg:grid-cols-4">
              <fieldset>
                <legend className="field-label">Kleur</legend>
                <div className="mt-3 flex flex-wrap gap-2">
                  {colors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      aria-pressed={color === c}
                      aria-label={BACKGROUNDS[c].label}
                      title={BACKGROUNDS[c].label}
                      onClick={() => setColor(color === c ? null : c)}
                      className={cx(
                        "grid size-11 place-items-center rounded-full border transition-colors",
                        color === c ? "border-espresso" : "border-transparent",
                      )}
                    >
                      <span
                        className="size-7 rounded-full shadow-[inset_0_0_0_1px_rgba(52,43,41,0.14)]"
                        style={{ background: BACKGROUNDS[c].color }}
                      />
                    </button>
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="field-label">Type fotolijst</legend>
                <div className="mt-3 flex gap-2">
                  {frames.map((f) => (
                    <button
                      key={f}
                      type="button"
                      aria-pressed={frame === f}
                      onClick={() => setFrame(frame === f ? null : f)}
                      className={cx(
                        "h-11 border px-5 text-sm transition-colors",
                        frame === f ? "border-espresso bg-espresso text-ivory" : "border-espresso/20",
                      )}
                    >
                      {FRAMES[f].label}
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="prijs" className="field-label">
                  Prijs tot {formatPrice(maxPrice)}
                </label>
                <input
                  id="prijs"
                  type="range"
                  min={minAvailable}
                  max={maxAvailable}
                  step={500}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="mt-5 h-11 w-full accent-espresso"
                />
              </div>
              <div className="flex flex-col items-start gap-3">
                <span className="field-label">Bewaard</span>
                <button
                  type="button"
                  aria-pressed={onlyFavorites}
                  onClick={() => setOnlyFavorites((v) => !v)}
                  className={cx(
                    "h-11 border px-5 text-sm transition-colors",
                    onlyFavorites ? "border-espresso bg-espresso text-ivory" : "border-espresso/20",
                  )}
                >
                  Alleen favorieten ({favorites.length})
                </button>
                {activeCount > 0 && (
                  <button type="button" onClick={reset} className="link-line is-drawn text-sm text-mocha">
                    Filters wissen
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <p className="label mt-8 text-mocha" aria-live="polite">
        {visible.length} {visible.length === 1 ? "creatie" : "creaties"}
      </p>

      {visible.length === 0 ? (
        <div className="grid min-h-[40vh] place-items-center py-20 text-center">
          <div>
            <p className="display t-2">Niets gevonden met deze keuze.</p>
            <p className="mx-auto mt-4 max-w-sm text-mocha">
              Probeer een andere kleur of een ruimere prijs. Zoek je iets dat er niet tussen staat, stuur
              dan een bericht.
            </p>
            <button type="button" onClick={reset} className="btn btn-outline mt-8">
              Filters wissen
            </button>
          </div>
        </div>
      ) : (
        <motion.ul layout className="mt-8 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-20">
          <AnimatePresence mode="popLayout" initial={false}>
            {visible.map((product, i) => (
              <motion.li
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.6, ease: EASE }}
                className={cx(i % 3 === 1 && "lg:mt-16")}
              >
                <ProductCard
                  product={product}
                  onQuickView={setQuick}
                  sizes="(min-width: 1024px) 31vw, 50vw"
                  priority={i < 3}
                />
              </motion.li>
            ))}
          </AnimatePresence>
        </motion.ul>
      )}
      <QuickView product={quick} onClose={closeQuick} />
    </div>
  );
}
