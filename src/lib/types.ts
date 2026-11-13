export type FrameId = "zwart" | "wit";
export type BackgroundId = "roze" | "blauw" | "beige" | "lila" | "salie" | "zwart";
export type AnimalId = "olifant" | "beer" | "konijn";
export type CategorySlug = "geboortecadeaus" | "satijnen-boeketten";

export type ProductImage = {
  src: string;
  alt: string;
  width: number;
  height: number;
  frame?: FrameId;
  background?: BackgroundId;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  category: { slug: string; name: string };
  priceCents: number;
  description: string;
  details: string[];
  images: ProductImage[];
  personalizable: boolean;
  animal: AnimalId | null;
  frames: FrameId[];
  backgrounds: BackgroundId[];
  stock: number | null;
  featured: boolean;
  isExample: boolean;
  createdAt: string;
};

export type Personalization = {
  naam: string;
  geboortedatum: string;
  geboortetijd: string;
  gewicht: string;
  lengte: string;
  opmerking?: string;
};

export type Review = { id: string; author: string; rating: number; body: string };
