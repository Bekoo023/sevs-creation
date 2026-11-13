import type { Metadata } from "next";
import { RiseText } from "@/components/motion/Reveal";
import { siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Een vraag over een bestelling of een bijzondere wens? Neem contact op met Sevs Creations.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  const { email, phone, instagram } = siteConfig.contact;
  const rows = [
    email && { label: "E-mail", value: email, href: `mailto:${email}` },
    phone && { label: "Telefoon", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    instagram && { label: "Instagram", value: "Stuur een bericht", href: instagram },
  ].filter(Boolean) as { label: string; value: string; href: string }[];

  return (
    <section className="shell min-h-[80vh] pb-28 pt-36 lg:pt-52">
      <p className="label text-mocha">Contact</p>
      <h1 className="display t-hero mt-6 max-w-[12ch]">
        <RiseText lines={["Een vraag of", "een bijzondere", "wens?"]} immediate />
      </h1>
      <p className="mt-8 max-w-md text-[1.0625rem] text-mocha">
        Twijfel je over een kleur, of wil je iets dat niet in de shop staat? Laat het weten. We denken
        graag mee.
      </p>

      {rows.length > 0 ? (
        <dl className="mt-14 max-w-2xl">
          {rows.map((r) => (
            <div key={r.label} className="flex items-baseline justify-between gap-6 border-t border-espresso/15 py-6 last:border-b">
              <dt className="label text-mocha">{r.label}</dt>
              <dd>
                <a href={r.href} className="link-line font-serif text-[clamp(1.4rem,3vw,2rem)] leading-tight">
                  {r.value}
                </a>
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <p className="mt-14 max-w-md border-t border-espresso/15 pt-6 text-mocha">
          De contactgegevens worden binnenkort aangevuld.
        </p>
      )}
    </section>
  );
}
