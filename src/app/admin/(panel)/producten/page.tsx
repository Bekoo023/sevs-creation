import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/format";
import { setProductStatus } from "../../actions";

export const metadata: Metadata = { title: "Producten" };

export default async function ProductsPage() {
  await requireAdmin();
  if (!db) return null;
  const products = await db.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  return (
    <>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display t-2">Producten</h1>
        <Link href="/admin/producten/nieuw" className="btn btn-primary">
          Product toevoegen
        </Link>
      </div>
      {products.length === 0 ? (
        <p className="mt-10 text-mocha">
          Nog geen producten. Voeg er een toe of laad de voorbeeldcatalogus met <code>npm run db:seed</code>.
        </p>
      ) : (
        <div className="mt-8 overflow-x-auto bg-ivory">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-espresso/15">
                {["Product", "Categorie", "Prijs", "Voorraad", "Status", ""].map((h) => (
                  <th key={h} scope="col" className="label px-4 py-3 text-mocha">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-espresso/10 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/producten/${p.id}`} className="underline underline-offset-4">
                      {p.name}
                    </Link>
                    {p.isExample && <span className="ml-2 text-xs text-mocha">(voorbeeld)</span>}
                    <span className="block text-mocha">{p.subtitle}</span>
                  </td>
                  <td className="px-4 py-3">{p.category.name}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(p.priceCents)}</td>
                  <td className="px-4 py-3">{p.stock ?? "Op bestelling"}</td>
                  <td className="px-4 py-3">{p.status === "ACTIVE" ? "Zichtbaar" : "Gearchiveerd"}</td>
                  <td className="px-4 py-3 text-right">
                    <form action={setProductStatus.bind(null, p.id, p.status === "ACTIVE" ? "ARCHIVED" : "ACTIVE")}>
                      <button type="submit" className="underline underline-offset-4">
                        {p.status === "ACTIVE" ? "Archiveren" : "Terugzetten"}
                      </button>
                    </form>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
