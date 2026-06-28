import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Image as ImageIcon,
  Info,
  IndianRupee,
  Boxes,
  Layers,
  Search,
  Sparkles,
  Save,
  Plus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/products/new")({
  component: NewProductWizard,
});

const STEPS = [
  { key: "basics", label: "Basics", icon: Info },
  { key: "pricing", label: "Pricing", icon: IndianRupee },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "variants", label: "Variants", icon: Layers },
  { key: "seo", label: "SEO", icon: Search },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "review", label: "Review", icon: Sparkles },
];

function NewProductWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [variants, setVariants] = useState<{ size: string; price: string; stock: string }[]>([
    { size: "Small", price: "199", stock: "40" },
  ]);
  const [media, setMedia] = useState<string[]>(["🥑", "📦", "🏷️"]);

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Products", to: "/admin/products" }, { label: "New" }]}
        title="Create product"
        description="Add a new SKU to the DEPART catalog."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Draft saved (demo)")}>
              <Save className="mr-2 h-4 w-4" /> Save draft
            </Button>
            <Button variant="ghost" className="rounded-xl" onClick={() => navigate({ to: "/admin/products" })}>
              Cancel
            </Button>
          </>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        {/* Stepper */}
        <aside className="col-span-12 lg:col-span-3">
          <PanelCard title="Setup" description={`Step ${step + 1} of ${STEPS.length}`}>
            <ol className="space-y-1">
              {STEPS.map((s, i) => {
                const done = i < step;
                const current = i === step;
                return (
                  <li key={s.key}>
                    <button
                      onClick={() => setStep(i)}
                      className={cn(
                        "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition",
                        current ? "bg-primary/10 text-foreground" : "hover:bg-muted",
                      )}
                    >
                      <span
                        className={cn(
                          "grid h-7 w-7 place-items-center rounded-full text-xs font-bold",
                          done ? "bg-emerald-500 text-white" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="h-3.5 w-3.5" /> : i + 1}
                      </span>
                      <span className={cn("flex-1 font-medium", !current && !done && "text-muted-foreground")}>{s.label}</span>
                      <s.icon className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                  </li>
                );
              })}
            </ol>
          </PanelCard>
        </aside>

        {/* Step body */}
        <main className="col-span-12 lg:col-span-9">
          <PanelCard title={STEPS[step].label} description="All fields support live preview.">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-5"
              >
                {step === 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Product name *"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hass Avocados" className="h-11 rounded-xl" /></Field>
                    <Field label="Brand"><Input placeholder="DEPART Select" className="h-11 rounded-xl" /></Field>
                    <Field label="Category">
                      <Select defaultValue="fnv"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {["fnv","dairy","pantry","bev","snacks","meat","bakery","frozen"].map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Supplier"><Input placeholder="Farm Fresh" className="h-11 rounded-xl" /></Field>
                    <Field label="SKU"><Input placeholder="SKU-20101" className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Barcode"><Input placeholder="8902300012345" className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Unit">
                      <Select defaultValue="pcs"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{["pcs","kg","g","L","ml","pack"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="Weight (kg)"><Input type="number" placeholder="0.5" className="h-11 rounded-xl" /></Field>
                    <div className="md:col-span-2"><Field label="Description"><Textarea placeholder="Short, customer-facing description…" className="min-h-[100px] rounded-xl" /></Field></div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Cost price *"><CurrencyInput placeholder="120" /></Field>
                    <Field label="Selling price *"><CurrencyInput placeholder="189" /></Field>
                    <Field label="MRP"><CurrencyInput placeholder="219" /></Field>
                    <Field label="Discount %"><Input type="number" placeholder="10" className="h-11 rounded-xl" /></Field>
                    <Field label="Tax (%)">
                      <Select defaultValue="5"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{["0","5","12","18","28"].map((t) => <SelectItem key={t} value={t}>{t}%</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="HSN code"><Input placeholder="0804" className="h-11 rounded-xl font-mono" /></Field>
                    <div className="md:col-span-2 rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm">
                      <p className="font-semibold">Projected margin · 36.8%</p>
                      <p className="text-xs text-muted-foreground">Auto-computed from cost and selling price.</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Opening stock"><Input type="number" placeholder="120" className="h-11 rounded-xl" /></Field>
                    <Field label="Reorder threshold"><Input type="number" placeholder="20" className="h-11 rounded-xl" /></Field>
                    <Field label="Warehouse">
                      <Select defaultValue="BOM-DK1"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{["BOM-DK1","BOM-FH1","BLR-DK1","DEL-CS1","PNQ-HB1"].map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="Shelf life (days)"><Input type="number" placeholder="14" className="h-11 rounded-xl" /></Field>
                    <Field label="Manufacturing date"><Input type="date" className="h-11 rounded-xl" /></Field>
                    <Field label="Expiry date"><Input type="date" className="h-11 rounded-xl" /></Field>
                    <div className="md:col-span-2"><Field label="Storage instructions"><Textarea placeholder="Refrigerate at 2–4°C" className="min-h-[80px] rounded-xl" /></Field></div>
                    <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4">
                      <div>
                        <p className="text-sm font-semibold">Track batches & lots</p>
                        <p className="text-xs text-muted-foreground">Required for FEFO and expiry reports.</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="space-y-3">
                    <div className="flex flex-wrap gap-2">
                      {["Color","Size","Weight","Pack","Volume","Quantity"].map((t) => (
                        <span key={t} className="rounded-full border border-border/60 bg-muted/40 px-3 py-1 text-xs font-semibold">{t}</span>
                      ))}
                    </div>
                    <div className="overflow-hidden rounded-2xl border border-border/60">
                      <table className="w-full text-sm">
                        <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                          <tr><th className="px-3 py-2 text-left">Variant</th><th className="px-3 py-2 text-left">SKU</th><th className="px-3 py-2 text-left">Price</th><th className="px-3 py-2 text-left">Stock</th><th /></tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {variants.map((v, i) => (
                            <tr key={i}>
                              <td className="px-3 py-2"><Input value={v.size} onChange={(e) => updateVar(i, "size", e.target.value)} className="h-9 rounded-lg" /></td>
                              <td className="px-3 py-2"><Input value={`SKU-V${1000 + i}`} readOnly className="h-9 rounded-lg font-mono" /></td>
                              <td className="px-3 py-2"><CurrencyInput value={v.price} onChange={(e) => updateVar(i, "price", e.target.value)} /></td>
                              <td className="px-3 py-2"><Input value={v.stock} onChange={(e) => updateVar(i, "stock", e.target.value)} className="h-9 rounded-lg" /></td>
                              <td className="px-3 py-2"><Button variant="ghost" size="icon" onClick={() => setVariants((arr) => arr.filter((_, k) => k !== i))}><X className="h-4 w-4" /></Button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <Button variant="outline" className="rounded-xl" onClick={() => setVariants((a) => [...a, { size: "New", price: "0", stock: "0" }])}>
                      <Plus className="mr-2 h-4 w-4" /> Add variant
                    </Button>
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="SEO title"><Input placeholder="Buy Hass Avocados online | DEPART" className="h-11 rounded-xl" /></Field>
                    <Field label="Meta description"><Textarea placeholder="Premium Hass avocados delivered in 10 minutes." className="min-h-[80px] rounded-xl" /></Field>
                    <Field label="URL slug"><Input placeholder="hass-avocados" className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Tags"><Input placeholder="organic, premium, breakfast" className="h-11 rounded-xl" /></Field>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-10 text-center">
                      <ImageIcon className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm font-semibold">Drop product photos here</p>
                      <p className="text-xs text-muted-foreground">PNG / JPG / WebP up to 10MB. We auto-compress and serve via CDN.</p>
                      <Button className="mt-3 rounded-xl" onClick={() => setMedia((m) => [...m, "📸"])}>Browse files</Button>
                    </div>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                      {media.map((e, i) => (
                        <div key={i} className={cn("relative grid aspect-square place-items-center rounded-2xl border border-border/60 bg-card text-4xl", i === 0 && "ring-2 ring-primary")}>
                          {e}
                          {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">PRIMARY</span>}
                          <button onClick={() => setMedia((m) => m.filter((_, k) => k !== i))} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background/90 text-muted-foreground hover:bg-rose-500 hover:text-white"><X className="h-3 w-3" /></button>
                        </div>
                      ))}
                    </div>
                    <div className="flex flex-wrap gap-2 text-xs">
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">Crop</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">WebP</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">Cloudinary</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">Compression</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">Video</span>
                      <span className="rounded-full bg-muted px-2 py-0.5 font-semibold">360°</span>
                    </div>
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-4">
                    <div className="rounded-2xl bg-emerald-500/10 p-4 text-sm text-emerald-700 dark:text-emerald-300">
                      <Check className="mb-1 inline h-4 w-4" /> All required fields look great. Ready to publish.
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <ReviewRow k="Product" v={name || "—"} />
                      <ReviewRow k="Brand" v="DEPART Select" />
                      <ReviewRow k="Category" v="Fruits & Veg" />
                      <ReviewRow k="Price" v="₹189" />
                      <ReviewRow k="Cost" v="₹120 (36.8% margin)" />
                      <ReviewRow k="Stock" v="120 @ BOM-DK1" />
                      <ReviewRow k="Variants" v={`${variants.length}`} />
                      <ReviewRow k="Media" v={`${media.length} files`} />
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <div className="mt-6 flex items-center justify-between border-t border-border/60 pt-4">
              <Button variant="ghost" className="rounded-xl" disabled={step === 0} onClick={() => setStep((s) => Math.max(0, s - 1))}>
                <ArrowLeft className="mr-2 h-4 w-4" /> Back
              </Button>
              {step < STEPS.length - 1 ? (
                <Button className="rounded-xl" onClick={() => setStep((s) => Math.min(STEPS.length - 1, s + 1))}>
                  Continue <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button className="rounded-xl" onClick={() => { toast.success("Product published"); navigate({ to: "/admin/products" }); }}>
                  <Check className="mr-2 h-4 w-4" /> Publish product
                </Button>
              )}
            </div>
          </PanelCard>
        </main>
      </div>
    </div>
  );

  function updateVar(i: number, k: "size" | "price" | "stock", v: string) {
    setVariants((arr) => arr.map((x, j) => (j === i ? { ...x, [k]: v } : x)));
  }
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <Label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function CurrencyInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className="relative">
      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">₹</span>
      <Input {...props} className="h-11 rounded-xl pl-7" />
    </div>
  );
}

function ReviewRow({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl border border-border/60 bg-muted/30 px-4 py-2.5">
      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{k}</span>
      <span className="text-sm font-semibold">{v}</span>
    </div>
  );
}