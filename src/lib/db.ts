import "server-only";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client";

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function create() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({ adapter });
}

/** `null` zolang DATABASE_URL ontbreekt. De shop valt dan terug op de voorbeeldcatalogus. */
export const db: PrismaClient | null = globalForPrisma.prisma ?? create();

if (process.env.NODE_ENV !== "production" && db) globalForPrisma.prisma = db;

export const hasDatabase = db !== null;
