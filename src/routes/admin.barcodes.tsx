import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Printer, Search, ScanLine, Plus, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { BarcodeGenerator, QrCode } from "@/features/admin/components/erp-widgets";
import { erpProducts } from "@/features/admin/mock/erp";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/barcodes")({ component: BarcodePage });

function BarcodePage() {
  const [q, setQ] = useState("");
  const found = erpProducts.find((p) => p.barcode.includes(q) || p.sku.toLowerCase().includes(q.toLowerCase()) || p.name.toLowerCase().includes(q.toLowerCase())) ?? erpProducts[0];
  const [batch, setBatch] = useState<string[]>(erpProducts.slice(0, 12).map((p) => p.id));

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Barcode Center" }]}
        title="Barcode center"
        description="Generate, print and scan barcodes & QR codes for every SKU."
        actions={
          <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Scanner ready")}>
            <ScanLine className="mr-2 h-4 w-4" /> Open scanner
          </Button>
        }
      />

      <Tabs defaultValue="generate" className="mt-2">
        <TabsList className="rounded-xl">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="batch">Batch print</TabsTrigger>
          <TabsTrigger value="lookup">Lookup</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="mt-4 grid grid-cols-12 gap-6">
          <PanelCard title="Generator" className="col-span-12 lg:col-span-7">
            <div className="space-y-4">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by SKU, barcode or product name…" className="h-11 rounded-xl pl-9" />
              </div>
              <div className="rounded-3xl border border-border/60 bg-card p-6 text-center soft-shadow">
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="mt-1 font-display text-lg font-bold">{found.emoji} {found.name}</p>
                <p className="text-[11px] text-muted-foreground">{found.sku} · {inr(found.price)} · {found.warehouse}</p>
                <div className="mt-6 flex items-center justify-center gap-10">
                  <div className="text-foreground"><BarcodeGenerator value={found.barcode} /></div>
                  <div className="text-foreground"><QrCode value={found.barcode} /></div>
                </div>
                <div className="mt-4 flex justify-center gap-2">
                  <Button variant="outline" className="rounded-xl"><Printer className="mr-2 h-4 w-4" /> Print label</Button>
                  <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Download PNG</Button>
                </div>
              </div>
            </div>
          </PanelCard>
          <PanelCard title="Label preview" className="col-span-12 lg:col-span-5">
            <div className="mx-auto w-fit rounded-2xl border border-dashed border-border/60 bg-card p-4">
              <p className="text-xs font-semibold">DEPART</p>
              <p className="text-sm font-bold">{found.name}</p>
              <p className="text-[10px] text-muted-foreground">MRP {inr(found.mrp)} · {found.unit}</p>
              <div className="mt-2 text-foreground"><BarcodeGenerator value={found.barcode} height={40} /></div>
            </div>
          </PanelCard>
        </TabsContent>

        <TabsContent value="batch" className="mt-4">
          <PanelCard title="Batch print queue" description={`${batch.length} labels selected`} action={<Button className="rounded-xl"><Printer className="mr-2 h-4 w-4" /> Print {batch.length}</Button>}>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
              {erpProducts.slice(0, 12).map((p) => {
                const on = batch.includes(p.id);
                return (
                  <button
                    key={p.id}
                    onClick={() => setBatch((b) => on ? b.filter((x) => x !== p.id) : [...b, p.id])}
                    className={`rounded-2xl border p-3 text-left text-sm transition ${on ? "border-primary bg-primary/5" : "border-border/60 hover:bg-muted"}`}
                  >
                    <div className="flex items-center gap-2"><span className="text-xl">{p.emoji}</span><span className="truncate font-semibold">{p.name}</span></div>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{p.barcode}</p>
                    <div className="mt-2 flex items-center justify-between">
                      <Plus className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[10px] font-semibold text-muted-foreground">x1</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </PanelCard>
        </TabsContent>

        <TabsContent value="lookup" className="mt-4">
          <PanelCard title="Product & inventory lookup" description="Type or scan a barcode to view product and inventory">
            <Input placeholder="Scan or enter barcode…" className="h-11 rounded-xl font-mono" />
            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Product</p>
                <p className="font-display text-lg font-bold">{found.emoji} {found.name}</p>
                <p className="text-xs text-muted-foreground">{found.brand} · {found.category} · {found.supplier}</p>
              </div>
              <div className="rounded-2xl border border-border/60 p-4">
                <p className="text-xs text-muted-foreground">Inventory</p>
                <p className="font-display text-lg font-bold">{found.stock} units</p>
                <p className="text-xs text-muted-foreground">{found.warehouse} · {found.reserved} reserved · reorder at {found.reorder}</p>
              </div>
            </div>
          </PanelCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}