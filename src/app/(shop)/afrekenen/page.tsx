import type { Metadata } from "next";
import { connection } from "next/server";
import { Suspense } from "react";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = { title: "Afrekenen", robots: { index: false } };

async function Checkout() {
  // De Stripe-configuratie bij elk verzoek lezen, niet tijdens de build.
  await connection();
  return <CheckoutForm paymentsLive={Boolean(process.env.STRIPE_SECRET_KEY)} />;
}

export default function CheckoutPage() {
  return (
    <div className="shell pb-28 pt-32 lg:pt-40">
      <Suspense fallback={<div className="min-h-[50vh]" aria-busy="true" />}>
        <Checkout />
      </Suspense>
    </div>
  );
}
