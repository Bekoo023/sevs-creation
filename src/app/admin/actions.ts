"use server";

import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { checkPassword, createSession, destroySession, requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { sendShippedEmail } from "@/lib/email";
import { BACKGROUNDS, FRAMES } from "@/lib/options";

export type FormState = { error?: string; ok?: boolean };

const need = () => {
  if (!db) throw new Error("Geen database geconfigureerd.");
  return db;
};

export async function login(_: FormState, form: FormData): Promise<FormState> {
  // Vaste vertraging remt het raden van wachtwoorden.
  await new Promise((r) => setTimeout(r, 700));
  if (!checkPassword(String(form.get("password") ?? ""))) {
    return { error: "Onjuist wachtwoord." };
  }
  await createSession();
  redirect("/admin");
}

export async function logout() {
  await destroySession();
  redirect("/admin/login");
}

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

const productSchema = z.object({
  name: z.string().trim().min(1, "Naam is verplicht"),
  slug: z.string().trim().optional(),
  subtitle: z.string().trim().default(""),
  description: z.string().trim().default(""),
  details: z.string().default(""),
  price: z
    .string()
    .trim()
    .regex(/^\d+([.,]\d{1,2})?$/, "Prijs in euro, bijvoorbeeld 54,95"),
  stock: z.string().trim().regex(/^\d*$/, "Voorraad is een geheel getal of leeg"),
  status: z.enum(["ACTIVE", "ARCHIVED"]),
  categoryId: z.string().min(1, "Kies een categorie"),
  animal: z.enum(["", "olifant", "beer", "konijn"]),
  images: z.string().default(""),
});

/** Eén foto per regel: pad | alt-tekst | lijst | achtergrond */
function parseImages(raw: string) {
  return raw
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean)
    .map((line) => {
      const [src, alt = "", frame = "", background = ""] = line.split("|").map((p) => p.trim());
      if (!src.startsWith("/")) throw new Error(`Fotopad moet met / beginnen: ${src}`);
      return {
        src,
        alt,
        width: 1200,
        height: 1200,
        ...(frame in FRAMES ? { frame } : {}),
        ...(background in BACKGROUNDS ? { background } : {}),
      };
    });
}

export async function saveProduct(id: string | null, _: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const prisma = need();
  const parsed = productSchema.safeParse(Object.fromEntries(form));
  if (!parsed.success) return { error: parsed.error.issues[0].message };
  const v = parsed.data;

  let images;
  try {
    images = parseImages(v.images);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const data = {
    name: v.name,
    slug: slugify(v.slug || v.name),
    subtitle: v.subtitle,
    description: v.description,
    details: v.details.split("\n").map((d) => d.trim()).filter(Boolean),
    priceCents: Math.round(Number(v.price.replace(",", ".")) * 100),
    stock: v.stock === "" ? null : Number(v.stock),
    status: v.status,
    categoryId: v.categoryId,
    featured: form.get("featured") === "on",
    isExample: form.get("isExample") === "on",
    personalizable: form.get("personalizable") === "on",
    animal: v.animal || null,
    frames: form.getAll("frames").map(String).filter((f) => f in FRAMES),
    backgrounds: form.getAll("backgrounds").map(String).filter((b) => b in BACKGROUNDS),
    images,
  };
  if (data.personalizable && (!data.animal || !data.frames.length || !data.backgrounds.length)) {
    return { error: "Een personaliseerbaar product heeft een figuur, minstens één lijst en één achtergrond nodig." };
  }

  try {
    if (id) await prisma.product.update({ where: { id }, data });
    else await prisma.product.create({ data });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { error: "Deze slug bestaat al." };
    throw e;
  }
  updateTag("products");
  redirect("/admin/producten");
}

export async function setProductStatus(id: string, status: "ACTIVE" | "ARCHIVED") {
  await requireAdmin();
  await need().product.update({ where: { id }, data: { status } });
  updateTag("products");
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  // Bestelregels blijven bestaan; de koppeling met het product vervalt.
  await need().product.delete({ where: { id } });
  updateTag("products");
  redirect("/admin/producten");
}

export async function saveCategory(_: FormState, form: FormData): Promise<FormState> {
  await requireAdmin();
  const prisma = need();
  const id = String(form.get("id") ?? "");
  const name = String(form.get("name") ?? "").trim();
  const description = String(form.get("description") ?? "").trim();
  if (!name) return { error: "Naam is verplicht." };
  try {
    if (id) await prisma.category.update({ where: { id }, data: { name, description } });
    else await prisma.category.create({ data: { name, description, slug: slugify(name) } });
  } catch (e) {
    if ((e as { code?: string }).code === "P2002") return { error: "Deze categorie bestaat al." };
    throw e;
  }
  updateTag("products");
  return { ok: true };
}

export async function deleteCategory(id: string): Promise<void> {
  await requireAdmin();
  const prisma = need();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) return; // Eerst de producten verplaatsen; de knop is dan ook uitgeschakeld.
  await prisma.category.delete({ where: { id } });
  updateTag("products");
}

const STATUSES = ["PENDING", "PAID", "IN_PRODUCTION", "SHIPPED", "COMPLETED", "CANCELLED", "PAYMENT_FAILED"] as const;

export async function updateOrderStatus(id: string, form: FormData) {
  await requireAdmin();
  const prisma = need();
  const status = z.enum(STATUSES).parse(form.get("status"));
  const tracking = String(form.get("tracking") ?? "").trim().slice(0, 300) || null;

  const before = await prisma.order.findUnique({ where: { id }, select: { status: true } });
  const order = await prisma.order.update({
    where: { id },
    data: { status, tracking },
    include: { items: true },
  });
  // Alleen bij de overgang naar "Verzonden", zodat de klant de e-mail één keer krijgt.
  if (status === "SHIPPED" && before?.status !== "SHIPPED") await sendShippedEmail(order);
  redirect(`/admin/bestellingen/${id}`);
}
