import { randomInt } from "node:crypto";
import { NextResponse } from "next/server";
import { getProducts } from "@/lib/data";
import { db } from "@/lib/db";
import { backgroundLabel, frameLabel } from "@/lib/options";
import { CartError, priceCart } from "@/lib/pricing";
import { getStripe } from "@/lib/stripe";
import { checkoutSchema } from "@/lib/validation";

const orderNumber = () => {
  const d = new Date();
  const day = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}`;
  return `SC-${day}-${randomInt(1000, 10000)}`;
};

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ongeldig verzoek." }, { status: 400 });
  }

  const parsed = checkoutSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Controleer je gegevens." },
      { status: 400 },
    );
  }
  const { customer, items } = parsed.data;

  // Prijzen, opties en voorraad komen altijd uit de productdata op de server.
  let cart;
  try {
    cart = priceCart(items, await getProducts());
  } catch (e) {
    if (e instanceof CartError) return NextResponse.json({ error: e.message }, { status: 409 });
    throw e;
  }

  const stripe = getStripe();
  const origin = new URL(request.url).origin;

  if (!stripe && process.env.NODE_ENV === "production") {
    return NextResponse.json(
      { error: "Betalen is op dit moment niet mogelijk. Probeer het later opnieuw." },
      { status: 503 },
    );
  }

  const order = db
    ? await db.order.create({
        data: {
          number: orderNumber(),
          ...customer,
          phone: customer.phone ?? null,
          subtotalCents: cart.subtotalCents,
          shippingCents: cart.shippingCents,
          totalCents: cart.totalCents,
          items: {
            create: cart.lines.map((l) => ({
              productId: l.product.id,
              name: `${l.product.name} | ${l.product.subtitle}`,
              unitPriceCents: l.unitPriceCents,
              quantity: l.quantity,
              frame: l.frame,
              background: l.background,
              personalization: l.personalization
                ? l.personalization
                : l.note
                  ? { opmerking: l.note }
                  : undefined,
            })),
          },
        },
      })
    : null;

  // Veilige ontwikkelmodus: geen Stripe-sleutel, dus ook geen betaling.
  if (!stripe) {
    const q = new URLSearchParams({ dev: "1", ...(order ? { bestelling: order.number } : {}) });
    return NextResponse.json({ url: `${origin}/bestelling/bevestigd?${q}` });
  }

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    locale: "nl",
    customer_email: customer.email,
    // Geen payment_method_types: Stripe toont de methodes die in het dashboard aan staan,
    // waaronder iDEAL zodra dat daar is geactiveerd.
    line_items: cart.lines.map((l) => ({
      quantity: l.quantity,
      price_data: {
        currency: "eur",
        unit_amount: l.unitPriceCents,
        product_data: {
          name: `${l.product.name} | ${l.product.subtitle}`,
          description:
            [
              frameLabel(l.frame) && `Lijst: ${frameLabel(l.frame)}`,
              backgroundLabel(l.background) && `Achtergrond: ${backgroundLabel(l.background)}`,
              l.personalization && `Naam: ${l.personalization.naam}`,
            ]
              .filter(Boolean)
              .join(", ") || undefined,
        },
      },
    })),
    shipping_options: [
      {
        shipping_rate_data: {
          type: "fixed_amount",
          display_name: cart.shippingCents === 0 ? "Gratis verzending" : "Verzending",
          fixed_amount: { amount: cart.shippingCents, currency: "eur" },
        },
      },
    ],
    metadata: order ? { orderId: order.id, orderNumber: order.number } : {},
    success_url: `${origin}/bestelling/bevestigd?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/afrekenen`,
  });

  if (order && db) {
    await db.order.update({ where: { id: order.id }, data: { stripeSessionId: session.id } });
  }

  return NextResponse.json({ url: session.url });
}
