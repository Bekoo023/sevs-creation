import type { Product } from "@/lib/types";

/**
 * VOORBEELDCATALOGUS
 *
 * Demonstratieproducten met fictieve namen en geboortegegevens op de foto's.
 * Prijzen zijn voorbeeldwaarden. Deze lijst is de bron voor `npm run db:seed`
 * en wordt direct getoond zolang er geen DATABASE_URL is ingesteld.
 * Elk product heeft `isExample: true`, zodat het in de admin herkenbaar is.
 */
const img = (
  file: string,
  alt: string,
  width: number,
  height: number,
  extra: Partial<Product["images"][number]> = {},
) => ({ src: `/images/${file}.jpg`, alt, width, height, ...extra });

const geboorte = { slug: "geboortecadeaus", name: "Geboortecadeaus" };
const boeketten = { slug: "satijnen-boeketten", name: "Satijnen Boeketten" };

export const categories = [
  {
    ...geboorte,
    description: "Persoonlijke geboortelijsten die de eerste bijzondere momenten vastleggen.",
  },
  {
    ...boeketten,
    description: "Handgemaakte bloemen die hun schoonheid blijven behouden.",
  },
];

export const catalog: Product[] = [
  {
    id: "ex-olifant",
    slug: "little-memories-geboortelijst-olifant",
    name: "Little Memories",
    subtitle: "Gepersonaliseerde geboortelijst, olifant",
    category: geboorte,
    priceCents: 5495,
    description:
      "Een olifantje van handgerolde papieren roosjes in een diepe lijst. Met de naam, geboortedatum, tijd, het gewicht en de lengte van jouw kindje.",
    details: [
      "Diepe fotolijst (shadow box)",
      "Roosjes met de hand gerold en geplaatst",
      "Lijst in zwart of wit",
      "Achtergrond in vijf pastelkleuren",
    ],
    images: [
      img("olifant-roze-zwart", "Geboortelijst met roze olifant in zwarte lijst, voorbeeldnaam Elara", 1254, 1254, { frame: "zwart", background: "roze" }),
      img("olifant-roze-wit", "Geboortelijst met roze olifant in witte lijst, voorbeeldnaam Sofia", 1122, 1402, { frame: "wit", background: "roze" }),
      img("olifant-blauw-zwart", "Geboortelijst met blauwe olifant in zwarte lijst, voorbeeldnaam Kerem", 1254, 1254, { frame: "zwart", background: "blauw" }),
      img("olifant-blauw-wit", "Geboortelijst met blauwe olifant in witte lijst, voorbeeldnaam Liam", 1122, 1402, { frame: "wit", background: "blauw" }),
      img("olifant-lila-zwart", "Geboortelijst met lila olifant in zwarte lijst, voorbeeldnaam Mira", 1254, 1254, { frame: "zwart", background: "lila" }),
      img("olifant-salie-zwart", "Geboortelijst met saliegroene olifant in zwarte lijst, voorbeeldnaam Yusuf", 1312, 1199, { frame: "zwart", background: "salie" }),
    ],
    personalizable: true,
    animal: "olifant",
    frames: ["zwart", "wit"],
    backgrounds: ["roze", "blauw", "beige", "lila", "salie"],
    stock: null,
    featured: true,
    isExample: true,
    createdAt: "2026-10-01T09:00:00.000Z",
  },
  {
    id: "ex-beer",
    slug: "geboortelijst-beertje",
    name: "Petit Ours",
    subtitle: "Gepersonaliseerde geboortelijst, beertje",
    category: geboorte,
    priceCents: 5495,
    description:
      "Een beertje met strikje, opgebouwd uit roosjes in zachte tinten. Rustig van kleur en passend in elke babykamer.",
    details: [
      "Diepe fotolijst (shadow box)",
      "Roosjes met de hand gerold en geplaatst",
      "Lijst in zwart of wit",
      "Achtergrond in vijf pastelkleuren",
    ],
    images: [
      img("beer-beige-wit", "Geboortelijst met beertje op beige achtergrond in witte lijst, voorbeeldnaam Mila", 1122, 1402, { frame: "wit", background: "beige" }),
      img("trio-avond", "Drie geboortelijsten naast elkaar: blauw beertje, roze olifant en lila zwaan", 1536, 1024),
    ],
    personalizable: true,
    animal: "beer",
    frames: ["wit", "zwart"],
    backgrounds: ["beige", "roze", "blauw", "lila", "salie"],
    stock: null,
    featured: false,
    isExample: true,
    createdAt: "2026-10-12T09:00:00.000Z",
  },
  {
    id: "ex-konijn",
    slug: "geboortelijst-konijntje",
    name: "Petit Lapin",
    subtitle: "Gepersonaliseerde geboortelijst, konijntje",
    category: geboorte,
    priceCents: 5495,
    description:
      "Een konijntje in profiel, gevuld met roosjes in roze en crème. Fijn en licht van vorm.",
    details: [
      "Diepe fotolijst (shadow box)",
      "Roosjes met de hand gerold en geplaatst",
      "Lijst in zwart of wit",
      "Achtergrond in vijf pastelkleuren",
    ],
    images: [
      img("konijn-roze-wit", "Geboortelijst met konijntje op roze achtergrond in witte lijst, voorbeeldnaam Noor", 1122, 1402, { frame: "wit", background: "roze" }),
      img("trio-daglicht", "Drie geboortelijsten: roze konijntje, beige hertje en blauw beertje", 1536, 1024),
    ],
    personalizable: true,
    animal: "konijn",
    frames: ["wit", "zwart"],
    backgrounds: ["roze", "blauw", "beige", "lila", "salie"],
    stock: null,
    featured: true,
    isExample: true,
    createdAt: "2026-10-20T09:00:00.000Z",
  },
  {
    id: "ex-black",
    slug: "geboortelijst-black-edition",
    name: "Black Edition",
    subtitle: "Gepersonaliseerde geboortelijst, zwarte achtergrond",
    category: geboorte,
    priceCents: 5995,
    description:
      "Dezelfde olifant, op een diepzwarte achtergrond. De roosjes in oudroze en zand komen daardoor sterker naar voren.",
    details: [
      "Diepe fotolijst (shadow box)",
      "Roosjes met de hand gerold en geplaatst",
      "Zwarte achtergrond",
      "Lijst in wit of zwart",
    ],
    images: [
      img("olifant-black-edition-wit", "Geboortelijst met olifant op zwarte achtergrond in witte lijst, voorbeeldnaam Yara", 1254, 1254, { frame: "wit", background: "zwart" }),
    ],
    personalizable: true,
    animal: "olifant",
    frames: ["wit", "zwart"],
    backgrounds: ["zwart"],
    stock: null,
    featured: true,
    isExample: true,
    createdAt: "2026-11-01T09:00:00.000Z",
  },
  {
    id: "ex-rozenboeket",
    slug: "satijnen-rozenboeket",
    name: "Satijnen Rozenboeket",
    subtitle: "Handgemaakt boeket van satijnen lint",
    category: boeketten,
    priceCents: 4495,
    description:
      "Rozen van satijnen lint, één voor één gevouwen en tot een boeket gebonden. Ze verwelken niet en hebben geen water nodig.",
    details: ["Rozen van satijnen lint", "Met de hand gevouwen en gebonden"],
    images: [],
    personalizable: false,
    animal: null,
    frames: [],
    backgrounds: [],
    stock: null,
    featured: true,
    isExample: true,
    createdAt: "2026-11-05T09:00:00.000Z",
  },
  {
    id: "ex-blush",
    slug: "satijnen-bloemenboeket-blush-collection",
    name: "Blush Collection",
    subtitle: "Satijnen bloemenboeket in blush",
    category: boeketten,
    priceCents: 4995,
    description:
      "Een boeket in blush en crème, gemaakt van satijnen lint. Bedoeld om te bewaren.",
    details: ["Bloemen van satijnen lint", "Met de hand gevouwen en gebonden"],
    images: [],
    personalizable: false,
    animal: null,
    frames: [],
    backgrounds: [],
    stock: null,
    featured: false,
    isExample: true,
    createdAt: "2026-11-08T09:00:00.000Z",
  },
];

/** Sfeerbeelden voor de galerij op de homepage. Alleen eigen foto's. */
export const galleryImages = [
  img("olifant-lila-zwart", "Lila olifant in zwarte lijst", 1254, 1254),
  img("konijn-roze-wit", "Roze konijntje in witte lijst", 1122, 1402),
  img("trio-avond", "Drie geboortelijsten bij kaarslicht", 1536, 1024),
  img("olifant-geel-zwart", "Gele olifant in zwarte lijst met strik", 1254, 1254),
  img("olifant-blauw-wit", "Blauwe olifant met maan in witte lijst", 1122, 1402),
  img("olifant-perzik-zwart", "Perzikkleurige olifant in zwarte lijst", 1254, 1254),
  img("olifant-salie-zwart", "Saliegroene olifant in zwarte lijst", 1312, 1199),
  img("beer-beige-wit", "Beertje in beige tinten in witte lijst", 1122, 1402),
];
