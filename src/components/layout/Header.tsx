"use client";

import { Search, ShoppingBag, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { cartCount, useCart } from "@/components/cart/store";
import { siteConfig } from "@/config/site";
import { cx } from "@/lib/format";
import { lockScroll } from "@/lib/scroll";

const EASE = [0.22, 1, 0.36, 1] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop?categorie=geboortecadeaus", label: "Geboortecadeaus" },
  { href: "/shop?categorie=satijnen-boeketten", label: "Satijnen Boeketten" },
  { href: "/over-ons", label: "Over Ons" },
  { href: "/contact", label: "Contact" },
];

export function Header({ onSearch }: { onSearch: () => void }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menu, setMenu] = useState(false);
  const count = useCart((s) => cartCount(s.items));
  const openCart = useCart((s) => s.setOpen);
  const toggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menu) return;
    lockScroll(true);
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenu(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lockScroll(false);
      window.removeEventListener("keydown", onKey);
    };
  }, [menu]);

  const solid = scrolled && !menu;

  return (
    <>
      <header
        className={cx(
          "fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow] duration-700 ease-luxe",
          solid ? "bg-ivory/95 shadow-[0_1px_0_0_rgba(52,43,41,0.1)] backdrop-blur-sm" : "bg-transparent",
        )}
      >
        <div className="shell flex h-[4.5rem] items-center justify-between gap-6 lg:h-20">
          <Link
            href="/"
            onClick={() => setMenu(false)}
            className="relative z-10 font-serif text-[1.45rem] leading-none tracking-[0.01em] lg:text-[1.6rem]"
            aria-label={`${siteConfig.name}, naar de homepage`}
          >
            Sevs <span className="text-mocha">Creations</span>
          </Link>

          <nav aria-label="Hoofdnavigatie" className="hidden lg:block">
            <ul className="flex items-center gap-8 xl:gap-10">
              {NAV.slice(1).map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cx(
                      "link-line label !tracking-[0.2em]",
                      pathname === item.href && "is-drawn",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="relative z-10 flex items-center gap-1">
            <button
              type="button"
              onClick={onSearch}
              className="grid size-11 place-items-center"
              aria-label="Zoeken"
            >
              <Search size={19} strokeWidth={1.25} />
            </button>
            <button
              type="button"
              onClick={() => {
                setMenu(false);
                openCart(true);
              }}
              className="relative grid size-11 place-items-center"
              aria-label={`Winkelwagen openen, ${count} ${count === 1 ? "artikel" : "artikelen"}`}
            >
              <ShoppingBag size={19} strokeWidth={1.25} />
              <AnimatePresence mode="popLayout" initial={false}>
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ y: 8, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -8, opacity: 0 }}
                    transition={{ duration: 0.4, ease: EASE }}
                    className="absolute right-0.5 top-1 grid min-w-[1.05rem] place-items-center rounded-full bg-espresso px-1 text-[0.625rem] font-semibold leading-[1.05rem] text-ivory"
                  >
                    {count}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
            <button
              ref={toggleRef}
              type="button"
              onClick={() => setMenu((m) => !m)}
              className="grid size-11 place-items-center lg:hidden"
              aria-expanded={menu}
              aria-controls="mobiel-menu"
              aria-label={menu ? "Menu sluiten" : "Menu openen"}
            >
              {menu ? (
                <X size={22} strokeWidth={1.25} />
              ) : (
                <span aria-hidden className="flex w-6 flex-col items-end gap-[7px]">
                  <span className="h-px w-6 bg-current" />
                  <span className="h-px w-4 bg-current" />
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {menu && (
          <motion.div
            id="mobiel-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Menu"
            className="fixed inset-0 z-40 flex flex-col bg-champagne lg:hidden"
            initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
            animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
            exit={{ clipPath: "inset(0% 0% 100% 0%)" }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <nav aria-label="Mobiele navigatie" className="shell flex flex-1 flex-col justify-center pt-20">
              <ul>
                {NAV.map((item, i) => (
                  <li key={item.href} className="overflow-hidden border-b border-espresso/10">
                    <motion.div
                      initial={{ y: "110%" }}
                      animate={{ y: 0 }}
                      exit={{ y: "110%", transition: { duration: 0.3 } }}
                      transition={{ duration: 0.9, ease: EASE, delay: 0.25 + i * 0.06 }}
                    >
                      <Link
                        href={item.href}
                        onClick={() => setMenu(false)}
                        className="flex items-baseline justify-between py-4 font-serif text-[2.1rem] leading-none"
                      >
                        {item.label}
                        <span className="label text-mocha">0{i + 1}</span>
                      </Link>
                    </motion.div>
                  </li>
                ))}
              </ul>
            </nav>
            <motion.p
              className="shell label pb-8 text-mocha"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.8 } }}
              exit={{ opacity: 0 }}
            >
              Handmade with love
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
