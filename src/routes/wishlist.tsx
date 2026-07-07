import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { productById } from "@/mock/products";
import { ProductRail } from "@/components/storefront/ProductRail";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/wishlist")({
  head: () => ({ meta: [{ title: "Wishlist — SREE SUPER MART" }, { name: "description", content: "Your saved products at SREE SUPER MART." }] }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = ids.map(productById).filter(Boolean) as NonNullable<ReturnType<typeof productById>>[];

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Wishlist</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {items.length === 0 ? "Nothing saved yet" : `${items.length} item${items.length > 1 ? "s" : ""}`}
      </p>

      <div className="mt-8">
        {items.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <Heart className="h-9 w-9 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">No favourites yet</h3>
            <p className="mt-1 text-sm text-muted-foreground">Tap the heart on any product to save it.</p>
            <Button asChild className="mt-5 rounded-full"><Link to="/shop">Browse products</Link></Button>
          </div>
        ) : (
          <ProductRail products={items} />
        )}
      </div>
    </div>
  );
}