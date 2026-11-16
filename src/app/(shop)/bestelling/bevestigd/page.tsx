import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ClearCart } from "@/components/checkout/ClearCart";
import { db } from "@/lib/db";
import { emailConfigured } from "@/lib/email";
import { formatBirthDate, formatPrice } from "@/lib/format";
import { backgroundLabel, frameLabel } from "@/lib/options";
import { getStripe } from "@/lib/stripe";
import type { Personalization } from "@/lib/types";
import { formatWeight } from "@/lib/validation";

export const metadata: Metadata = { title: "Bestelling", robots: { index: false } };

type State = "paid" | "processing" | "dev" | "unknown";

async function Confirmation({ searchParams }: Pick<PageProps<"/bestelling/bevestigd">, "searchParams">) {
  const params = await searchParams;
  const sessionId = typeof params.session_id === "string" ? params.session_id : null;
  const dev = params.dev === "1" && process.env.NODE_ENV !== "production";
  const stripe = getStripe();

  let state: State = dev ? "dev" : "unknown";
  let orderWhere: { stripeSessionId: string } | { number: string } | null =
    dev && typeof params.bestelling === "string" ? { number: params.bestelling } : null;

  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      if (session.status === "complete") {
        state = session.payment_status === "paid" ? "paid" : "processing";
        orderWhere = { stripeSessionId: session.id };
      }
    } catch {
      state = "unknown";
    }
  }

  // Het sessie-ID uit de URL is de enige sleutel tot de bestelgegevens.
  const order =
    db && orderWhere ? await db.order.findUnique({ where: orderWhere, include: { items: true } }) : null;

  const copy: Record<State, { title: string; body: string }> = {
    paid: {
      title: "Dank je wel. We gaan voor je aan de slag.",
      body: emailConfigured()
        ? "Je betaling is ontvangen. Je krijgt een bevestiging per e-mail. Zie je die niet, kijk dan ook in je spamfolder."
        : "Je betaling is ontvangen. Bewaar je bestelnummer voor als je contact met ons opneemt.",
    },
    processing: {
      title: "Je bestelling is geplaatst.",
      body: "De betaling wordt nog verwerkt. Zodra die binnen is, gaan we voor je aan de slag.",
    },
    dev: {
      title: "Testbestelling geplaatst.",
      body: "Ontwikkelmodus: Stripe is niet geconfigureerd. Er is geen betaling gedaan en deze bestelling is niet betaald.",
    },
    unknown: {
      title: "We konden deze bestelling niet vinden.",
      body: "Controleer de link in je e-mail of neem contact met ons op.",
    },
  };

  return (
    <>
      {(state === "paid" || state === "processing" || state === "dev") && <ClearCart />}
      <p className="label text-mocha">{order ? `Bestelling ${order.number}` : "Bestelling"}</p>
      <h1 className="display t-1 mt-5 max-w-[16ch]">{copy[state].title}</h1>
      <p className="mt-6 max-w-md text-[1.0625rem] text-mocha">{copy[state].body}</p>

      {order && (
        <div className="mt-14 max-w-2xl">
          <ul>
            {order.items.map((item) => {
              const p = item.personalization as Partial<Personalization> | null;
              return (
                <li key={item.id} className="border-t border-espresso/15 py-5">
                  <div className="flex justify-between gap-6">
                    <p className="font-serif text-xl">
                      {item.name}
                      {item.quantity > 1 ? ` × ${item.quantity}` : ""}
                    </p>
                    <p className="tabular-nums">{formatPrice(item.unitPriceCents * item.quantity)}</p>
                  </div>
                  <p className="mt-1 text-sm text-mocha">
                    {[
                      frameLabel(item.frame) && `Lijst ${frameLabel(item.frame)!.toLowerCase()}`,
                      backgroundLabel(item.background) && `achtergrond ${backgroundLabel(item.background)!.toLowerCase()}`,
                      p?.naam,
                      p?.geboortedatum && formatBirthDate(p.geboortedatum),
                      p?.geboortetijd && `${p.geboortetijd} uur`,
                      p?.gewicht && formatWeight(p.gewicht),
                      p?.lengte && `${p.lengte} cm`,
                      p?.opmerking,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                </li>
              );
            })}
          </ul>
          <dl className="border-t border-espresso/15 pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-mocha">Verzending</dt>
              <dd className="tabular-nums">{formatPrice(order.shippingCents)}</dd>
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <dt className="label">Totaal</dt>
              <dd className="font-serif text-2xl tabular-nums">{formatPrice(order.totalCents)}</dd>
            </div>
          </dl>
        </div>
      )}

      <Link href="/shop" className="btn btn-outline mt-12">
        Verder kijken
      </Link>
    </>
  );
}

export default function ConfirmationPage({ searchParams }: PageProps<"/bestelling/bevestigd">) {
  return (
    <div className="shell min-h-[80vh] pb-28 pt-36 lg:pt-48">
      <Suspense fallback={<p className="label text-mocha">Je bestelling wordt opgehaald</p>}>
        <Confirmation searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
