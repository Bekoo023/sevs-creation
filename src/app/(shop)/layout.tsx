import { Chrome } from "@/components/layout/Chrome";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { getProducts } from "@/lib/data";

export default async function ShopLayout({ children }: LayoutProps<"/">) {
  const products = await getProducts();
  return (
    <Providers>
      <Chrome products={products} />
      <main id="inhoud">{children}</main>
      <Footer />
    </Providers>
  );
}
