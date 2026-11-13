import { siteConfig } from "@/config/site";

/**
 * CONCEPTTEKSTEN
 *
 * Deze teksten zijn een startpunt en geen juridisch advies. Laat ze controleren
 * en vul ze aan met de eigen afspraken van Sevs Creations voordat de shop live gaat.
 * Onderdelen die van `siteConfig` afhangen verschijnen pas als ze daar zijn ingevuld.
 */
export type LegalSection = { title: string; body: string[] };

const todo = "Deze informatie wordt nog aangevuld.";
const c = siteConfig.company;

export const legal: Record<"verzending" | "voorwaarden" | "privacy", { title: string; intro: string; sections: LegalSection[] }> = {
  verzending: {
    title: "Verzending & Retourneren",
    intro: "Elke bestelling wordt op naam gemaakt. Hieronder lees je wat dat betekent voor bezorgen en retourneren.",
    sections: [
      {
        title: "Verzending",
        body: [
          siteConfig.shipping.leadTime ?? todo,
          "We verzenden naar Nederland en België. De verzendkosten zie je in de winkelwagen voordat je betaalt.",
        ],
      },
      {
        title: "Gepersonaliseerde producten",
        body: [
          "Een geboortelijst wordt speciaal voor jou gemaakt, met de naam en geboortegegevens die je opgeeft. Voor producten die op maat zijn gemaakt geldt het wettelijke herroepingsrecht van 14 dagen niet.",
          "Controleer daarom de gegevens goed voordat je bestelt. Zie je na het bestellen een fout, neem dan zo snel mogelijk contact op.",
        ],
      },
      {
        title: "Niet-gepersonaliseerde producten",
        body: [
          "Voor producten die niet op maat zijn gemaakt heb je 14 dagen bedenktijd vanaf de dag van ontvangst.",
          todo,
        ],
      },
      {
        title: "Beschadigd ontvangen",
        body: ["Is je bestelling beschadigd aangekomen? Stuur ons een foto, dan zoeken we samen een oplossing."],
      },
    ],
  },
  voorwaarden: {
    title: "Algemene Voorwaarden",
    intro: "De voorwaarden die gelden voor elke bestelling bij Sevs Creations.",
    sections: [
      {
        title: "Bedrijfsgegevens",
        body: [
          [c.legalName, c.address, c.kvk && `KvK ${c.kvk}`, c.btw && `Btw ${c.btw}`].filter(Boolean).join(", ") || todo,
        ],
      },
      { title: "Bestellen en betalen", body: ["Alle prijzen zijn in euro en inclusief btw. Betalen gaat via Stripe.", todo] },
      { title: "Levering", body: [todo] },
      { title: "Klachten", body: [todo] },
    ],
  },
  privacy: {
    title: "Privacybeleid",
    intro: "Welke gegevens we van je vragen en waarvoor we ze gebruiken.",
    sections: [
      {
        title: "Welke gegevens",
        body: [
          "Voor een bestelling vragen we je naam, adres, e-mailadres en eventueel je telefoonnummer. Bij een geboortelijst komen daar de naam en geboortegegevens van het kindje bij.",
          "We gebruiken deze gegevens alleen om je bestelling te maken, te verzenden en om contact met je op te nemen over die bestelling.",
        ],
      },
      {
        title: "Betalingen",
        body: ["Betalingen worden verwerkt door Stripe. Wij zien en bewaren geen betaalgegevens zoals rekening- of kaartnummers."],
      },
      {
        title: "Op dit apparaat",
        body: ["Je winkelwagen en favorieten worden in je eigen browser bewaard. Deze site gebruikt geen trackingcookies."],
      },
      { title: "Bewaartermijn en jouw rechten", body: [todo] },
    ],
  },
};
