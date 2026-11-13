/**
 * Centrale webshopconfiguratie.
 *
 * Alles wat hier `null` is, moet door Sevs Creations zelf worden ingevuld.
 * De site toont dan niets of een neutrale melding; er worden geen gegevens verzonnen.
 */
export const siteConfig = {
  name: "Sevs Creations",
  tagline: "Met liefde gemaakt, voor altijd gekoesterd.",
  description:
    "Gepersonaliseerde geboortelijsten en handgemaakte satijnen boeketten. Elk stuk wordt met de hand gemaakt en op naam afgewerkt.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "nl_NL",

  contact: {
    email: null as string | null,
    phone: null as string | null,
    instagram: null as string | null, // volledige URL, bv. https://instagram.com/...
  },

  company: {
    legalName: null as string | null,
    kvk: null as string | null,
    btw: null as string | null,
    address: null as string | null,
  },

  shipping: {
    // VOORBEELDWAARDE. Pas aan naar het echte tarief.
    costCents: 695,
    // Bedrag waarboven verzending gratis is, of null als dat niet geldt.
    freeFromCents: null as number | null,
    countries: ["NL", "BE"] as const,
    // Levertijd wordt alleen getoond als deze is ingevuld.
    leadTime: null as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
