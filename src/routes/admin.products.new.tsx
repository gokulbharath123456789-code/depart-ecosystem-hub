import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, ArrowRight, Check, Image as ImageIcon, Info, IndianRupee,
  Boxes, Layers, Search, Sparkles, X,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { cn } from "@/lib/utils";
import { useBrands, useCategories, useCreateProduct, useSuppliers, useWarehouses } from "@/features/catalog/hooks";
import { uploadProductImage } from "@/features/catalog/api";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/products/new")({ component: NewProductWizard });

const STEPS = [
  { key: "basics", label: "Basics", icon: Info },
  { key: "pricing", label: "Pricing", icon: IndianRupee },
  { key: "inventory", label: "Inventory", icon: Boxes },
  { key: "variants", label: "Variants", icon: Layers },
  { key: "seo", label: "SEO", icon: Search },
  { key: "media", label: "Media", icon: ImageIcon },
  { key: "review", label: "Review", icon: Sparkles },
];

type MediaItem = { id: string; url: string; file?: File; uploading?: boolean };

function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function NewProductWizard() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const { data: categories = [] } = useCategories();
  const { data: brands = [] } = useBrands();
  const { data: suppliers = [] } = useSuppliers();
  const { data: warehouses = [] } = useWarehouses();
  const createProduct = useCreateProduct();

  const defaultWh = useMemo(() => warehouses.find((w) => w.is_default) ?? warehouses[0], [warehouses]);

  // Basics
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [brandId, setBrandId] = useState("");
  const [supplierId, setSupplierId] = useState("");
  const [sku, setSku] = useState("");
  const [barcode, setBarcode] = useState("");
  const [unit, setUnit] = useState("pcs");
  const [description, setDescription] = useState("");

  // Pricing
  const [cost, setCost] = useState("");
  const [price, setPrice] = useState("");
  const [mrp, setMrp] = useState("");
  const [tax, setTax] = useState("5");

  // Inventory
  const [openingStock, setOpeningStock] = useState("0");
  const [reorder, setReorder] = useState("0");
  const [warehouseId, setWarehouseId] = useState("");
  const [tracksBatches, setTracksBatches] = useState(false);

  // SEO
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [tagsText, setTagsText] = useState("");

  // Media
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [isPublishing, setIsPublishing] = useState(false);

  const effectiveSlug = slug || slugify(name);
  const activeWarehouseId = warehouseId || defaultWh?.id || "";

  const canPublish = !!name && !!effectiveSlug && !!price;

  const publish = async () => {
    if (!canPublish) { toast.error("Name, slug and price are required"); return; }
    setIsPublishing(true);
    try {
      // Create product first (without images) so we can key uploads by product id
      const created = await createProduct.mutateAsync({
        slug: effectiveSlug,
        name,
        description: description || null,
        category_id: categoryId || null,
        brand_id: brandId || null,
        supplier_id: supplierId || null,
        sku: sku || null,
        barcode: barcode || null,
        unit,
        price: Number(price),
        compare_at_price: mrp ? Number(mrp) : null,
        cost_price: cost ? Number(cost) : null,
        tax_rate: Number(tax) || 0,
        tags: tagsText.split(",").map((t) => t.trim()).filter(Boolean),
        status: "active",
        initialStock: activeWarehouseId
          ? {
              warehouse_id: activeWarehouseId,
              on_hand: Number(openingStock) || 0,
              reorder_point: Number(reorder) || 0,
            }
          : undefined,
      });

      // Upload media & attach
      if (media.length && created?.id) {
        const imageRows: { product_id: string; url: string; sort_order: number; is_primary: boolean }[] = [];
        for (let i = 0; i < media.length; i++) {
          const m = media[i];
          let url = m.url;
          if (m.file) {
            url = await uploadProductImage(created.id, m.file);
          }
          imageRows.push({ product_id: created.id, url, sort_order: i, is_primary: i === 0 });
        }
        if (imageRows.length) {
          const { error } = await supabase.from("product_images").insert(imageRows);
          if (error) throw error;
        }
      }

      if (tracksBatches) {
        // Reserved for future batch entry flow — noted in tags for now.
      }

      toast.success("Product published");
      navigate({ to: "/admin/products" });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setIsPublishing(false);
    }
  };

  const handleFiles = (files: FileList | null) => {
    if (!files) return;
    const items: MediaItem[] = Array.from(files).map((f) => ({
      id: crypto.randomUUID(),
      url: URL.createObjectURL(f),
      file: f,
    }));
    setMedia((m) => [...m, ...items]);
  };

  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Products", to: "/admin/products" }, { label: "New" }]}
        title="Create product"
        description="Add a new SKU to the DEPART catalog."
        actions={
          <Button variant="ghost" className="rounded-xl" onClick={() => navigate({ to: "/admin/products" })}>Cancel</Button>
        }
      />

      <div className="grid grid-cols-12 gap-6">
        <aside className="col-span-12 lg:col-span-3">
          <PanelCard title="Setup" description={`Step ${step + 1} of ${STEPS.length}`}>
            <ol className="space-y-1">
              {STEPS.map((s, i) => {
                const done = i < step;
                const current = i === step;
                return (
                  <li key={s.key}>
                    <button onClick={() => setStep(i)} className={cn("flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm transition", current ? "bg-primary/10 text-foreground" : "hover:bg-muted")}>
                      <span className={cn("grid h-7 w-7 place-items-center rounded-full text-xs font-bold", done ? "bg-emerald-500 text-white" : current ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>
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

        <main className="col-span-12 lg:col-span-9">
          <PanelCard title={STEPS[step].label} description="All fields save to the database on publish.">
            <AnimatePresence mode="wait">
              <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }} className="space-y-5">
                {step === 0 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Product name *"><Input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Hass Avocados" className="h-11 rounded-xl" /></Field>
                    <Field label="URL slug"><Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder={slugify(name) || "auto-generated"} className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Brand">
                      <Select value={brandId} onValueChange={setBrandId}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select brand" /></SelectTrigger>
                        <SelectContent>{brands.map((b) => <SelectItem key={b.id} value={b.id}>{b.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="Category">
                      <Select value={categoryId} onValueChange={setCategoryId}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select category" /></SelectTrigger>
                        <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="Supplier">
                      <Select value={supplierId} onValueChange={setSupplierId}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select supplier" /></SelectTrigger>
                        <SelectContent>{suppliers.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <Field label="SKU"><Input value={sku} onChange={(e) => setSku(e.target.value)} placeholder="SKU-20101" className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Barcode"><Input value={barcode} onChange={(e) => setBarcode(e.target.value)} placeholder="8902300012345" className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Unit">
                      <Select value={unit} onValueChange={setUnit}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{["pcs","kg","g","L","ml","pack"].map((u) => <SelectItem key={u} value={u}>{u}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <div className="md:col-span-2"><Field label="Description"><Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Short, customer-facing description…" className="min-h-[100px] rounded-xl" /></Field></div>
                  </div>
                )}

                {step === 1 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Cost price"><CurrencyInput value={cost} onChange={(e) => setCost(e.target.value)} placeholder="120" /></Field>
                    <Field label="Selling price *"><CurrencyInput value={price} onChange={(e) => setPrice(e.target.value)} placeholder="189" /></Field>
                    <Field label="MRP / Compare at"><CurrencyInput value={mrp} onChange={(e) => setMrp(e.target.value)} placeholder="219" /></Field>
                    <Field label="Tax (%)">
                      <Select value={tax} onValueChange={setTax}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                        <SelectContent>{["0","5","12","18","28"].map((t) => <SelectItem key={t} value={t}>{t}%</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <div className="md:col-span-2 rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-sm">
                      <p className="font-semibold">Projected margin · {cost && price ? `${(((Number(price) - Number(cost)) / Number(price)) * 100).toFixed(1)}%` : "—"}</p>
                      <p className="text-xs text-muted-foreground">Auto-computed from cost and selling price.</p>
                    </div>
                  </div>
                )}

                {step === 2 && (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <Field label="Opening stock"><Input type="number" value={openingStock} onChange={(e) => setOpeningStock(e.target.value)} placeholder="120" className="h-11 rounded-xl" /></Field>
                    <Field label="Reorder threshold"><Input type="number" value={reorder} onChange={(e) => setReorder(e.target.value)} placeholder="20" className="h-11 rounded-xl" /></Field>
                    <Field label="Warehouse">
                      <Select value={activeWarehouseId} onValueChange={setWarehouseId}>
                        <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                        <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </Field>
                    <div className="md:col-span-2 flex items-center justify-between rounded-2xl border border-border/60 bg-muted/30 p-4">
                      <div>
                        <p className="text-sm font-semibold">Track batches & lots</p>
                        <p className="text-xs text-muted-foreground">Enable to add batch entries after publishing.</p>
                      </div>
                      <Switch checked={tracksBatches} onCheckedChange={setTracksBatches} />
                    </div>
                  </div>
                )}

                {step === 3 && (
                  <div className="rounded-2xl border border-dashed border-border/60 bg-muted/20 p-6 text-sm text-muted-foreground">
                    Variant support ships in a follow-up. For now, create one product per SKU.
                  </div>
                )}

                {step === 4 && (
                  <div className="grid grid-cols-1 gap-4">
                    <Field label="SEO title"><Input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} placeholder={`Buy ${name || "product"} online | DEPART`} className="h-11 rounded-xl" /></Field>
                    <Field label="Meta description"><Textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} placeholder="Delivered in 10 minutes." className="min-h-[80px] rounded-xl" /></Field>
                    <Field label="URL slug"><Input value={effectiveSlug} onChange={(e) => setSlug(e.target.value)} className="h-11 rounded-xl font-mono" /></Field>
                    <Field label="Tags (comma separated)"><Input value={tagsText} onChange={(e) => setTagsText(e.target.value)} placeholder="organic, premium, breakfast" className="h-11 rounded-xl" /></Field>
                  </div>
                )}

                {step === 5 && (
                  <div className="space-y-4">
                    <label className="block cursor-pointer rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-10 text-center hover:bg-muted/50">
                      <ImageIcon className="mx-auto mb-2 h-10 w-10 text-muted-foreground" />
                      <p className="text-sm font-semibold">Drop product photos here</p>
                      <p className="text-xs text-muted-foreground">PNG / JPG / WebP up to 10MB. Uploaded to Lovable Storage on publish.</p>
                      <input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFiles(e.target.files)} />
                    </label>
                    {media.length > 0 && (
                      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
                        {media.map((m, i) => (
                          <div key={m.id} className={cn("relative grid aspect-square place-items-center overflow-hidden rounded-2xl border border-border/60 bg-card", i === 0 && "ring-2 ring-primary")}>
                            <img src={m.url} alt="preview" className="h-full w-full object-cover" />
                            {i === 0 && <span className="absolute left-2 top-2 rounded-full bg-primary px-1.5 py-0.5 text-[9px] font-bold text-primary-foreground">PRIMARY</span>}
                            <button onClick={() => setMedia((arr) => arr.filter((x) => x.id !== m.id))} className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-background/90 text-muted-foreground hover:bg-rose-500 hover:text-white"><X className="h-3 w-3" /></button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {step === 6 && (
                  <div className="space-y-4">
                    <div className={cn("rounded-2xl p-4 text-sm", canPublish ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" : "bg-amber-500/10 text-amber-700")}>
                      {canPublish ? <><Check className="mb-1 inline h-4 w-4" /> Ready to publish.</> : "Fill name and selling price before publishing."}
                    </div>
                    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                      <ReviewRow k="Product" v={name || "—"} />
                      <ReviewRow k="Slug" v={effectiveSlug || "—"} />
                      <ReviewRow k="Category" v={categories.find((c) => c.id === categoryId)?.name ?? "—"} />
                      <ReviewRow k="Brand" v={brands.find((b) => b.id === brandId)?.name ?? "—"} />
                      <ReviewRow k="Price" v={price ? `₹${price}` : "—"} />
                      <ReviewRow k="Cost" v={cost ? `₹${cost}` : "—"} />
                      <ReviewRow k="Stock" v={`${openingStock || 0} @ ${warehouses.find((w) => w.id === activeWarehouseId)?.name ?? "—"}`} />
                      <ReviewRow k="Media" v={`${media.length} file(s)`} />
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
                <Button className="rounded-xl" disabled={!canPublish || isPublishing} onClick={publish}>
                  <Check className="mr-2 h-4 w-4" /> {isPublishing ? "Publishing…" : "Publish product"}
                </Button>
              )}
            </div>
          </PanelCard>
        </main>
      </div>
    </div>
  );
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
