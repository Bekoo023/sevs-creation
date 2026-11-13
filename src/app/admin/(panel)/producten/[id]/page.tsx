import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { ConfirmButton } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteProduct, saveProduct } from "../../../actions";

export const metadata: Metadata = { title: "Product bewerken" };

export default async function EditProductPage({ params }: PageProps<"/admin/producten/[id]">) {
  await requireAdmin();
  if (!db) return null;
  const { id } = await params;
  const [product, categories] = await Promise.all([
    db.product.findUnique({ where: { id } }),
    db.category.findMany({ orderBy: { name: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <>
      <Link href="/admin/producten" className="link-line label text-mocha">
        Alle producten
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <h1 className="display t-2">{product.name}</h1>
        <ConfirmButton
          action={deleteProduct.bind(null, product.id)}
          message={`${product.name} definitief verwijderen? Archiveren kan ook; dan blijft het product bewaard.`}
        >
          Definitief verwijderen
        </ConfirmButton>
      </div>
      <ProductForm action={saveProduct.bind(null, product.id)} product={product} categories={categories} />
    </>
  );
}
