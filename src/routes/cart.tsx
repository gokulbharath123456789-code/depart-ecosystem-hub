import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag, Truck, ShieldCheck, RotateCcw, ChevronRight, X } from "lucide-react";
import { useCart } from "@/store/cart";
import { productById } from "@/mock/products";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inr } from "@/lib/format";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Your cart — SREE SUPER MART" }, { name: "description", content: "Review the items in your SREE SUPER MART cart." }] }),
  component: CartPage,
});

function CartPage() {
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);

  const detailed = items
    .map((i) => ({ item: i, product: productById(i.productId) }))
    .filter((x): x is { item: typeof x.item; product: NonNullable<typeof x.product> } => !!x.product);

  const subtotal = detailed.reduce((s, x) => s + x.product.price * x.item.qty, 0);
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 39;
  const total = subtotal + delivery - discount;
  const savings = detailed.reduce((s, x) => s + Math.max(0, x.product.mrp - x.product.price) * x.item.qty, 0);

  if (detailed.length === 0) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="grid h-28 w-28 place-items-center rounded-full bg-muted"
        >
          <ShoppingBag className="h-12 w-12 text-muted-foreground" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight">Your cart is empty</h1>
        <p className="mt-2 max-w-sm text-muted-foreground">
          Discover thousands of fresh products waiting for you across Coimbatore.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/shop">
            Start shopping <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6 lg:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Cart</span>
      </nav>

      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your cart</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {detailed.length} item{detailed.length > 1 ? "s" : ""} · You're saving {inr(savings)} on this order
          </p>
        </div>
        <button
          onClick={clear}
          className="inline-flex items-center gap-1.5 self-start text-xs font-semibold text-muted-foreground transition hover:text-destructive sm:self-auto"
        >
          <Trash2 className="h-3.5 w-3.5" /> Clear cart
        </button>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        {/* Items */}
        <div className="space-y-3">
          <AnimatePresence>
            {detailed.map(({ item, product }) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex gap-4 rounded-2xl border border-border/60 bg-card p-4 transition-shadow hover:soft-shadow"
              >
                <Link to="/product/$slug" params={{ slug: product.slug }} className="shrink-0">
                  <ProductMedia emoji={product.emoji} gradient={product.gradient} size="md" className="h-24 w-24" />
                </Link>
                <div className="flex flex-1 flex-col gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <Link to="/product/$slug" params={{ slug: product.slug }} className="font-semibold hover:text-primary">
                        {product.name}
                      </Link>
                      <div className="text-xs text-muted-foreground">{product.brand} · {product.unit}</div>
                      {product.mrp > product.price && (
                        <div className="mt-0.5 text-[11px] font-semibold text-emerald-600">
                          Save {inr((product.mrp - product.price) * item.qty)}
                        </div>
                      )}
                    </div>
                    <button onClick={() => remove(product.id)} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-rose-50 hover:text-destructive" aria-label="Remove">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                      <button onClick={() => setQty(product.id, item.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background" aria-label="Decrease">
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="min-w-6 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                      <button onClick={() => setQty(product.id, item.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background" aria-label="Increase">
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <div className="text-right">
                      <div className="font-display text-lg font-bold">{inr(product.price * item.qty)}</div>
                      {product.mrp > product.price && (
                        <div className="text-xs text-muted-foreground line-through">{inr(product.mrp * item.qty)}</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {/* Trust strip */}
          <div className="grid grid-cols-3 gap-3 pt-2">
            {[
              { icon: Truck, label: "Free over ₹499" },
              { icon: ShieldCheck, label: "Secure checkout" },
              { icon: RotateCcw, label: "Easy returns" },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-2 rounded-2xl border border-border/60 bg-card p-3 text-xs font-medium text-foreground/70">
                <Icon className="h-4 w-4 text-primary" />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <aside className="h-fit space-y-4 rounded-2xl border border-border/60 bg-card p-5 lg:sticky lg:top-32">
          <h3 className="font-display text-lg font-bold">Order summary</h3>

          {/* Free delivery progress */}
          {subtotal > 0 && subtotal < 499 && (
            <div className="rounded-xl bg-primary/10 p-3">
              <p className="text-xs font-semibold text-primary">
                Add {inr(499 - subtotal)} more for FREE delivery
              </p>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-primary/20">
                <div
                  className="h-full rounded-full bg-primary transition-all"
                  style={{ width: `${Math.min(100, (subtotal / 499) * 100)}%` }}
                />
              </div>
            </div>
          )}
          {subtotal >= 499 && (
            <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs font-semibold text-emerald-700">
              <Truck className="h-4 w-4" /> You've unlocked FREE delivery!
            </div>
          )}

          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal ({detailed.length} items)</span>
              <span className="text-foreground">{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span className={delivery === 0 ? "font-semibold text-primary" : "text-foreground"}>
                {delivery === 0 ? "FREE" : inr(delivery)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon discount</span>
                <span>−{inr(discount)}</span>
              </div>
            )}
            {savings > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Product savings</span>
                <span>−{inr(savings)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span>
              <span>{inr(total)}</span>
            </div>
          </div>

          {/* Coupon */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (coupon.toUpperCase() === "SREESM50") {
                setDiscount(50);
                toast.success("Coupon applied", { description: "₹50 off your order" });
              } else {
                toast.error("Invalid coupon");
              }
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Tag className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                placeholder="Coupon code"
                className="h-10 rounded-full pl-9"
              />
            </div>
            <Button type="submit" variant="outline" className="rounded-full">Apply</Button>
          </form>
          <p className="text-center text-[11px] text-muted-foreground">
            Try coupon <span className="font-bold">SREESM50</span> for ₹50 off
          </p>

          <Button asChild size="lg" className="w-full rounded-full font-semibold">
            <Link to="/checkout">
              Proceed to checkout <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-muted-foreground">
            <ShieldCheck className="h-3.5 w-3.5 text-primary" />
            100% secure payment · Encrypted checkout
          </div>
        </aside>
      </div>
    </div>
  );
}
