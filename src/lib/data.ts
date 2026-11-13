import "server-only";
import { cacheLife, cacheTag } from "next/cache";
import { catalog, categories as catalogCategories } from "@/content/catalog";
import { db } from "./db";
import type { AnimalId, BackgroundId, FrameId, Product, ProductImage, Review } from "./types";

type Row = {
  id: string;
  slug: string;
  name: string;
  subtitle: string;
  description: string;
  details: string[];
  priceCents: number;
  stock: number | null;
  featured: boolean;
  isExample: boolean;
  personalizable: boolean;
  animal: string | null;
  frames: string[];
  backgrounds: string[];
  images: unknown;
  createdAt: Date;
  category: { slug: string; name: string };
};

export function toProduct(row: Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    subtitle: row.subtitle,
    category: { slug: row.category.slug, name: row.category.name },
    priceCents: row.priceCents,
    description: row.description,
    details: row.details,
    images: Array.isArray(row.images) ? (row.images as ProductImage[]) : [],
    personalizable: row.personalizable,
    animal: (row.animal as AnimalId | null) ?? null,
    frames: row.frames as FrameId[],
    backgrounds: row.backgrounds as BackgroundId[],
    stock: row.stock,
    featured: row.featured,
    isExample: row.isExample,
    createdAt: row.createdAt.toISOString(),
  };
}

export async function getProducts(): Promise<Product[]> {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  if (!db) return catalog;
  const rows = await db.product.findMany({
    where: { status: "ACTIVE" },
    include: { category: true },
    orderBy: { createdAt: "asc" },
  });
  return rows.map(toProduct);
}

export async function getProduct(slug: string): Promise<Product | null> {
  const all = await getProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getCategories() {
  "use cache";
  cacheTag("products");
  cacheLife("hours");
  if (!db) return catalogCategories;
  const rows = await db.category.findMany({ orderBy: { createdAt: "asc" } });
  return rows.map((c) => ({ slug: c.slug, name: c.name, description: c.description }));
}

/** Alleen goedgekeurde, echte reviews. Zonder database is dit altijd leeg. */
export async function getReviews(): Promise<Review[]> {
  "use cache";
  cacheTag("reviews");
  cacheLife("hours");
  if (!db) return [];
  const rows = await db.review.findMany({
    where: { approved: true },
    orderBy: { createdAt: "desc" },
    take: 6,
  });
  return rows.map((r) => ({ id: r.id, author: r.author, rating: r.rating, body: r.body }));
}
