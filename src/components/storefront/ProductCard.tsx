import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Heart, Star, Clock, Plus, Minus } from "lucide-react";
import type { Product } from "@/types";

type ProductWithImage = Product & { imageUrl?: string | null };
import { inr, pct } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ProductMedia } from "./ProductMedia";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ProductCard({ product }: { product: ProductWithImage }) {
  const items = useCart((s) => s.items);
  const add = useCart((s) => s.add);
  const setQty = useCart((s) => s.setQty);
  const wishIds = useWishlist((s) => s.ids);
  const toggleWish = useWishlist((s) => s.toggle);

  const inCart = items.find((i) => i.productId === product.id);
  const wished = wishIds.includes(product.id);
  const discount = pct(product.mrp, product.price);

  const tagBadge = product.tags[0];

  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="group relative flex h-full flex-col overflow-hidden rounded-[18px] bg-card soft-shadow ring-1 ring-border/60 transition-shadow hover:lift-shadow"
    >
      <Link
        to="/product/$slug"
        params={{ slug: product.slug }}
        className="relative block overflow-hidden"
      >
        <ProductMedia
          emoji={product.emoji}
          gradient={product.gradient}
          size="lg"
          className="aspect-square w-full transition-transform duration-500 group-hover:scale-[1.06]"
          imageUrl={product.imageUrl ?? null}
          alt={product.name}
        />
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {discount > 0 && (
            <Badge className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold text-destructive-foreground shadow-sm">
              {discount}% OFF
            </Badge>
          )}
          {tagBadge && (
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                tagBadge === "organic" && "bg-emerald-100 text-emerald-800",
                tagBadge === "bestseller" && "bg-amber-100 text-amber-800",
                tagBadge === "new" && "bg-sky-100 text-sky-800",
                tagBadge === "vegan" && "bg-lime-100 text-lime-800",
                tagBadge === "imported" && "bg-violet-100 text-violet-800",
                tagBadge === "low-fat" && "bg-rose-100 text-rose-800",
              )}
            >
              {tagBadge}
            </Badge>
          )}
        </div>
        <button
          onClick={(e) => {
            e.preventDefault();
            toggleWish(product.id);
          }}
          aria-label="Toggle wishlist"
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-foreground/70 backdrop-blur transition hover:bg-white hover:text-rose-500"
        >
          <Heart
            className={cn("h-4 w-4 transition", wished && "fill-rose-500 text-rose-500")}
          />
        </button>
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground">
          <Clock className="h-3 w-3" />
          {product.deliveryMins} mins
          <span className="mx-1">•</span>
          <span className="text-foreground/70">{product.unit}</span>
          {product.stock > 0 && product.stock <= 10 && (
            <>
              <span className="mx-1">•</span>
              <span className="font-semibold text-rose-600">Only {product.stock} left</span>
            </>
          )}
        </div>
        <Link
          to="/product/$slug"
          params={{ slug: product.slug }}
          className="line-clamp-2 min-h-[2.5rem] text-sm font-semibold leading-snug text-foreground transition hover:text-primary"
        >
          {product.name}
        </Link>
        <div className="flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
          <span className="font-semibold">{product.rating}</span>
          <span className="text-muted-foreground">({product.reviewCount.toLocaleString()})</span>
        </div>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <div className="flex flex-col">
            <div className="text-base font-bold tracking-tight text-foreground">
              {inr(product.price)}
            </div>
            {product.mrp > product.price && (
              <div className="text-xs text-muted-foreground line-through">
                {inr(product.mrp)}
              </div>
            )}
          </div>
          {inCart ? (
            <div className="flex items-center gap-1 rounded-full bg-primary p-1 text-primary-foreground">
              <button
                onClick={() => setQty(product.id, inCart.qty - 1)}
                className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/15"
                aria-label="Decrease"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-5 text-center text-sm font-bold tabular-nums">
                {inCart.qty}
              </span>
              <button
                onClick={() => setQty(product.id, inCart.qty + 1)}
                className="grid h-7 w-7 place-items-center rounded-full transition hover:bg-white/15"
                aria-label="Increase"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={() => {
                add(product.id);
                toast.success(`${product.name} added`, { description: product.unit });
              }}
              className="rounded-full font-semibold"
            >
              <Plus className="h-4 w-4" />
              Add
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}