import { createFileRoute, Link } from "@tanstack/react-router";
import { Heart, Share2, ShoppingBag, Trash2, GitCompare } from "lucide-react";
import { useWishlist } from "@/store/wishlist";
import { productById } from "@/mock/products";
import { recentlyViewed, recommended } from "@/mock/account";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { ProductRail } from "@/components/storefront/ProductRail";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/dashboard/cards";
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { inr, pct } from "@/lib/format";
import { useCart } from "@/store/cart";
import { toast } from "sonner";

export const Route = createFileRoute("/account/wishlist")({
  component: WishlistPage,
});

function WishlistPage() {
  const ids = useWishlist((s) => s.ids);
  const toggle = useWishlist((s) => s.toggle);
  const add = useCart((s) => s.add);
  const items = ids.map(productById).filter(Boolean) as NonNullable<ReturnType<typeof productById>>[];

  return (
    <div className="space-y-6">
      {items.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favourites yet"
          description="Tap the heart on any product to save it here."
          action={
            <Button asChild className="rounded-full">
              <Link to="/shop">Browse products</Link>
            </Button>
          }
        />
      ) : (
        <PanelCard
          title={`Saved (${items.length})`}
          action={
            <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toast.success("Compare opened (demo)")}>
              <GitCompare className="mr-1 h-4 w-4" /> Compare
            </Button>
          }
        >
          <ul className="divide-y divide-border/60">
            {items.map((p) => {
              const discount = pct(p.mrp, p.price);
              const inStock = p.stock > 0;
              return (
                <li key={p.id} className="flex flex-wrap items-center gap-4 py-3 first:pt-0 last:pb-0">
                  <ProductMedia emoji={p.emoji} gradient={p.gradient} size="sm" className="h-16 w-16 rounded-2xl" />
                  <div className="min-w-0 flex-1">
                    <Link to="/product/$slug" params={{ slug: p.slug }} className="block truncate text-sm font-semibold hover:text-primary">
                      {p.name}
                    </Link>
                    <p className="text-xs text-muted-foreground">{p.brand} · {p.unit}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <span className="text-sm font-bold">{inr(p.price)}</span>
                      {discount > 0 && <span className="text-xs text-muted-foreground line-through">{inr(p.mrp)}</span>}
                      {discount > 10 && <Badge className="rounded-full bg-rose-100 text-[10px] text-rose-700">price drop</Badge>}
                      <Badge variant="secondary" className={`rounded-full text-[10px] ${inStock ? "bg-emerald-100 text-emerald-700" : "bg-muted text-muted-foreground"}`}>
                        {inStock ? "In stock" : "Out of stock"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" className="rounded-full" disabled={!inStock} onClick={() => { add(p.id); toast.success("Added to cart"); }}>
                      <ShoppingBag className="mr-1 h-3.5 w-3.5" /> Move to cart
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => toast.success("Link copied")}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-rose-600" onClick={() => toggle(p.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelCard>
      )}

      {recentlyViewed.length > 0 && (
        <PanelCard title="Recently viewed">
          <ProductRail products={recentlyViewed} />
        </PanelCard>
      )}
      <PanelCard title="Recommended for you">
        <ProductRail products={recommended} />
      </PanelCard>
    </div>
  );
}