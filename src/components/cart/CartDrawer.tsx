"use client";

import { Minus, Plus, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import { formatBirthDate, formatPrice } from "@/lib/format";
import { backgroundLabel, frameLabel } from "@/lib/options";
import { shippingFor } from "@/lib/pricing";
import { lockScroll } from "@/lib/scroll";
import { formatWeight } from "@/lib/validation";
import { cartCount, cartSubtotal, useCart, type CartItem } from "./store";

const EASE = [0.22, 1, 0.36, 1] as const;

export function ItemThumb({ item, size = "h-28 w-[5.5rem]" }: { item: Pick<CartItem, "image" | "name">; size?: string }) {
  return (
    <div className={`relative shrink-0 overflow-hidden bg-champagne ${size}`}>
      {item.image ? (
        <Image src={item.image} alt="" fill sizes="96px" className="object-cover" />
      ) : (
        <span className="absolute inset-2 grid place-items-center border border-espresso/15 text-center font-serif text-xs leading-tight text-mocha">
          Foto volgt
        </span>
      )}
    </div>
  );
}

export function ItemSpecs({ item }: { item: CartItem }) {
  const p = item.personalization;
  const rows: [string, string][] = [];
  if (item.frame) rows.push(["Lijst", frameLabel(item.frame) ?? item.frame]);
  if (item.background) rows.push(["Achtergrond", backgroundLabel(item.background) ?? item.background]);
  if (p) {
    rows.push(["Naam", p.naam]);
    rows.push(["Geboren", `${formatBirthDate(p.geboortedatum)}, ${p.geboortetijd} uur`]);
    rows.push(["Gewicht en lengte", `${formatWeight(p.gewicht)}, ${p.lengte} cm`]);
    if (p.opmerking) rows.push(["Opmerking", p.opmerking]);
  }
  if (item.note) rows.push(["Opmerking", item.note]);
  if (!rows.length) return null;
  return (
    <dl className="mt-2 space-y-0.5 text-[0.8125rem] leading-snug text-mocha">
      {rows.map(([k, v]) => (
        <div key={k} className="flex gap-1.5">
          <dt className="shrink-0">{k}:</dt>
          <dd className="min-w-0 break-words text-espresso">{v}</dd>
        </div>
      ))}
    </dl>
  );
}

export function CartDrawer() {
  const { items, open, justAdded, setOpen, remove, setQuantity } = useCart();
  const closeRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);

  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement as HTMLElement | null;
    lockScroll(true);
    const t = setTimeout(() => closeRef.current?.focus(), 80);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key !== "Tab" || !panelRef.current) return;
      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => {
      clearTimeout(t);
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
      previous?.focus?.();
    };
  }, [open, setOpen]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60]">
          <motion.div
            className="absolute inset-0 bg-espresso/45"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <motion.aside
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Winkelwagen"
            data-lenis-prevent
            className="absolute inset-y-0 right-0 flex w-full max-w-[30rem] flex-col bg-ivory shadow-[-30px_0_80px_-40px_rgba(52,43,41,0.45)]"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%", transition: { duration: 0.55, ease: [0.65, 0, 0.35, 1] } }}
            transition={{ duration: 0.85, ease: EASE }}
          >
            <header className="flex items-end justify-between px-6 pb-5 pt-7 sm:px-9">
              <div className="overflow-hidden">
                <motion.h2
                  className="display text-[2.25rem]"
                  initial={{ y: "105%" }}
                  animate={{ y: 0 }}
                  transition={{ duration: 0.9, ease: EASE, delay: 0.25 }}
                >
                  Winkelwagen
                </motion.h2>
              </div>
              <div className="flex items-center gap-3">
                <span className="label text-mocha" aria-live="polite">
                  {cartCount(items)} {cartCount(items) === 1 ? "stuk" : "stuks"}
                </span>
                <button
                  ref={closeRef}
                  type="button"
                  onClick={() => setOpen(false)}
                  className="-mr-2 grid size-11 place-items-center"
                  aria-label="Winkelwagen sluiten"
                >
                  <X size={22} strokeWidth={1.25} />
                </button>
              </div>
            </header>
            <motion.span
              aria-hidden
              className="mx-6 block h-px origin-left bg-espresso/15 sm:mx-9"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.1, ease: EASE, delay: 0.3 }}
            />

            {items.length === 0 ? (
              <div className="flex flex-1 flex-col items-start justify-center px-6 sm:px-9">
                <p className="display t-3 max-w-[16ch]">Je winkelwagen is nog leeg.</p>
                <p className="mt-3 max-w-xs text-mocha">
                  Kies een geboortelijst of boeket en maak het persoonlijk.
                </p>
                <Link href="/shop" onClick={() => setOpen(false)} className="btn btn-outline mt-8">
                  Naar de collectie
                </Link>
              </div>
            ) : (
              <>
                <ul className="flex-1 overflow-y-auto overscroll-contain px-6 sm:px-9">
                  <AnimatePresence initial={false}>
                    {items.map((item, i) => {
                      const fresh = item.key === justAdded;
                      return (
                        <motion.li
                          key={item.key}
                          layout
                          initial={{ opacity: 0, x: 48 }}
                          animate={{
                            opacity: 1,
                            x: 0,
                            transition: { duration: 0.8, ease: EASE, delay: 0.3 + Math.min(i, 4) * 0.07 },
                          }}
                          exit={{ opacity: 0, height: 0, transition: { duration: 0.4, ease: EASE } }}
                          className="relative overflow-hidden border-b border-espresso/10"
                        >
                          {fresh && (
                            <motion.div
                              className="flex items-center gap-3 pt-5 text-gold"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1, transition: { delay: 0.7 } }}
                            >
                              <motion.span
                                aria-hidden
                                className="h-px w-10 origin-left bg-current"
                                initial={{ scaleX: 0 }}
                                animate={{ scaleX: 1 }}
                                transition={{ duration: 0.9, ease: EASE, delay: 0.75 }}
                              />
                              <span className="label !text-[0.625rem] text-espresso" role="status">
                                Toegevoegd
                              </span>
                            </motion.div>
                          )}
                          <div className="flex gap-4 py-5">
                            <ItemThumb item={item} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <Link
                                    href={`/shop/${item.slug}`}
                                    onClick={() => setOpen(false)}
                                    className="font-serif text-[1.35rem] leading-tight"
                                  >
                                    {item.name}
                                  </Link>
                                  <p className="text-[0.8125rem] text-mocha">{item.subtitle}</p>
                                </div>
                                <p className="shrink-0 pt-1 text-sm tabular-nums">
                                  {formatPrice(item.unitPriceCents * item.quantity)}
                                </p>
                              </div>
                              <ItemSpecs item={item} />
                              <div className="mt-3 flex items-center justify-between">
                                <div className="flex items-center border border-espresso/20">
                                  <button
                                    type="button"
                                    className="grid size-9 place-items-center disabled:opacity-30"
                                    onClick={() => setQuantity(item.key, item.quantity - 1)}
                                    disabled={item.quantity <= 1}
                                    aria-label={`Eén ${item.name} minder`}
                                  >
                                    <Minus size={13} strokeWidth={1.5} />
                                  </button>
                                  <span className="w-7 text-center text-sm tabular-nums" aria-live="polite">
                                    {item.quantity}
                                  </span>
                                  <button
                                    type="button"
                                    className="grid size-9 place-items-center disabled:opacity-30"
                                    onClick={() => setQuantity(item.key, item.quantity + 1)}
                                    disabled={item.quantity >= 10}
                                    aria-label={`Eén ${item.name} meer`}
                                  >
                                    <Plus size={13} strokeWidth={1.5} />
                                  </button>
                                </div>
                                <button
                                  type="button"
                                  onClick={() => remove(item.key)}
                                  className="link-line is-drawn text-[0.8125rem] text-mocha"
                                >
                                  Verwijderen
                                </button>
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      );
                    })}
                  </AnimatePresence>
                </ul>

                <motion.footer
                  className="border-t border-espresso/15 bg-ivory px-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-5 sm:px-9"
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: EASE, delay: 0.4 }}
                >
                  <dl className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <dt className="text-mocha">Subtotaal</dt>
                      <dd className="tabular-nums">{formatPrice(subtotal)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mocha">Verzending</dt>
                      <dd className="tabular-nums">{shipping === 0 ? "Gratis" : formatPrice(shipping)}</dd>
                    </div>
                    <div className="flex items-baseline justify-between pt-2">
                      <dt className="label">Totaal</dt>
                      <dd className="font-serif text-[1.75rem] leading-none tabular-nums">
                        {formatPrice(subtotal + shipping)}
                      </dd>
                    </div>
                  </dl>
                  <Link
                    href="/afrekenen"
                    onClick={() => setOpen(false)}
                    className="btn btn-primary mt-5 w-full"
                  >
                    Afrekenen
                  </Link>
                  <p className="mt-3 text-center text-xs text-mocha">Prijzen zijn inclusief btw.</p>
                </motion.footer>
              </>
            )}
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
