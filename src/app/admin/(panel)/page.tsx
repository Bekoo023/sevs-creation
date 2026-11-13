import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { cx, formatPrice } from "@/lib/format";
import { ORDER_STATUS } from "@/lib/order-status";
import type { OrderStatus } from "@/generated/prisma/enums";

export const metadata: Metadata = { title: "Bestellingen" };

const dateTime = new Intl.DateTimeFormat("nl-NL", { dateStyle: "medium", timeStyle: "short", timeZone: "Europe/Amsterdam" });

export default async function OrdersPage({ searchParams }: PageProps<"/admin">) {
  await requireAdmin();
  if (!db) return null;
  const params = await searchParams;
  const status = typeof params.status === "string" && params.status in ORDER_STATUS ? (params.status as OrderStatus) : null;

  const orders = await db.order.findMany({
    where: status ? { status } : undefined,
    orderBy: { createdAt: "desc" },
    include: { items: { select: { name: true, quantity: true } } },
    take: 200,
  });

  return (
    <>
      <h1 className="display t-2">Bestellingen</h1>
      <nav aria-label="Filter op status" className="mt-6 flex flex-wrap gap-2">
        {[null, ...Object.keys(ORDER_STATUS)].map((s) => (
          <Link
            key={s ?? "alle"}
            href={s ? `/admin?status=${s}` : "/admin"}
            aria-current={status === s ? "page" : undefined}
            className={cx(
              "border px-3.5 py-2 text-sm",
              status === s ? "border-espresso bg-espresso text-ivory" : "border-espresso/20 bg-ivory",
            )}
          >
            {s ? ORDER_STATUS[s] : "Alle"}
          </Link>
        ))}
      </nav>

      {orders.length === 0 ? (
        <p className="mt-10 text-mocha">Geen bestellingen{status ? " met deze status" : ""}.</p>
      ) : (
        <div className="mt-8 overflow-x-auto bg-ivory">
          <table className="w-full min-w-[44rem] text-left text-sm">
            <thead>
              <tr className="border-b border-espresso/15">
                {["Nummer", "Datum", "Klant", "Inhoud", "Totaal", "Status"].map((h) => (
                  <th key={h} scope="col" className="label px-4 py-3 text-mocha">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-b border-espresso/10 last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/bestellingen/${o.id}`} className="underline underline-offset-4">
                      {o.number}
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-4 py-3">{dateTime.format(o.createdAt)}</td>
                  <td className="px-4 py-3">
                    {o.firstName} {o.lastName}
                  </td>
                  <td className="px-4 py-3 text-mocha">{o.items.map((i) => `${i.quantity}× ${i.name}`).join(", ")}</td>
                  <td className="px-4 py-3 tabular-nums">{formatPrice(o.totalCents)}</td>
                  <td className="whitespace-nowrap px-4 py-3">{ORDER_STATUS[o.status]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
