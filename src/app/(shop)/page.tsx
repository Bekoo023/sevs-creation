import { Featured } from "@/components/home/Featured";
import { Hero } from "@/components/home/Hero";
import { Personalize } from "@/components/home/Personalize";
import { Categories, Gallery, Intro, Reviews, Story } from "@/components/home/Sections";
import { Statement } from "@/components/home/Statement";
import { getProducts, getReviews } from "@/lib/data";

export default async function HomePage() {
  const [products, reviews] = await Promise.all([getProducts(), getReviews()]);
  const featured = products.filter((p) => p.featured);
  const configurable = products.find((p) => p.personalizable && p.backgrounds.length > 1);

  return (
    <>
      <Hero />
      <Intro />
      <Categories />
      {featured.length > 0 && <Featured products={featured} />}
      {configurable && <Personalize product={configurable} />}
      <Story />
      <Statement />
      <Reviews reviews={reviews} />
      <Gallery />
    </>
  );
}
