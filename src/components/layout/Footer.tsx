import Link from "next/link";
import { siteConfig } from "@/config/site";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Alle creaties" },
      { href: "/shop?categorie=geboortecadeaus", label: "Geboortecadeaus" },
      { href: "/shop?categorie=satijnen-boeketten", label: "Satijnen Boeketten" },
    ],
  },
  {
    title: "Klantenservice",
    links: [
      { href: "/contact", label: "Contact" },
      { href: "/verzending-retourneren", label: "Verzending & Retourneren" },
      { href: "/over-ons", label: "Over Ons" },
    ],
  },
  {
    title: "Juridisch",
    links: [
      { href: "/algemene-voorwaarden", label: "Algemene Voorwaarden" },
      { href: "/privacybeleid", label: "Privacybeleid" },
    ],
  },
];

export function Footer() {
  const { instagram, email } = siteConfig.contact;
  return (
    <footer className="bg-espresso text-ivory">
      <div className="shell pt-20 lg:pt-28">
        <div className="grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="display t-2 max-w-[14ch]">Met liefde gemaakt, voor altijd gekoesterd.</p>
            <div className="mt-8 flex flex-wrap gap-x-8 gap-y-2 text-sm text-ivory/75">
              {email && (
                <a className="link-line" href={`mailto:${email}`}>
                  {email}
                </a>
              )}
              {instagram && (
                <a className="link-line" href={instagram} target="_blank" rel="noreferrer">
                  Instagram
                </a>
              )}
            </div>
          </div>
          <nav aria-label="Footer" className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
            {groups.map((g) => (
              <div key={g.title}>
                <h2 className="label text-ivory/55">{g.title}</h2>
                <ul className="mt-5 space-y-1.5 text-sm">
                  {g.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="link-line text-ivory/90">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>
      </div>

      <div className="mt-20 overflow-hidden lg:mt-28" aria-hidden>
        <p className="select-none whitespace-nowrap text-center font-serif text-[10.4vw] leading-[0.8] tracking-[-0.02em] text-ivory/[0.94]">
          SEVS CREATIONS
        </p>
      </div>

      <div className="border-t border-ivory/10">
        <div className="shell flex flex-col gap-2 py-6 text-xs text-ivory/55 sm:flex-row sm:justify-between">
          <p>
            © {siteConfig.company.legalName ?? siteConfig.name}
          </p>
          <p>Handmade with love</p>
        </div>
      </div>
    </footer>
  );
}
