"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { RiseText } from "@/components/motion/Reveal";
import { FramePreview } from "@/components/product/FramePreview";
import { BackgroundSwatches, FrameToggle } from "@/components/product/Swatches";
import { cx } from "@/lib/format";
import { BACKGROUNDS, FRAMES } from "@/lib/options";
import type { BackgroundId, FrameId, Product } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    title: "Kies jouw ontwerp",
    body: "Een olifant, beertje of konijntje. Daarna de lijst in zwart of wit en een van de vijf achtergrondkleuren.",
  },
  {
    title: "Voeg de geboortegegevens toe",
    body: "Naam, datum, tijd, gewicht en lengte. Je ziet meteen hoe de tekst op de lijst komt te staan.",
  },
  {
    title: "Wij maken jouw cadeau persoonlijk",
    body: "We rollen de roosjes, plaatsen ze één voor één en werken de lijst af met de gegevens van jouw kindje.",
  },
];

// Voorbeeldgegevens voor de demonstratie in stap twee.
const EXAMPLE = { naam: "Elara", datum: "12 maart 2026", tijd: "08:15", gewicht: "3,420 kg", lengte: "51" };

function Step({ index, active, onActive }: { index: number; active: boolean; onActive: (i: number) => void }) {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-45% 0px -45% 0px" });
  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);
  const step = STEPS[index];
  return (
    <li
      ref={ref}
      className={cx(
        "flex gap-6 border-t border-espresso/15 py-8 transition-opacity duration-700 lg:min-h-[62vh] lg:items-center lg:border-0 lg:py-0",
        active ? "opacity-100" : "lg:opacity-30",
      )}
    >
      <span className="font-serif text-[2.75rem] leading-none text-gold lg:text-[4.5rem]">0{index + 1}</span>
      <div className="lg:pt-2">
        <h3 className="display t-3">{step.title}</h3>
        <p className="mt-3 max-w-sm text-mocha">{step.body}</p>
      </div>
    </li>
  );
}

const DESKTOP = "(min-width: 1024px)";
function useDesktop() {
  return useSyncExternalStore(
    (notify) => {
      const mq = window.matchMedia(DESKTOP);
      mq.addEventListener("change", notify);
      return () => mq.removeEventListener("change", notify);
    },
    () => window.matchMedia(DESKTOP).matches,
    () => true,
  );
}

export function Personalize({ product }: { product: Product }) {
  const desktop = useDesktop();
  const [step, setStep] = useState(0);
  const [frame, setFrame] = useState<FrameId>("zwart");
  const [background, setBackground] = useState<BackgroundId>("roze");

  // Alleen een foto tonen als die precies bij de gekozen uitvoering hoort.
  const photo = product.images.find((i) => i.frame === frame && i.background === background);
  // Op mobiel staat de preview boven de stappen en toont ze meteen het ingevulde voorbeeld.
  const filled = !desktop || step >= 1;

  return (
    <section className="bg-[#f1e9df] py-24 lg:py-0">
      <div className="shell flex flex-col gap-x-12 lg:grid lg:grid-cols-12">
        <div className="max-lg:contents lg:col-span-5 lg:py-40">
          <div>
            <p className="label text-mocha">Personaliseren</p>
            <h2 className="display t-1 mt-6 max-w-[10ch]">
              <RiseText lines={["Een cadeau", "dat écht van", "jou is."]} />
            </h2>
          </div>
          <ol className="max-lg:order-3 lg:mt-10">
            {STEPS.map((_, i) => (
              <Step key={i} index={i} active={step === i} onActive={setStep} />
            ))}
          </ol>
        </div>

        <div className="max-lg:order-2 max-lg:my-12 lg:col-span-6 lg:col-start-7">
          <div className="lg:sticky lg:top-0 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:pb-10 lg:pt-28">
            <div className="relative mx-auto w-full max-w-[30rem] lg:max-w-[min(30rem,calc(100svh-24rem))]">
              <div className="relative aspect-square shadow-[0_50px_90px_-45px_rgba(52,43,41,0.55)]">
                <FramePreview
                  className="h-full w-full"
                  frame={frame}
                  background={background}
                  animal={product.animal ?? "olifant"}
                  naam={filled ? EXAMPLE.naam : undefined}
                  datum={filled ? EXAMPLE.datum : undefined}
                  tijd={filled ? EXAMPLE.tijd : undefined}
                  gewicht={filled ? EXAMPLE.gewicht : undefined}
                  lengte={filled ? EXAMPLE.lengte : undefined}
                />
                <AnimatePresence>
                  {step === 2 && photo && (
                    <motion.div
                      key={photo.src}
                      className="absolute inset-0 overflow-hidden max-lg:hidden"
                      initial={{ clipPath: "inset(0% 0% 100% 0%)" }}
                      animate={{ clipPath: "inset(0% 0% 0% 0%)" }}
                      exit={{ clipPath: "inset(100% 0% 0% 0%)" }}
                      transition={{ duration: 1.1, ease: EASE }}
                    >
                      <Image src={photo.src} alt={photo.alt} fill sizes="480px" className="object-cover" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <p className="label mt-4 text-mocha" aria-live="polite">
                {step === 2 && photo
                  ? "Atelierfoto in deze uitvoering"
                  : `Schets: ${FRAMES[frame].label.toLowerCase()} lijst, ${BACKGROUNDS[background].label.toLowerCase()}`}
              </p>

              <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
                <FrameToggle options={product.frames} value={frame} onChange={setFrame} />
                <BackgroundSwatches options={product.backgrounds} value={background} onChange={setBackground} />
              </div>
              <Link
                href={`/shop/${product.slug}?lijst=${frame}&kleur=${background}`}
                className="btn btn-primary mt-8"
              >
                Stel jouw lijst samen
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
