import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { DrawLine, MaskReveal, RiseBlock, RiseText } from "@/components/motion/Reveal";
import { galleryImages } from "@/content/catalog";
import type { Review } from "@/lib/types";
import { Flourish } from "./Flourish";

export function Intro() {
  return (
    <section id="introductie" className="shell scroll-mt-24 py-24 lg:py-44">
      <div className="grid gap-y-14 lg:grid-cols-12">
        <div className="lg:col-span-6 lg:col-start-1 lg:pt-10">
          <RiseBlock>
            <p className="label text-mocha">The beauty of handmade</p>
          </RiseBlock>
          <h2 className="display t-1 mt-6 max-w-[11ch]">
            <RiseText lines={["Elk detail", "vertelt een", "verhaal."]} />
          </h2>
          <div className="mt-10 max-w-[27rem] space-y-5 text-[1.0625rem] leading-relaxed text-mocha lg:ml-[16.66%]">
            <RiseBlock delay={0.1}>
              <p>
                Een geboortelijst begint met een naam en een stapel papier. Elk roosje wordt met de
                hand gerold en één voor één geplaatst, tot er een olifantje, beertje of konijntje
                ontstaat dat bij één kindje hoort.
              </p>
            </RiseBlock>
            <RiseBlock delay={0.2}>
              <p>Geen twee lijsten zijn gelijk. Dat is precies de bedoeling.</p>
            </RiseBlock>
            <Flourish className="w-48 text-gold" />
          </div>
        </div>

        <div className="relative lg:col-span-5 lg:col-start-8">
          <MaskReveal className="relative ml-auto aspect-[4/5] w-[82%] overflow-hidden lg:w-full">
            <Image
              src="/images/konijn-roze-wit.jpg"
              alt="Geboortelijst met een konijntje van roze en crème papieren roosjes in een witte lijst"
              fill
              sizes="(min-width: 1024px) 38vw, 82vw"
              className="object-cover"
            />
          </MaskReveal>
          <MaskReveal
            delay={0.25}
            from="left"
            className="absolute -bottom-10 left-0 aspect-square w-[44%] overflow-hidden shadow-[0_30px_60px_-30px_rgba(52,43,41,0.45)] lg:-left-[26%] lg:w-[48%]"
          >
            <Image
              src="/images/olifant-salie-zwart.jpg"
              alt="Geboortelijst met een saliegroene olifant in een zwarte lijst"
              fill
              sizes="(min-width: 1024px) 18vw, 40vw"
              className="object-cover"
            />
          </MaskReveal>
          <p className="vertical label absolute -right-1 top-0 translate-x-full pl-3 text-mocha max-lg:hidden" aria-hidden>
            Papieren roosjes, met de hand gerold
          </p>
        </div>
      </div>
    </section>
  );
}

export function Categories() {
  return (
    <section className="bg-champagne/45 py-24 lg:py-36">
      <div className="shell">
        <div className="flex items-end justify-between gap-6">
          <h2 className="display t-2">
            <RiseText lines={["Twee collecties,", "één handschrift."]} />
          </h2>
          <Link href="/shop" className="link-line is-drawn label hidden sm:inline-flex">
            Alles bekijken
          </Link>
        </div>

        <div className="mt-14 grid gap-x-8 gap-y-16 lg:grid-cols-12">
          <Link href="/shop?categorie=geboortecadeaus" className="group block lg:col-span-7">
            <MaskReveal className="relative aspect-[4/5] overflow-hidden sm:aspect-[5/5] lg:aspect-[7/8]">
              <div className="absolute inset-0 transition-transform duration-[1600ms] ease-luxe group-hover:translate-y-[-1.5%] group-hover:scale-[1.04]">
                <Image
                  src="/images/olifant-roze-wit.jpg"
                  alt="Geboortelijst met een roze olifant van papieren roosjes in een witte lijst"
                  fill
                  sizes="(min-width: 1024px) 56vw, 100vw"
                  className="object-cover"
                />
              </div>
            </MaskReveal>
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <p className="label text-mocha">01</p>
                <h3 className="display t-2 mt-2">
                  <span className="link-line group-draw">Geboortecadeaus</span>
                </h3>
                <p className="mt-3 max-w-sm text-mocha">
                  Persoonlijke geboortelijsten die de eerste bijzondere momenten vastleggen.
                </p>
              </div>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1}
                className="mt-6 size-9 shrink-0 transition-transform duration-700 ease-luxe group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </Link>

          <Link href="/shop?categorie=satijnen-boeketten" className="group block lg:col-span-4 lg:col-start-9 lg:mt-48">
            <MaskReveal delay={0.15} className="relative aspect-[4/5] overflow-hidden bg-blush">
              {/* Nog geen eigen fotografie van de boeketten: daarom een getekend lint in plaats van een stockfoto. */}
              <svg
                viewBox="0 0 400 500"
                className="absolute inset-0 h-full w-full transition-transform duration-[1600ms] ease-luxe group-hover:scale-[1.05]"
                fill="none"
                aria-hidden
              >
                <path
                  d="M-20 380 C 80 300 60 180 170 190 C 280 200 220 330 150 300 C 90 274 150 150 260 120 C 330 100 380 60 430 20"
                  stroke="#c79f9c"
                  strokeWidth="46"
                  strokeLinecap="round"
                  opacity="0.55"
                />
                <path
                  d="M-20 380 C 80 300 60 180 170 190 C 280 200 220 330 150 300 C 90 274 150 150 260 120 C 330 100 380 60 430 20"
                  stroke="#faf7f2"
                  strokeWidth="1"
                  opacity="0.8"
                />
              </svg>
              <p className="absolute bottom-6 left-6 font-serif text-[clamp(3rem,7vw,5.5rem)] leading-none text-espresso/90">
                Satijn
              </p>
            </MaskReveal>
            <div className="mt-6 flex items-start justify-between gap-6">
              <div>
                <p className="label text-mocha">02</p>
                <h3 className="display t-2 mt-2">
                  <span className="link-line group-draw">Satijnen Boeketten</span>
                </h3>
                <p className="mt-3 max-w-sm text-mocha">
                  Handgemaakte bloemen die hun schoonheid blijven behouden.
                </p>
              </div>
              <ArrowUpRight
                aria-hidden
                strokeWidth={1}
                className="mt-6 size-9 shrink-0 transition-transform duration-700 ease-luxe group-hover:-translate-y-1 group-hover:translate-x-1"
              />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
}

