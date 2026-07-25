import { Link } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, ShoppingBag, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { productById } from "@/mock/products";
import { inr } from "@/lib/format";
import { ProductMedia } from "@/components/storefront/ProductMedia";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const setOpen = useUI((s) => s.setCartOpen);
  const items = useCart((s) => s.items);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);

  const detailed = items
    .map((i) => ({ item: i, product: productById(i.productId) }))
    .filter((x): x is { item: typeof x.item; product: NonNullable<typeof x.product> } => !!x.product);

  const subtotal = detailed.reduce((s, x) => s + x.product.price * x.item.qty, 0);
  const delivery = subtotal >= 499 || subtotal === 0 ? 0 : 39;
  const total = subtotal + delivery;

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 32 }}
            className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col bg-background"
          >
            <header className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <h2 className="font-display text-lg font-bold">Your Cart</h2>
                <p className="text-xs text-muted-foreground">
                  {detailed.length === 0 ? "Empty" : `${detailed.length} item${detailed.length > 1 ? "s" : ""}`}
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-muted"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </header>

            {detailed.length === 0 ? (
              <div className="flex flex-1 flex-col items-center justify-center px-5 text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
                  <ShoppingBag className="h-9 w-9 text-muted-foreground" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold">Cart's empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">Find something delicious.</p>
                <Button asChild className="mt-6 rounded-full">
                  <Link to="/shop" onClick={() => setOpen(false)}>Start shopping</Link>
                </Button>
              </div>
            ) : (
              <>
                <div className="flex-1 overflow-y-auto px-5 py-4">
                  <ul className="space-y-3">
                    {detailed.map(({ item, product }) => (
                      <li
                        key={product.id}
                        className="flex gap-3 rounded-2xl border border-border bg-card p-3"
                      >
                        <ProductMedia
                          emoji={product.emoji}
                          gradient={product.gradient}
                          size="sm"
                          className="h-16 w-16 shrink-0"
                        />
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <div className="truncate text-sm font-semibold">{product.name}</div>
                              <div className="text-xs text-muted-foreground">{product.unit}</div>
                            </div>
                            <button
                              onClick={() => remove(product.id)}
                              className="text-muted-foreground hover:text-destructive"
                              aria-label="Remove"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                          <div className="mt-auto flex items-center justify-between">
                            <div className="flex items-center gap-1 rounded-full bg-muted p-1">
                              <button
                                onClick={() => setQty(product.id, item.qty - 1)}
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-background"
                                aria-label="Decrease"
                              >
                                <Minus className="h-3 w-3" />
                              </button>
                              <span className="min-w-5 text-center text-xs font-bold tabular-nums">
                                {item.qty}
                              </span>
                              <button
                                onClick={() => setQty(product.id, item.qty + 1)}
                                className="grid h-6 w-6 place-items-center rounded-full hover:bg-background"
                                aria-label="Increase"
                              >
                                <Plus className="h-3 w-3" />
                              </button>
                            </div>
                            <div className="text-sm font-bold">{inr(product.price * item.qty)}</div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-3 border-t border-border bg-muted/40 px-5 py-4">
                  <div className="space-y-1.5 text-sm">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span className="text-foreground">{inr(subtotal)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Delivery</span>
                      <span className={delivery === 0 ? "font-semibold text-primary" : "text-foreground"}>
                        {delivery === 0 ? "FREE" : inr(delivery)}
                      </span>
                    </div>
                    <div className="flex justify-between border-t border-border pt-2 text-base font-bold">
                      <span>Total</span>
                      <span>{inr(total)}</span>
                    </div>
                  </div>
                  <Button asChild size="lg" className="w-full rounded-full font-semibold">
                    <Link to="/checkout" onClick={() => setOpen(false)}>
                      Proceed to checkout · {inr(total)}
                    </Link>
                  </Button>
                </div>
              </>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}