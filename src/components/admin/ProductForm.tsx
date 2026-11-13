import type { FormState } from "@/app/admin/actions";
import { ANIMALS, BACKGROUNDS, FRAMES } from "@/lib/options";
import type { ProductImage } from "@/lib/types";
import { ActionForm, Submit } from "./ui";

type Values = {
  name: string;
  slug: string;
  subtitle: string;
  description: string;
  details: string[];
  priceCents: number;
  stock: number | null;
  status: string;
  categoryId: string;
  featured: boolean;
  isExample: boolean;
  personalizable: boolean;
  animal: string | null;
  frames: string[];
  backgrounds: string[];
  images: unknown;
};

export function ProductForm({
  action,
  product,
  categories,
}: {
  action: (state: FormState, form: FormData) => Promise<FormState>;
  product?: Values;
  categories: { id: string; name: string }[];
}) {
  const images = (Array.isArray(product?.images) ? (product!.images as ProductImage[]) : [])
    .map((i) => [i.src, i.alt, i.frame ?? "", i.background ?? ""].join(" | "))
    .join("\n");
  const label = "field-label";

  return (
    <ActionForm action={action} className="mt-8 grid max-w-4xl gap-x-8 gap-y-7 bg-ivory p-6 sm:grid-cols-2 sm:p-9">
      <div>
        <label htmlFor="name" className={label}>Naam</label>
        <input id="name" name="name" defaultValue={product?.name} required className="field" />
      </div>
      <div>
        <label htmlFor="slug" className={label}>Slug (leeg = automatisch)</label>
        <input id="slug" name="slug" defaultValue={product?.slug} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="subtitle" className={label}>Ondertitel</label>
        <input id="subtitle" name="subtitle" defaultValue={product?.subtitle} className="field" />
      </div>
      <div>
        <label htmlFor="categoryId" className={label}>Categorie</label>
        <select id="categoryId" name="categoryId" defaultValue={product?.categoryId} required className="field">
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="status" className={label}>Status</label>
        <select id="status" name="status" defaultValue={product?.status ?? "ACTIVE"} className="field">
          <option value="ACTIVE">Zichtbaar in de shop</option>
          <option value="ARCHIVED">Gearchiveerd</option>
        </select>
      </div>
      <div>
        <label htmlFor="price" className={label}>Prijs in euro, incl. btw</label>
        <input id="price" name="price" inputMode="decimal" required defaultValue={product ? (product.priceCents / 100).toFixed(2).replace(".", ",") : ""} className="field" />
      </div>
      <div>
        <label htmlFor="stock" className={label}>Voorraad (leeg = op bestelling)</label>
        <input id="stock" name="stock" inputMode="numeric" defaultValue={product?.stock ?? ""} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="description" className={label}>Beschrijving</label>
        <textarea id="description" name="description" rows={3} defaultValue={product?.description} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="details" className={label}>Kenmerken, één per regel</label>
        <textarea id="details" name="details" rows={4} defaultValue={product?.details.join("\n")} className="field" />
      </div>
      <div className="sm:col-span-2">
        <label htmlFor="images" className={label}>Foto&apos;s, één per regel: pad | alt-tekst | lijst | achtergrond</label>
        <textarea id="images" name="images" rows={5} defaultValue={images} placeholder="/images/olifant-roze-zwart.jpg | Roze olifant in zwarte lijst | zwart | roze" className="field font-mono !text-sm" />
        <p className="mt-2 text-sm text-mocha">
          Zet bestanden in <code>public/images</code>. Lijst en achtergrond zijn optioneel; daarmee wisselt de foto mee
          met de keuze van de klant. De eerste foto is de hoofdfoto.
        </p>
      </div>

      <fieldset className="sm:col-span-2 border-t border-espresso/15 pt-6">
        <legend className={label}>Personalisatie</legend>
        <label className="mt-3 flex min-h-11 items-center gap-3">
          <input type="checkbox" name="personalizable" defaultChecked={product?.personalizable} className="size-4 accent-espresso" />
          Klant vult geboortegegevens in en kiest lijst en achtergrond
        </label>
        <div className="mt-4 grid gap-6 sm:grid-cols-3">
          <div>
            <label htmlFor="animal" className={label}>Figuur in de preview</label>
            <select id="animal" name="animal" defaultValue={product?.animal ?? ""} className="field">
              <option value="">Geen</option>
              {Object.entries(ANIMALS).map(([v, l]) => (
                <option key={v} value={v}>{l}</option>
              ))}
            </select>
          </div>
          <div>
            <p className={label}>Lijsten</p>
            {Object.entries(FRAMES).map(([v, f]) => (
              <label key={v} className="flex min-h-9 items-center gap-3">
                <input type="checkbox" name="frames" value={v} defaultChecked={product?.frames.includes(v)} className="size-4 accent-espresso" />
                {f.label}
              </label>
            ))}
          </div>
          <div>
            <p className={label}>Achtergronden</p>
            {Object.entries(BACKGROUNDS).map(([v, b]) => (
              <label key={v} className="flex min-h-9 items-center gap-3">
                <input type="checkbox" name="backgrounds" value={v} defaultChecked={product?.backgrounds.includes(v)} className="size-4 accent-espresso" />
                <span className="size-4 rounded-full border border-espresso/20" style={{ background: b.color }} />
                {b.label}
              </label>
            ))}
          </div>
        </div>
      </fieldset>

      <div className="flex flex-wrap gap-x-8 gap-y-2 sm:col-span-2">
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" name="featured" defaultChecked={product?.featured} className="size-4 accent-espresso" />
          Uitgelicht op de homepage
        </label>
        <label className="flex min-h-11 items-center gap-3">
          <input type="checkbox" name="isExample" defaultChecked={product?.isExample} className="size-4 accent-espresso" />
          Voorbeeldinhoud
        </label>
      </div>
      <div className="sm:col-span-2">
        <Submit>Opslaan</Submit>
      </div>
    </ActionForm>
  );
}
