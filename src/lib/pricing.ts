import { siteConfig } from "@/config/site";
import type { Product } from "./types";
import type { CheckoutInput } from "./validation";

export function shippingFor(subtotalCents: number) {
  const { costCents, freeFromCents } = siteConfig.shipping;
  if (subtotalCents === 0) return 0;
  if (freeFromCents !== null && subtotalCents >= freeFromCents) return 0;
  return costCents;
}

export type PricedLine = {
  product: Product;
  quantity: number;
  unitPriceCents: number;
  frame: string | null;
  background: string | null;
  personalization: CheckoutInput["items"][number]["personalization"] | null;
  note: string | null;
};

export class CartError extends Error {}

/**
 * Bouwt de bestelling op uit productdata van de server.
 * Prijzen uit de browser worden nooit gebruikt.
 */
export function priceCart(items: CheckoutInput["items"], products: Product[]) {
  const lines: PricedLine[] = items.map((item) => {
    const product = products.find((p) => p.id === item.productId);
    if (!product) throw new CartError("Een product in je winkelwagen is niet meer beschikbaar.");
    if (product.stock !== null && product.stock < item.quantity) {
      throw new CartError(`${product.name} is niet meer in dit aantal op voorraad.`);
    }
    let frame: string | null = null;
    let background: string | null = null;
    if (product.personalizable) {
      if (!item.personalization) {
        throw new CartError(`De geboortegegevens voor ${product.name} ontbreken.`);
      }
      if (!item.frame || !(product.frames as string[]).includes(item.frame)) {
        throw new CartError(`Kies een lijst voor ${product.name}.`);
      }
      if (!item.background || !(product.backgrounds as string[]).includes(item.background)) {
        throw new CartError(`Kies een achtergrondkleur voor ${product.name}.`);
      }
      frame = item.frame;
      background = item.background;
    }
    return {
      product,
      quantity: item.quantity,
      unitPriceCents: product.priceCents,
      frame,
      background,
      personalization: product.personalizable ? (item.personalization ?? null) : null,
      note: item.note || null,
    };
  });
  const subtotalCents = lines.reduce((s, l) => s + l.unitPriceCents * l.quantity, 0);
  const shippingCents = shippingFor(subtotalCents);
  return { lines, subtotalCents, shippingCents, totalCents: subtotalCents + shippingCents };
}
