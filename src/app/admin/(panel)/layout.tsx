import Link from "next/link";
import { Suspense } from "react";
import { requireAdmin } from "@/lib/auth";
import { hasDatabase } from "@/lib/db";
import { logout } from "../actions";

/** Controleert de sessie voordat er iets van het beheer wordt getoond. */
async function Gate({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  if (!hasDatabase) {
    return (
      <div className="max-w-xl">
        <h1 className="display t-2">Nog geen database</h1>
        <p className="mt-4 text-mocha">
          De shop toont nu de voorbeeldcatalogus uit <code>src/content/catalog.ts</code>. Om producten en
          bestellingen te beheren stel je <code>DATABASE_URL</code> in, draai je{" "}
          <code>npx prisma migrate dev --name init</code> en daarna <code>npm run db:seed</code>.
        </p>
      </div>
    );
  }
  return <>{children}</>;
}

export default function PanelLayout({ children }: LayoutProps<"/admin">) {
  return (
    <>
      <header className="border-b border-espresso/15 bg-ivory">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <nav aria-label="Beheer" className="flex flex-wrap items-center gap-x-7 gap-y-2">
            <Link href="/admin" className="font-serif text-xl">
              Sevs <span className="text-mocha">Beheer</span>
            </Link>
            <Link href="/admin" className="link-line label">
              Bestellingen
            </Link>
            <Link href="/admin/producten" className="link-line label">
              Producten
            </Link>
            <Link href="/admin/categorieen" className="link-line label">
              Categorieën
            </Link>
          </nav>
          <div className="flex items-center gap-6">
            <Link href="/" className="link-line label text-mocha">
              Naar de shop
            </Link>
            <form action={logout}>
              <button type="submit" className="link-line label">
                Uitloggen
              </button>
            </form>
          </div>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-5 py-10">
        <Suspense fallback={<p className="label text-mocha">Laden</p>}>
          <Gate>{children}</Gate>
        </Suspense>
      </main>
    </>
  );
}
