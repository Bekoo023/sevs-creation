import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Submit } from "@/components/admin/ui";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { formatBirthDate, formatPrice } from "@/lib/format";
import { backgroundLabel, frameLabel } from "@/lib/options";
import { ORDER_STATUS } from "@/lib/order-status";
import type { Personalization } from "@/lib/types";
import { formatWeight } from "@/lib/validation";
import { updateOrderStatus } from "../../../actions";

export const metadata: Metadata = { title: "Bestelling" };

export default async function OrderPage({ params }: PageProps<"/admin/bestellingen/[id]">) {
  await requireAdmin();
  if (!db) return null;
  const { id } = await params;
  const order = await db.order.findUnique({ where: { id }, include: { items: true } });
  if (!order) notFound();

  return (
    <>
      <Link href="/admin" className="link-line label text-mocha">
        Alle bestellingen
      </Link>
      <div className="mt-4 flex flex-wrap items-end justify-between gap-6">
        <div>
          <h1 className="display t-2">{order.number}</h1>
          <p className="mt-1 text-mocha">{ORDER_STATUS[order.status]}</p>
        </div>
        <form action={updateOrderStatus.bind(null, order.id)} className="flex flex-wrap items-end gap-3">
          <div>
            <label htmlFor="tracking" className="field-label">
              Track-en-trace <span className="normal-case tracking-normal">(code of link, optioneel)</span>
            </label>
            <input
              id="tracking"
              name="tracking"
              type="text"
              maxLength={300}
              defaultValue={order.tracking ?? ""}
              autoComplete="off"
              className="field min-w-64"
            />
          </div>
          <div>
            <label htmlFor="status" className="field-label">
              Status
            </label>
            <select id="status" name="status" defaultValue={order.status} className="field min-w-48">
              {Object.entries(ORDER_STATUS).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
          <Submit className="btn btn-outline">Opslaan</Submit>
        </form>
      </div>
      <p className="mt-4 text-sm text-mocha">
        {emailConfigured()
          ? "Zet je de status op Verzonden, dan krijgt de klant automatisch een e-mail, met de track-en-trace als die is ingevuld."
          : "E-mail is nog niet ingesteld (RESEND_API_KEY en EMAIL_FROM). De klant krijgt nu geen bericht bij verzending."}
      </p>

      <div className="mt-10 grid gap-8 lg:grid-cols-3">
        <section className="bg-ivory p-6 lg:col-span-2">
          <h2 className="label text-mocha">Te maken</h2>
          <ul>
            {order.items.map((item) => {
              const p = item.personalization as Partial<Personalization> | null;
              const rows: [string, string | null | undefined][] = [
                ["Lijst", frameLabel(item.frame)],
                ["Achtergrond", backgroundLabel(item.background)],
                ["Naam", p?.naam],
                ["Geboortedatum", p?.geboortedatum && formatBirthDate(p.geboortedatum)],
                ["Geboortetijd", p?.geboortetijd && `${p.geboortetijd} uur`],
                ["Gewicht", p?.gewicht && formatWeight(p.gewicht)],
                ["Lengte", p?.lengte && `${p.lengte} cm`],
                ["Opmerking", p?.opmerking],
              ];
              return (
                <li key={item.id} className="border-b border-espresso/10 py-5 last:border-0">
                  <div className="flex justify-between gap-6">
                    <p className="font-serif text-xl">
                      {item.quantity}× {item.name}
                    </p>
                    <p className="tabular-nums">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                  </div>
                  <dl className="mt-3 grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
                    {rows
                      .filter(([, v]) => v)
                      .map(([k, v]) => (
                        <div key={k} className="flex gap-2">
                          <dt className="w-28 shrink-0 text-mocha">{k}</dt>
                          <dd className="font-medium">{v}</dd>
                        </div>
                      ))}
                  </dl>
                </li>
              );
            })}
          </ul>
        </section>

        <section className="bg-ivory p-6">
          <h2 className="label text-mocha">Klant</h2>
          <address className="mt-4 not-italic leading-relaxed">
            {order.firstName} {order.lastName}
            <br />
            {order.street} {order.houseNumber}
            <br />
            {order.postalCode} {order.city}
            <br />
            {order.country === "BE" ? "België" : "Nederland"}
            <br />
            <a href={`mailto:${order.email}`} className="underline underline-offset-4">
              {order.email}
            </a>
            {order.phone && (
              <>
                <br />
                {order.phone}
              </>
            )}
          </address>
          <dl className="mt-6 space-y-1 border-t border-espresso/15 pt-4">
            <div className="flex justify-between">
              <dt className="text-mocha">Subtotaal</dt>
              <dd className="tabular-nums">{formatPrice(order.subtotalCents)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-mocha">Verzending</dt>
              <dd className="tabular-nums">{formatPrice(order.shippingCents)}</dd>
            </div>
            <div className="flex justify-between font-medium">
              <dt>Totaal</dt>
              <dd className="tabular-nums">{formatPrice(order.totalCents)}</dd>
            </div>
          </dl>
        </section>
      </div>
    </>
  );
}
