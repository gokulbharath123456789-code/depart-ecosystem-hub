import { createFileRoute, Link, useRouter } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Check, MapPin, Clock, CreditCard, Wallet, Banknote, Smartphone, ShieldCheck, PartyPopper } from "lucide-react";
import { useCart } from "@/store/cart";
import { productById } from "@/mock/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — DEPART" }, { name: "description", content: "Complete your DEPART order securely." }] }),
  component: Checkout,
});

const steps = ["Address", "Delivery", "Payment", "Review"] as const;

function Checkout() {
  const router = useRouter();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [done, setDone] = useState(false);
  const [slot, setSlot] = useState("express");
  const [pay, setPay] = useState("upi");

  const detailed = items
    .map((i) => ({ item: i, product: productById(i.productId) }))
    .filter((x): x is { item: typeof x.item; product: NonNullable<typeof x.product> } => !!x.product);

  const subtotal = detailed.reduce((s, x) => s + x.product.price * x.item.qty, 0);
  const delivery = slot === "express" ? 49 : subtotal >= 499 ? 0 : 39;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + delivery + tax;

  if (done) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="grid h-24 w-24 place-items-center rounded-full bg-primary/15 text-primary"
        >
          <PartyPopper className="h-12 w-12" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-extrabold">Order placed!</h1>
        <p className="mt-2 text-muted-foreground">
          Your order <span className="font-bold text-foreground">#DPT-{Math.floor(Math.random() * 90000 + 10000)}</span> is on its way. ETA ~{slot === "express" ? "10" : "60"} mins.
        </p>
        <Button asChild size="lg" className="mt-6 rounded-full"><Link to="/">Back to home</Link></Button>
      </div>
    );
  }

  if (detailed.length === 0) {
    return (
      <div className="mx-auto grid max-w-xl place-items-center px-4 py-24 text-center">
        <h1 className="font-display text-2xl font-bold">Your cart is empty</h1>
        <Button asChild className="mt-4 rounded-full"><Link to="/shop">Start shopping</Link></Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-8 flex items-center justify-between gap-4">
        <h1 className="font-display text-3xl font-extrabold">Checkout</h1>
        <button onClick={() => router.history.back()} className="text-sm text-muted-foreground hover:text-foreground">
          ← Back
        </button>
      </div>

      {/* Stepper */}
      <div className="mb-8 flex items-center gap-2 overflow-x-auto">
        {steps.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={cn(
                "grid h-9 w-9 place-items-center rounded-full font-bold transition",
                i < step && "bg-primary text-primary-foreground",
                i === step && "bg-foreground text-background",
                i > step && "bg-muted text-muted-foreground",
              )}
            >
              {i < step ? <Check className="h-4 w-4" /> : i + 1}
            </div>
            <span className={cn("text-sm font-semibold", i === step ? "text-foreground" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <div className="mx-2 h-px w-6 bg-border sm:w-12" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-border bg-card p-6"
        >
          {step === 0 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Delivery address</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div><Label>Full name</Label><Input className="mt-1 rounded-xl" defaultValue="Ananya Rao" /></div>
                <div><Label>Phone</Label><Input className="mt-1 rounded-xl" defaultValue="+91 98765 43210" /></div>
                <div className="sm:col-span-2"><Label>Address line</Label><Input className="mt-1 rounded-xl" defaultValue="A-1204, Marine Heights" /></div>
                <div><Label>City</Label><Input className="mt-1 rounded-xl" defaultValue="Mumbai" /></div>
                <div><Label>Pincode</Label><Input className="mt-1 rounded-xl" defaultValue="400001" /></div>
              </div>
            </div>
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Delivery slot</h2>
              <RadioGroup value={slot} onValueChange={setSlot} className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "express", label: "Express", sub: "Within 10 minutes", price: "₹49" },
                  { id: "standard", label: "Standard", sub: "Within 60 minutes", price: "FREE on ₹499+" },
                  { id: "evening", label: "Evening", sub: "6 PM – 9 PM today", price: "FREE" },
                  { id: "tomorrow", label: "Tomorrow", sub: "9 AM – 12 PM", price: "FREE" },
                ].map((s) => (
                  <Label
                    key={s.id}
                    htmlFor={s.id}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:border-primary",
                      slot === s.id && "border-primary bg-primary/5 ring-2 ring-primary/30",
                    )}
                  >
                    <RadioGroupItem value={s.id} id={s.id} className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="font-bold">{s.label}</span>
                      </div>
                      <div className="mt-0.5 text-xs text-muted-foreground">{s.sub}</div>
                      <div className="mt-2 text-xs font-bold text-primary">{s.price}</div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Payment method</h2>
              <RadioGroup value={pay} onValueChange={setPay} className="space-y-2">
                {[
                  { id: "upi", icon: Smartphone, label: "UPI", sub: "GPay, PhonePe, Paytm" },
                  { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                  { id: "wallet", icon: Wallet, label: "DEPART Wallet", sub: "Balance: ₹420" },
                  { id: "cod", icon: Banknote, label: "Cash on Delivery", sub: "Pay in cash on arrival" },
                ].map((p) => (
                  <Label
                    key={p.id}
                    htmlFor={p.id}
                    className={cn(
                      "flex cursor-pointer items-center gap-3 rounded-2xl border border-border p-4 transition hover:border-primary",
                      pay === p.id && "border-primary bg-primary/5 ring-2 ring-primary/30",
                    )}
                  >
                    <RadioGroupItem value={p.id} id={p.id} />
                    <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                      <p.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <div className="font-bold">{p.label}</div>
                      <div className="text-xs text-muted-foreground">{p.sub}</div>
                    </div>
                  </Label>
                ))}
              </RadioGroup>
              <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800">
                <ShieldCheck className="h-4 w-4" /> All payments encrypted end-to-end via Razorpay
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold">Review your order</h2>
              <div className="rounded-xl border border-border p-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                  <div>
                    <div className="font-bold">Ananya Rao</div>
                    <div className="text-muted-foreground">A-1204, Marine Heights, Mumbai 400001</div>
                  </div>
                </div>
              </div>
              <ul className="divide-y divide-border rounded-xl border border-border">
                {detailed.map(({ item, product }) => (
                  <li key={product.id} className="flex items-center gap-3 p-3 text-sm">
                    <ProductMedia emoji={product.emoji} gradient={product.gradient} size="sm" className="h-12 w-12" />
                    <div className="flex-1">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-xs text-muted-foreground">Qty {item.qty} · {product.unit}</div>
                    </div>
                    <div className="font-bold">{inr(product.price * item.qty)}</div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="mt-8 flex justify-between gap-3">
            <Button variant="ghost" onClick={() => setStep(Math.max(0, step - 1))} disabled={step === 0}>
              Previous
            </Button>
            {step < steps.length - 1 ? (
              <Button onClick={() => setStep(step + 1)} className="rounded-full px-6 font-semibold">
                Continue
              </Button>
            ) : (
              <Button
                onClick={() => { setDone(true); clear(); }}
                size="lg"
                className="rounded-full px-8 font-semibold"
              >
                Place order · {inr(total)}
              </Button>
            )}
          </div>
        </motion.div>

        <aside className="h-fit space-y-3 rounded-2xl border border-border bg-card p-5 lg:sticky lg:top-32">
          <h3 className="font-display text-lg font-bold">Summary</h3>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between text-muted-foreground"><span>Subtotal</span><span className="text-foreground">{inr(subtotal)}</span></li>
            <li className="flex justify-between text-muted-foreground"><span>Delivery</span><span className={delivery === 0 ? "text-primary" : "text-foreground"}>{delivery === 0 ? "FREE" : inr(delivery)}</span></li>
            <li className="flex justify-between text-muted-foreground"><span>Tax (5% GST)</span><span className="text-foreground">{inr(tax)}</span></li>
            <li className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{inr(total)}</span></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}