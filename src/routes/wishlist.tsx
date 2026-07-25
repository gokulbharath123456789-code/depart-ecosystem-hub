import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, ArrowRight, ShoppingBag, Sparkles } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { productById } from "@/mock/products";
import { ProductRail } from "@/components/storefront/ProductRail";
import { Button } from "@/components/ui/button";
import { products } from "@/mock/products";

export const Route = createFileRoute("/wishlist")({
  head: () => ({
    meta: [
      { title: "Wishlist — SREE SUPER MART" },
      { name: "description", content: "Your saved products at SREE SUPER MART." },
    ],
  }),
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const items = ids.map(productById).filter(Boolean) as NonNullable<ReturnType<typeof productById>>[];
  const recommended = products.filter((p) => !ids.includes(p.id)).slice(0, 5);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ArrowRight className="h-3 w-3" />
        <span className="text-foreground">Wishlist</span>
      </nav>

      {/* Header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your wishlist</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {items.length === 0
              ? "Nothing saved yet — tap the heart on any product to keep it here."
              : `${items.length} item${items.length > 1 ? "s" : ""} saved for later`}
          </p>
        </div>
        {items.length > 0 && (
          <Button asChild className="self-start rounded-full sm:self-auto">
            <Link to="/shop">
              <ShoppingBag className="h-4 w-4" /> Continue shopping
            </Link>
          </Button>
        )}
      </div>

      <div className="mt-8">
        {items.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="grid h-24 w-24 place-items-center rounded-full bg-rose-50"
            >
              <Heart className="h-10 w-10 text-rose-400" />
            </motion.div>
            <h3 className="mt-5 font-display text-xl font-bold">No favourites yet</h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Browse the shop and tap the heart icon on any product to save it here for later.
            </p>
            <Button asChild className="mt-6 rounded-full">
              <Link to="/shop">
                Browse products <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <ProductRail products={items} />
        )}
      </div>

      {items.length > 0 && recommended.length > 0 && (
        <div className="mt-20">
          <div className="mb-6 flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h2 className="font-display text-2xl font-extrabold tracking-tight">Recommended for you</h2>
          </div>
          <ProductRail products={recommended} />
        </div>
      )}
    </div>
  );
}
