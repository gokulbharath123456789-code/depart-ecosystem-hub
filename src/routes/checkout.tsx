import { createFileRoute, Link, useNavigate, useRouter } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Check, MapPin, Clock, CreditCard, Wallet, Banknote, Smartphone, ShieldCheck, PartyPopper, Plus } from "lucide-react";
import { useCart } from "@/store/cart";
import { useProducts } from "@/features/catalog/hooks";
import { useAddresses, useUpsertAddress } from "@/features/addresses/hooks";
import { usePlaceOrder } from "@/features/orders/hooks";
import { previewCoupon, type PaymentMethod } from "@/features/orders/api";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { inr } from "@/lib/format";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Checkout — SREE SUPER MART" }, { name: "description", content: "Complete your SREE SUPER MART order securely." }] }),
  component: Checkout,
});

const steps = ["Address", "Delivery", "Payment", "Review"] as const;

function Checkout() {
  const router = useRouter();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const items = useCart((s) => s.items);
  const clear = useCart((s) => s.clear);
  const [step, setStep] = useState(0);
  const [placedNumber, setPlacedNumber] = useState<string | null>(null);
  const [slot, setSlot] = useState<"express" | "standard" | "evening" | "tomorrow">("express");
  const [pay, setPay] = useState<PaymentMethod>("upi");
  const [addressId, setAddressId] = useState<string | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [newAddrOpen, setNewAddrOpen] = useState(false);

  const productsQ = useProducts();
  const addressesQ = useAddresses();
  const placeOrderM = usePlaceOrder();
  const upsertAddrM = useUpsertAddress();

  useEffect(() => {
    if (!authLoading && !user) navigate({ to: "/auth", search: { redirect: "/checkout" } as never });
  }, [authLoading, user, navigate]);

  useEffect(() => {
    if (!addressId && addressesQ.data?.length) {
      setAddressId(addressesQ.data.find((a) => a.is_default)?.id ?? addressesQ.data[0].id);
    }
  }, [addressesQ.data, addressId]);

  const productMap = useMemo(() => {
    const m = new Map<string, NonNullable<typeof productsQ.data>[number]>();
    (productsQ.data ?? []).forEach((p) => m.set(p.id, p));
    return m;
  }, [productsQ.data]);

  const detailed = items
    .map((i) => {
      const p = productMap.get(i.productId);
      return p ? { item: i, product: p } : null;
    })
    .filter((x): x is NonNullable<typeof x> => !!x);

  const subtotal = detailed.reduce((s, x) => s + Number(x.product.price) * x.item.qty, 0);
  const delivery = slot === "express" ? 49 : subtotal >= 499 ? 0 : 39;
  const tax = Math.round(subtotal * 0.05);
  const total = Math.max(0, subtotal + delivery + tax - couponDiscount);

  async function applyCoupon() {
    if (!coupon.trim()) return;
    const res = await previewCoupon(coupon, subtotal);
    if (res.ok) {
      setCouponDiscount(res.discount);
      setCouponMsg(`Applied — you save ${inr(res.discount)}`);
      toast.success("Coupon applied");
    } else {
      setCouponDiscount(0);
      setCouponMsg(res.reason ?? "Invalid coupon");
      toast.error(res.reason ?? "Invalid coupon");
    }
  }

  async function submit() {
    if (!addressId) return toast.error("Select an address");
    if (detailed.length === 0) return toast.error("Cart is empty");
    try {
      const order = await placeOrderM.mutateAsync({
        addressId,
        items: detailed.map((d) => ({ product_id: d.product.id, qty: d.item.qty })),
        paymentMethod: pay,
        deliverySlot: slot,
        couponCode: coupon.trim() || undefined,
      });
      setPlacedNumber(order.order_number);
      clear();
      toast.success("Order placed", { description: order.order_number });
    } catch (e) {
      toast.error((e as Error).message ?? "Failed to place order");
    }
  }

  if (placedNumber) {
    return (
      <div className="mx-auto grid max-w-2xl place-items-center px-4 py-20 text-center">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 220, damping: 18 }}
          className="grid h-28 w-28 place-items-center rounded-full bg-primary/15 text-primary"
        >
          <PartyPopper className="h-14 w-14" />
        </motion.div>
        <h1 className="mt-6 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
          Order placed!
        </h1>
        <p className="mt-2 max-w-md text-muted-foreground">
          Thank you for shopping with SREE SUPER MART. Your order{" "}
          <span className="font-bold text-foreground">{placedNumber}</span> is confirmed and on its
          way. Estimated arrival in ~{slot === "express" ? "10" : "60"} minutes.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button asChild size="lg" className="rounded-full px-7">
            <Link to="/account/orders">Track my order</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="rounded-full px-7">
            <Link to="/">Continue shopping</Link>
          </Button>
        </div>
        <div className="mt-10 grid w-full max-w-md grid-cols-3 gap-3 text-left">
          {[
            { icon: MapPin, label: "Delivering to", value: addressesQ.data?.find((a) => a.id === addressId)?.label ?? "Saved address" },
            { icon: Clock, label: "Slot", value: slot === "express" ? "Express · 10 min" : slot === "standard" ? "Standard · 60 min" : slot === "evening" ? "Evening · 6-9 PM" : "Tomorrow · 9-12 PM" },
            { icon: CreditCard, label: "Payment", value: pay.toUpperCase() },
          ].map((x) => (
            <div key={x.label} className="rounded-2xl border border-border bg-card p-4">
              <x.icon className="h-4 w-4 text-primary" />
              <p className="mt-2 text-[11px] uppercase tracking-wider text-muted-foreground">{x.label}</p>
              <p className="text-sm font-bold">{x.value}</p>
            </div>
          ))}
        </div>
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
            <AddressStep
              addresses={addressesQ.data ?? []}
              selected={addressId}
              onSelect={setAddressId}
              onCreate={async (a) => {
                const created = await upsertAddrM.mutateAsync(a);
                setAddressId(created.id);
                setNewAddrOpen(false);
              }}
              creating={upsertAddrM.isPending}
              open={newAddrOpen}
              setOpen={setNewAddrOpen}
            />
          )}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-display text-xl font-bold">Delivery slot</h2>
              <RadioGroup value={slot} onValueChange={(v) => setSlot(v as typeof slot)} className="grid gap-3 sm:grid-cols-2">
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
              <RadioGroup value={pay} onValueChange={(v) => setPay(v as PaymentMethod)} className="space-y-2">
                {[
                  { id: "upi", icon: Smartphone, label: "UPI", sub: "GPay, PhonePe, Paytm" },
                  { id: "card", icon: CreditCard, label: "Credit / Debit Card", sub: "Visa, Mastercard, RuPay" },
                  { id: "wallet", icon: Wallet, label: "SREE SUPER MART Wallet", sub: "Balance: ₹420" },
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
                <ShieldCheck className="h-4 w-4" /> Razorpay integration prepared — currently confirming without gateway.
              </div>
              <div>
                <Label className="text-xs">Coupon code</Label>
                <div className="mt-1 flex gap-2">
                  <Input value={coupon} onChange={(e) => setCoupon(e.target.value)} placeholder="e.g. SREESM50" className="rounded-xl" />
                  <Button type="button" variant="outline" className="rounded-xl" onClick={applyCoupon}>Apply</Button>
                </div>
                {couponMsg && <p className="mt-1 text-xs text-muted-foreground">{couponMsg}</p>}
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-5">
              <h2 className="font-display text-xl font-bold">Review your order</h2>
              {(() => {
                const a = addressesQ.data?.find((x) => x.id === addressId);
                if (!a) return <p className="text-sm text-muted-foreground">No address selected.</p>;
                return (
                  <div className="rounded-xl border border-border p-4 text-sm">
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 h-4 w-4 text-primary" />
                      <div>
                        <div className="font-bold">{a.full_name}</div>
                        <div className="text-muted-foreground">
                          {a.line1}{a.line2 ? ", " + a.line2 : ""}, {a.city}, {a.state} {a.pincode}
                        </div>
                        <div className="text-xs text-muted-foreground">{a.phone}</div>
                      </div>
                    </div>
                  </div>
                );
              })()}
              <ul className="divide-y divide-border rounded-xl border border-border">
                {detailed.map(({ item, product }) => (
                  <li key={product.id} className="flex items-center gap-3 p-3 text-sm">
                    <ProductMedia
                      emoji="🛍️"
                      gradient="from-primary/20 to-primary/5"
                      size="sm"
                      className="h-12 w-12"
                      imageUrl={product.images?.[0]?.url}
                    />
                    <div className="flex-1">
                      <div className="font-semibold">{product.name}</div>
                      <div className="text-xs text-muted-foreground">Qty {item.qty} · {product.unit}</div>
                    </div>
                    <div className="font-bold">{inr(Number(product.price) * item.qty)}</div>
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
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 0 && !addressId}
                className="rounded-full px-6 font-semibold"
              >
                Continue
              </Button>
            ) : (
              <Button
                onClick={submit}
                disabled={placeOrderM.isPending}
                size="lg"
                className="rounded-full px-8 font-semibold"
              >
                {placeOrderM.isPending ? "Placing…" : `Place order · ${inr(total)}`}
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
            {couponDiscount > 0 && (
              <li className="flex justify-between text-emerald-600"><span>Coupon</span><span>− {inr(couponDiscount)}</span></li>
            )}
            <li className="flex justify-between border-t border-border pt-2 text-base font-bold"><span>Total</span><span>{inr(total)}</span></li>
          </ul>
        </aside>
      </div>
    </div>
  );
}

function AddressStep({
  addresses,
  selected,
  onSelect,
  onCreate,
  creating,
  open,
  setOpen,
}: {
  addresses: import("@/features/addresses/api").DbAddress[];
  selected: string | null;
  onSelect: (id: string) => void;
  onCreate: (a: import("@/features/addresses/api").AddressInput) => void;
  creating: boolean;
  open: boolean;
  setOpen: (v: boolean) => void;
}) {
  const [form, setForm] = useState({
    label: "Home",
    full_name: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    is_default: addresses.length === 0,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-xl font-bold">Delivery address</h2>
        <Button variant="outline" size="sm" className="rounded-full" onClick={() => setOpen(!open)}>
          <Plus className="mr-1 h-4 w-4" /> {open ? "Cancel" : "New address"}
        </Button>
      </div>
      {addresses.length === 0 && !open && (
        <p className="text-sm text-muted-foreground">
          You have no saved addresses yet. Add one to continue.
        </p>
      )}
      <RadioGroup value={selected ?? ""} onValueChange={onSelect} className="grid gap-2">
        {addresses.map((a) => (
          <Label
            key={a.id}
            htmlFor={a.id}
            className={cn(
              "flex cursor-pointer items-start gap-3 rounded-2xl border border-border p-4 transition hover:border-primary",
              selected === a.id && "border-primary bg-primary/5 ring-2 ring-primary/30",
            )}
          >
            <RadioGroupItem value={a.id} id={a.id} className="mt-1" />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" />
                <span className="font-bold">{a.label}</span>
                {a.is_default && <span className="rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">Default</span>}
              </div>
              <div className="mt-1 text-sm">{a.full_name} — {a.phone}</div>
              <div className="text-xs text-muted-foreground">
                {a.line1}{a.line2 ? ", " + a.line2 : ""}, {a.city}, {a.state} {a.pincode}
              </div>
            </div>
          </Label>
        ))}
      </RadioGroup>
      {open && (
        <div className="grid gap-3 rounded-2xl border border-border p-4 sm:grid-cols-2">
          <div><Label>Label</Label><Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><Label>Full name</Label><Input value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><Label>Pincode</Label><Input value={form.pincode} onChange={(e) => setForm({ ...form, pincode: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div className="sm:col-span-2"><Label>Address line 1</Label><Input value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div className="sm:col-span-2"><Label>Address line 2</Label><Input value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div><Label>State</Label><Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="mt-1 rounded-xl" /></div>
          <div className="sm:col-span-2 flex justify-end">
            <Button
              disabled={creating || !form.full_name || !form.phone || !form.line1 || !form.city || !form.state || !form.pincode}
              onClick={() => onCreate({ ...form, user_id: "" } as never)}
              className="rounded-full"
            >
              {creating ? "Saving…" : "Save address"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}