export function Story() {
  return (
    <section className="py-24 lg:py-40">
      <div className="shell grid items-center gap-y-12 lg:grid-cols-12">
        <MaskReveal from="left" className="relative aspect-[3/2] overflow-hidden lg:col-span-7 lg:-ml-[clamp(1.25rem,4vw,4rem)]">
          <Image
            src="/images/trio-avond.jpg"
            alt="Drie geboortelijsten op een marmeren blad bij kaarslicht: een blauw beertje, een roze olifant en een lila zwaan"
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover"
          />
        </MaskReveal>
        <div className="lg:col-span-4 lg:col-start-9">
          <h2 className="display t-2">
            <RiseText lines={["Handgemaakt", "met aandacht.", "Gegeven", "met liefde."]} />
          </h2>
          <DrawLine className="mt-8 w-16 text-gold" />
          <div className="mt-8 space-y-4 text-mocha">
            <RiseBlock>
              <p>
                In elke lijst zitten uren knippen, rollen en lijmen. Dat tempo is een keuze. Zo blijft
                er tijd om elk detail goed te doen, van de tint van het lint tot de plek van de naam.
              </p>
            </RiseBlock>
            <RiseBlock delay={0.1}>
              <p>Je bestelt bij een klein atelier. Dat merk je aan het resultaat.</p>
            </RiseBlock>
          </div>
          <Link href="/over-ons" className="link-line is-drawn label mt-9">
            Over Sevs Creations
          </Link>
        </div>
      </div>
    </section>
  );
}

/** Toont alleen echte, goedgekeurde reviews. Zonder reviews bestaat deze sectie niet. */
export function Reviews({ reviews }: { reviews: Review[] }) {
  if (reviews.length === 0) return null;
  return (
    <section className="bg-champagne/45 py-24 lg:py-36">
      <div className="shell">
        <h2 className="display t-2">Wat klanten schrijven</h2>
        <ul className="mt-14 grid gap-x-12 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((r) => (
            <li key={r.id} className="border-t border-espresso/20 pt-6">
              <p className="label text-mocha" aria-label={`${r.rating} van 5 sterren`}>
                {r.rating} / 5
              </p>
              <blockquote className="mt-4 font-serif text-[1.6rem] leading-snug">{r.body}</blockquote>
              <p className="mt-5 text-sm text-mocha">{r.author}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Gallery() {
  return (
    <section className="py-24 lg:py-36">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <h2 className="display t-2">
            <RiseText lines={["Uit het atelier"]} />
          </h2>
          <p className="max-w-xs text-mocha">Een greep uit eerder gemaakte lijsten. Namen en gegevens zijn voorbeelden.</p>
        </div>
        <ul className="mt-14 columns-2 gap-4 md:columns-3 lg:columns-4 lg:gap-6">
          {galleryImages.map((image, i) => (
            <li key={image.src} className="mb-4 break-inside-avoid lg:mb-6">
              <MaskReveal delay={(i % 4) * 0.08} className="overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.alt}
                  width={image.width}
                  height={image.height}
                  sizes="(min-width: 1024px) 23vw, (min-width: 768px) 31vw, 48vw"
                  className="h-auto w-full"
                />
              </MaskReveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
