import Image from "next/image";
import type { Product } from "@/lib/types";

/**
 * Productbeeld. Zonder foto tonen we een rustig typografisch vlak
 * in plaats van een verzonnen productfoto.
 */
export function ProductVisual({
  product,
  index = 0,
  sizes,
  priority,
  className = "object-cover",
}: {
  product: Pick<Product, "images" | "name">;
  index?: number;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const image = product.images[index];
  if (!image) {
    return (
      <div className="absolute inset-0 bg-champagne">
        <div className="absolute inset-4 flex flex-col items-center justify-center gap-3 border border-espresso/15 p-4 text-center sm:inset-6">
          <span className="font-serif text-[clamp(1.5rem,3vw,2.25rem)] leading-none">{product.name}</span>
          <span className="h-px w-10 bg-gold" />
          <span className="label text-mocha">Foto volgt</span>
        </div>
      </div>
    );
  }
  return (
    <Image
      src={image.src}
      alt={image.alt}
      fill
      sizes={sizes}
      priority={priority}
      quality={85}
      className={className}
    />
  );
}
