import type { MetadataRoute } from "next";
import { siteConfig } from "@/config/site";
import { getProducts } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  const pages = ["", "/shop", "/over-ons", "/contact", "/verzending-retourneren", "/algemene-voorwaarden", "/privacybeleid"];
  return [
    ...pages.map((p) => ({ url: `${siteConfig.url}${p}`, priority: p === "" ? 1 : 0.6 })),
    ...products.map((p) => ({ url: `${siteConfig.url}/shop/${p.slug}`, priority: 0.8 })),
  ];
}
