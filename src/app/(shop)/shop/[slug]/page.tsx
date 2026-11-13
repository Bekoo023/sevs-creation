import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product/ProductCard";
import { ProductDetail } from "@/components/product/ProductDetail";
import { siteConfig } from "@/config/site";
import { getProduct, getProducts } from "@/lib/data";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/shop/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  const title = `${product.name}, ${product.subtitle.toLowerCase()}`;
  return {
    title,
    description: product.description,
    alternates: { canonical: `/shop/${product.slug}` },
    openGraph: {
      title,
      description: product.description,
      images: product.images.slice(0, 1).map((i) => ({ url: i.src, width: i.width, height: i.height, alt: i.alt })),
    },
  };
}

export default async function ProductPage({ params }: PageProps<"/shop/[slug]">) {
  const { slug } = await params;
  const [product, all] = await Promise.all([getProduct(slug), getProducts()]);
  if (!product) notFound();

  const related = all
    .filter((p) => p.id !== product.id)
    .sort((a, b) => Number(b.category.slug === product.category.slug) - Number(a.category.slug === product.category.slug))
    .slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${product.name} | ${product.subtitle}`,
    description: product.description,
    image: product.images.map((i) => `${siteConfig.url}${i.src}`),
    brand: { "@type": "Brand", name: siteConfig.name },
    category: product.category.name,
    offers: {
      "@type": "Offer",
      url: `${siteConfig.url}/shop/${product.slug}`,
      priceCurrency: "EUR",
      price: (product.priceCents / 100).toFixed(2),
      availability:
        product.stock !== null && product.stock <= 0
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <ProductDetail key={product.id} product={product} />
      {related.length > 0 && (
        <section className="border-t border-espresso/15 py-20 lg:py-28">
          <div className="shell">
            <h2 className="display t-2">Ook uit het atelier</h2>
            <ul className="mt-12 grid grid-cols-2 gap-x-4 gap-y-12 lg:grid-cols-3 lg:gap-x-8">
              {related.map((p) => (
                <li key={p.id} className="last:max-lg:hidden">
                  <ProductCard product={p} sizes="(min-width: 1024px) 31vw, 50vw" />
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </>
  );
}
