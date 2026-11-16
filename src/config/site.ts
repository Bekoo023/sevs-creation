export const siteConfig = {
  name: "Sevs Creations",
  tagline: "Met liefde gemaakt, voor altijd gekoesterd.",
  description:
    "Gepersonaliseerde geboortelijsten en handgemaakte satijnen boeketten. Elk stuk wordt met de hand gemaakt en op naam afgewerkt.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  locale: "nl_NL",

  contact: {
    email: "sevilim.6666@gmail.com" as string | null,
    phone: null as string | null,
    instagram: null as string | null,
  },

  company: {
    legalName: "Sevs-Creation" as string | null,
    kvk: "93312814" as string | null,
    btw: "NL005013407B27" as string | null,
    address: "Pakhuisstraat 1, 1118 DJ Schiphol" as string | null,
  },

  shipping: {
    costCents: 695,
    freeFromCents: 12000 as number | null,
    countries: ["NL", "BE"] as const,
    leadTime: "Elke bestelling wordt met de hand gemaakt. De levertijd is 7 dagen." as string | null,
  },
} as const;

export type SiteConfig = typeof siteConfig;
