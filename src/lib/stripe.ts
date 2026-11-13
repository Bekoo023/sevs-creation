import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;

/** `null` zolang STRIPE_SECRET_KEY ontbreekt. */
export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  client ??= new Stripe(key);
  return client;
}
