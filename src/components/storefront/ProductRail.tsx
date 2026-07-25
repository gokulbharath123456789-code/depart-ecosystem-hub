import type { Product } from "@/types";
import { ProductCard } from "./ProductCard";

type ProductWithImage = Product & { imageUrl?: string | null };

export function ProductRail({ products }: { products: ProductWithImage[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 lg:grid-cols-5">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}
