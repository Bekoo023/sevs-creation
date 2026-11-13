import type { Metadata } from "next";
import { ActionForm, ConfirmButton, Submit } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { deleteCategory, saveCategory } from "../../actions";

export const metadata: Metadata = { title: "Categorieën" };

export default async function CategoriesPage() {
  await requireAdmin();
  if (!db) return null;
  const categories = await db.category.findMany({
    orderBy: { createdAt: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <>
      <h1 className="display t-2">Categorieën</h1>
      <ul className="mt-8 max-w-3xl space-y-4">
        {categories.map((c) => (
          <li key={c.id} className="bg-ivory p-6">
            <ActionForm action={saveCategory} className="grid gap-5 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
              <input type="hidden" name="id" value={c.id} />
              <div>
                <label htmlFor={`name-${c.id}`} className="field-label">Naam</label>
                <input id={`name-${c.id}`} name="name" defaultValue={c.name} required className="field" />
              </div>
              <div>
                <label htmlFor={`desc-${c.id}`} className="field-label">Omschrijving</label>
                <input id={`desc-${c.id}`} name="description" defaultValue={c.description} className="field" />
              </div>
              <Submit className="btn btn-outline">Opslaan</Submit>
            </ActionForm>
            <div className="mt-4 flex items-center justify-between text-sm text-mocha">
              <span>
                /{c.slug}, {c._count.products} {c._count.products === 1 ? "product" : "producten"}
              </span>
              <ConfirmButton
                action={deleteCategory.bind(null, c.id)}
                message={`Categorie ${c.name} verwijderen?`}
                disabled={c._count.products > 0}
              >
                Verwijderen
              </ConfirmButton>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="label mt-12 text-mocha">Nieuwe categorie</h2>
      <ActionForm action={saveCategory} resetOnOk className="mt-4 grid max-w-3xl gap-5 bg-ivory p-6 sm:grid-cols-[1fr_2fr_auto] sm:items-end">
        <div>
          <label htmlFor="new-name" className="field-label">Naam</label>
          <input id="new-name" name="name" required className="field" />
        </div>
        <div>
          <label htmlFor="new-desc" className="field-label">Omschrijving</label>
          <input id="new-desc" name="description" className="field" />
        </div>
        <Submit>Toevoegen</Submit>
      </ActionForm>
    </>
  );
}
