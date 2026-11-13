import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { db } from "@/lib/db";
import { getStripe } from "@/lib/stripe";

/**
 * Stripe-webhook. De handtekening wordt altijd gecontroleerd; zonder geldige
 * handtekening verandert er niets aan een bestelling.
 *
 * Stel in het Stripe-dashboard deze events in:
 * checkout.session.completed, checkout.session.async_payment_succeeded,
 * checkout.session.async_payment_failed, checkout.session.expired
 */
export async function POST(request: Request) {
  const stripe = getStripe();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!stripe || !secret) {
    return NextResponse.json({ error: "Stripe is niet geconfigureerd." }, { status: 503 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) return NextResponse.json({ error: "Geen handtekening." }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(await request.text(), signature, secret);
  } catch {
    return NextResponse.json({ error: "Ongeldige handtekening." }, { status: 400 });
  }

  if (!db) return NextResponse.json({ received: true });

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      const session = event.data.object;
      // Bij uitgestelde betaalmethodes volgt later async_payment_succeeded.
      if (session.payment_status === "paid") await markPaid(session);
      break;
    }
    case "checkout.session.async_payment_failed":
      await setStatus(event.data.object, "PAYMENT_FAILED");
      break;
    case "checkout.session.expired":
      await setStatus(event.data.object, "CANCELLED");
      break;
  }

  return NextResponse.json({ received: true });
}

async function markPaid(session: Stripe.Checkout.Session) {
  const orderId = session.metadata?.orderId;
  if (!db || !orderId) return;

  // Idempotent: Stripe kan hetzelfde event vaker sturen.
  const stockChanged = await db.$transaction(async (tx) => {
    const updated = await tx.order.updateMany({
      where: { id: orderId, status: { in: ["PENDING", "PAYMENT_FAILED"] } },
      data: { status: "PAID", paidAt: new Date(), stripeSessionId: session.id },
    });
    if (updated.count === 0) return false;

    const items = await tx.orderItem.findMany({ where: { orderId } });
    let changed = false;
    for (const item of items) {
      if (!item.productId) continue;
      const res = await tx.product.updateMany({
        where: { id: item.productId, stock: { not: null } },
        data: { stock: { decrement: item.quantity } },
      });
      changed ||= res.count > 0;
    }
    return changed;
  });

  if (stockChanged) revalidateTag("products", "max");
}

async function setStatus(session: Stripe.Checkout.Session, status: "PAYMENT_FAILED" | "CANCELLED") {
  const orderId = session.metadata?.orderId;
  if (!db || !orderId) return;
  await db.order.updateMany({ where: { id: orderId, status: "PENDING" }, data: { status } });
}
