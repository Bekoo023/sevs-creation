import type { Metadata } from "next";
import { Suspense } from "react";
import { ShopClient } from "@/components/shop/ShopClient";
import { getCategories, getProducts } from "@/lib/data";

export const metadata: Metadata = {
  title: "Shop",
  description:
    "Bekijk alle geboortelijsten en satijnen boeketten van Sevs Creations. Filter op kleur, lijst en prijs.",
  alternates: { canonical: "/shop" },
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return (
    <Suspense fallback={<div className="min-h-screen" />}>
      <ShopClient products={products} categories={categories} />
    </Suspense>
  );
}
