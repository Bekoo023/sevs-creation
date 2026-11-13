import type { Metadata } from "next";
import Link from "next/link";
import { ProductForm } from "@/components/admin/ProductForm";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveProduct } from "../../../actions";

export const metadata: Metadata = { title: "Product toevoegen" };

export default async function NewProductPage() {
  await requireAdmin();
  if (!db) return null;
  const categories = await db.category.findMany({ orderBy: { name: "asc" } });
  return (
    <>
      <Link href="/admin/producten" className="link-line label text-mocha">
        Alle producten
      </Link>
      <h1 className="display t-2 mt-4">Product toevoegen</h1>
      {categories.length === 0 ? (
        <p className="mt-6 text-mocha">
          Maak eerst een <Link href="/admin/categorieen" className="underline">categorie</Link> aan.
        </p>
      ) : (
        <ProductForm action={saveProduct.bind(null, null)} categories={categories} />
      )}
    </>
  );
}
