import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { ChevronRight, Heart, Minus, Plus, Star, Truck, ShieldCheck, RotateCcw, Clock } from "lucide-react";
import { productBySlug, products } from "@/mock/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { ProductRail } from "@/components/storefront/ProductRail";
import { inr, pct } from "@/lib/format";
import { useCart } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/product/$slug")({
  loader: ({ params }) => {
    const product = productBySlug(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.product.name} — DEPART` },
            { name: "description", content: loaderData.product.description },
            { property: "og:title", content: `${loaderData.product.name} — DEPART` },
            { property: "og:description", content: loaderData.product.description },
          ],
        }
      : {},
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const [activeImg, setActiveImg] = useState(0);
  const add = useCart((s) => s.add);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const wished = useWishlist((s) => s.ids.includes(product.id));
  const toggleWish = useWishlist((s) => s.toggle);
  const discount = pct(product.mrp, product.price);
  const related = products.filter((p) => p.categorySlug === product.categorySlug && p.id !== product.id).slice(0, 5);

  // Fake gallery: same emoji on 4 differently-tinted gradients
  const gallery = [
    product.gradient,
    "from-stone-100 to-slate-100",
    "from-amber-100 to-yellow-50",
    "from-emerald-100 to-lime-50",
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/category/$slug" params={{ slug: product.categorySlug }} className="capitalize hover:text-foreground">
          {product.categorySlug.replace("-", " & ")}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate text-foreground">{product.name}</span>
      </nav>

      <div className="mt-6 grid gap-10 lg:grid-cols-[1.1fr_1fr]">
        {/* Gallery */}
        <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
          <div className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col">
            {gallery.map((g, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 transition",
                  activeImg === i ? "ring-primary" : "ring-transparent hover:ring-border",
                )}
              >
                <ProductMedia emoji={product.emoji} gradient={g} size="sm" className="h-full w-full" />
              </button>
            ))}
          </div>
          <motion.div
            key={activeImg}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="order-1 sm:order-2"
          >
            <ProductMedia
              emoji={product.emoji}
              gradient={gallery[activeImg]}
              size="xl"
              className="aspect-square w-full"
            />
          </motion.div>
        </div>

        {/* Info */}
        <div className="flex flex-col gap-5">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-primary">{product.brand}</div>
            <h1 className="mt-1 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3 text-sm">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                <span className="font-bold">{product.rating}</span>
                <span className="text-muted-foreground">({product.reviewCount.toLocaleString()} reviews)</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="inline-flex items-center gap-1 text-muted-foreground">
                <Clock className="h-3.5 w-3.5 text-primary" /> {product.deliveryMins} min delivery
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1.5">
            {product.tags.map((t) => (
              <Badge key={t} variant="secondary" className="rounded-full capitalize">{t}</Badge>
            ))}
          </div>

          <div className="flex items-end gap-3 rounded-2xl bg-muted/60 p-4">
            <div className="font-display text-4xl font-extrabold">{inr(product.price)}</div>
            {product.mrp > product.price && (
              <>
                <div className="text-lg text-muted-foreground line-through">{inr(product.mrp)}</div>
                <Badge className="rounded-full bg-destructive text-destructive-foreground">{discount}% OFF</Badge>
              </>
            )}
            <div className="ml-auto text-xs font-semibold text-muted-foreground">
              Per {product.unit}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 rounded-full bg-muted p-1.5">
              <button onClick={() => setQty(Math.max(1, qty - 1))} className="grid h-8 w-8 place-items-center rounded-full hover:bg-background" aria-label="Decrease">
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="min-w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
              <button onClick={() => setQty(qty + 1)} className="grid h-8 w-8 place-items-center rounded-full hover:bg-background" aria-label="Increase">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
            <Button
              size="lg"
              className="flex-1 rounded-full font-semibold"
              onClick={() => {
                add(product.id, qty);
                toast.success(`${product.name} added`, { description: `Qty ${qty} · ${product.unit}` });
                setCartOpen(true);
              }}
            >
              Add to cart · {inr(product.price * qty)}
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="rounded-full"
              onClick={() => toggleWish(product.id)}
              aria-label="Wishlist"
            >
              <Heart className={cn("h-4 w-4", wished && "fill-rose-500 text-rose-500")} />
            </Button>
          </div>

          <div className="grid gap-3 rounded-2xl border border-border bg-card p-4 sm:grid-cols-3">
            {[
              { icon: Truck, title: "Free delivery", sub: "On orders ₹499+" },
              { icon: ShieldCheck, title: "Quality promise", sub: "Or full refund" },
              { icon: RotateCcw, title: "Easy returns", sub: "Within 24 hours" },
            ].map(({ icon: Icon, title, sub }) => (
              <div key={title} className="flex items-center gap-2.5">
                <div className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <div className="text-xs font-bold">{title}</div>
                  <div className="text-[11px] text-muted-foreground">{sub}</div>
                </div>
              </div>
            ))}
          </div>

          {product.nutrition && (
            <div className="rounded-2xl border border-border bg-card p-5">
              <h3 className="font-display font-bold">Nutrition (per serving)</h3>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {product.nutrition.map((n) => (
                  <div key={n.label} className="rounded-xl bg-muted/60 p-3">
                    <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{n.label}</div>
                    <div className="mt-0.5 font-display text-lg font-bold">{n.value}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {product.storage && (
            <div className="rounded-2xl border border-border bg-card p-5 text-sm">
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Storage</div>
              <p className="mt-1 text-foreground/80">{product.storage}</p>
            </div>
          )}
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-extrabold tracking-tight">You may also like</h2>
          <ProductRail products={related} />
        </div>
      )}
    </div>
  );
}