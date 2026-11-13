import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Flourish } from "@/components/home/Flourish";
import { MaskReveal, RiseBlock, RiseText } from "@/components/motion/Reveal";

export const metadata: Metadata = {
  title: "Over Ons",
  description: "Sevs Creations maakt geboortelijsten en satijnen boeketten met de hand, stuk voor stuk.",
  alternates: { canonical: "/over-ons" },
};

export default function AboutPage() {
  return (
    <>
      <section className="shell pb-20 pt-36 lg:pb-32 lg:pt-52">
        <p className="label text-mocha">Over Sevs Creations</p>
        <h1 className="display t-hero mt-6 max-w-[13ch]">
          <RiseText lines={["Gemaakt met", "de hand, niet", "op de band."]} immediate />
        </h1>
      </section>

      <section className="shell grid gap-y-14 pb-24 lg:grid-cols-12 lg:pb-40">
        <MaskReveal className="relative aspect-[4/5] overflow-hidden lg:col-span-5">
          <Image
            src="/images/olifant-lila-zwart.jpg"
            alt="Geboortelijst met een lila olifant van papieren roosjes in een zwarte lijst"
            fill
            sizes="(min-width: 1024px) 40vw, 100vw"
            className="object-cover"
          />
        </MaskReveal>
        <div className="space-y-6 text-[1.0625rem] leading-relaxed text-mocha lg:col-span-5 lg:col-start-8 lg:pt-24">
          <RiseBlock>
            <p className="font-serif text-[1.9rem] leading-snug text-espresso">
              Een geboorte is een van de weinige momenten waarvan je elk detail wilt onthouden. De dag,
              het uur, hoe klein ze was.
            </p>
          </RiseBlock>
          <RiseBlock delay={0.1}>
            <p>
              Sevs Creations legt die gegevens vast in een lijst die jaren aan de muur blijft hangen.
              Elk figuurtje is opgebouwd uit papieren roosjes die met de hand zijn gerold. De naam en
              de geboortegegevens worden er per bestelling bij gezet.
            </p>
          </RiseBlock>
          <RiseBlock delay={0.15}>
            <p>
              Naast de geboortelijsten maken we boeketten van satijnen lint. Dezelfde werkwijze, een
              ander materiaal: bloemen die blijven zoals je ze kreeg.
            </p>
          </RiseBlock>
          <Flourish className="w-48 text-gold" />
          <div>
            <Link href="/shop" className="btn btn-primary mt-4">
              Bekijk de collectie
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
