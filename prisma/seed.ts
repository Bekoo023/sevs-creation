/**
 * Laadt de voorbeeldcatalogus in de database.
 * Bestaande producten met dezelfde slug worden niet overschreven.
 */
import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { catalog, categories } from "../src/content/catalog";
import { PrismaClient } from "../src/generated/prisma/client";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("DATABASE_URL ontbreekt.");
const db = new PrismaClient({ adapter: new PrismaPg({ connectionString: url }) });

async function main() {
  for (const c of categories) {
    await db.category.upsert({ where: { slug: c.slug }, update: {}, create: c });
  }
  for (const p of catalog) {
    const category = await db.category.findUniqueOrThrow({ where: { slug: p.category.slug } });
    await db.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        slug: p.slug,
        name: p.name,
        subtitle: p.subtitle,
        description: p.description,
        details: p.details,
        priceCents: p.priceCents,
        stock: p.stock,
        featured: p.featured,
        isExample: p.isExample,
        personalizable: p.personalizable,
        animal: p.animal,
        frames: p.frames,
        backgrounds: p.backgrounds,
        images: p.images,
        categoryId: category.id,
        createdAt: new Date(p.createdAt),
      },
    });
  }
  console.log(`Voorbeeldcatalogus geladen: ${catalog.length} producten.`);
}

main().finally(() => db.$disconnect());
