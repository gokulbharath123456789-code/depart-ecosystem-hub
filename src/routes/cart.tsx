import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight, Tag } from "lucide-react";
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

  if (detailed.length === 0) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center">
        <div className="grid h-24 w-24 place-items-center rounded-full bg-muted">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 text-muted-foreground">Discover thousands of products waiting for you.</p>
        <Button asChild size="lg" className="mt-6 rounded-full">
          <Link to="/shop">Continue shopping <ArrowRight className="h-4 w-4" /></Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Your cart</h1>
      <p className="mt-1 text-sm text-muted-foreground">{detailed.length} item{detailed.length > 1 ? "s" : ""}</p>

      <div className="mt-6 grid gap-8 lg:grid-cols-[1.6fr_1fr]">
        <div className="space-y-3">
          {detailed.map(({ item, product }) => (
            <div key={product.id} className="flex gap-4 rounded-2xl border border-border bg-card p-4">
              <Link to="/product/$slug" params={{ slug: product.slug }}>
                <ProductMedia emoji={product.emoji} gradient={product.gradient} size="md" className="h-24 w-24" />
              </Link>
              <div className="flex flex-1 flex-col gap-2">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Link to="/product/$slug" params={{ slug: product.slug }} className="font-semibold hover:text-primary">
                      {product.name}
                    </Link>
                    <div className="text-xs text-muted-foreground">{product.brand} · {product.unit}</div>
                  </div>
                  <button onClick={() => remove(product.id)} className="text-muted-foreground hover:text-destructive" aria-label="Remove">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-auto flex items-center justify-between">
                  <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                    <button onClick={() => setQty(product.id, item.qty - 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background"><Minus className="h-3 w-3" /></button>
                    <span className="min-w-6 text-center text-sm font-bold tabular-nums">{item.qty}</span>
                    <button onClick={() => setQty(product.id, item.qty + 1)} className="grid h-7 w-7 place-items-center rounded-full hover:bg-background"><Plus className="h-3 w-3" /></button>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{inr(product.price * item.qty)}</div>
                    <div className="text-xs text-muted-foreground">{inr(product.price)} each</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <div className="flex justify-end">
            <Button variant="ghost" onClick={clear} className="text-muted-foreground">
              <Trash2 className="h-4 w-4" /> Clear cart
            </Button>
          </div>
        </div>

        <aside className="h-fit space-y-4 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-32">
          <h3 className="font-display text-lg font-bold">Order summary</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-muted-foreground">
              <span>Subtotal</span><span className="text-foreground">{inr(subtotal)}</span>
            </div>
            <div className="flex justify-between text-muted-foreground">
              <span>Delivery</span>
              <span className={delivery === 0 ? "font-semibold text-primary" : "text-foreground"}>
                {delivery === 0 ? "FREE" : inr(delivery)}
              </span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600">
                <span>Coupon</span><span>−{inr(discount)}</span>
              </div>
            )}
            <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
              <span>Total</span><span>{inr(total)}</span>
            </div>
          </div>

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

          <Button asChild size="lg" className="w-full rounded-full font-semibold">
            <Link to="/checkout">Checkout · {inr(total)}</Link>
          </Button>
          <p className="text-center text-[11px] text-muted-foreground">
            Try coupon <span className="font-bold">SREESM50</span> for ₹50 off
          </p>
        </aside>
      </div>
    </div>
  );
}