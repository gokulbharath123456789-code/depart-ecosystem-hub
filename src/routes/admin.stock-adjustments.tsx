import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Minus, ClipboardCheck, AlertTriangle, Calculator, Layers } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { ApprovalTimeline } from "@/features/admin/components/erp-widgets";
import { erpProducts, warehouses } from "@/features/admin/mock/erp";

export const Route = createFileRoute("/admin/stock-adjustments")({ component: AdjustmentsPage });

function AdjustmentsPage() {
  const [mode, setMode] = useState<"increase" | "decrease">("increase");
  const variance = erpProducts.slice(0, 8).map((p, i) => ({ ...p, counted: p.stock + ((i % 2 === 0 ? -1 : 1) * (1 + (i % 4))) }));

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Adjustments" }]}
        title="Stock adjustments"
        description="Reconcile physical counts and bulk adjust stock with approval workflows."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Pending approval" value={4} icon={ClipboardCheck} tint="amber" />
        <KpiCard label="Variance (7d)" value="2.3%" icon={AlertTriangle} tint="rose" />
        <KpiCard label="Cycle counts" value={12} icon={Layers} tint="sky" />
        <KpiCard label="Net adjusted" value="+142" icon={Calculator} tint="primary" />
      </section>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <PanelCard title="New adjustment" description="Choose increase, decrease, or run a cycle count">
            <Tabs defaultValue="single">
              <TabsList className="rounded-xl"><TabsTrigger value="single">Single SKU</TabsTrigger><TabsTrigger value="bulk">Bulk</TabsTrigger><TabsTrigger value="cycle">Cycle count</TabsTrigger></TabsList>
              <TabsContent value="single" className="mt-4 space-y-4">
                <div className="flex rounded-xl bg-muted p-1 text-sm">
                  <button onClick={() => setMode("increase")} className={`flex-1 rounded-lg px-3 py-2 font-semibold ${mode === "increase" ? "bg-card shadow" : "text-muted-foreground"}`}>
                    <Plus className="mr-1 inline h-4 w-4" /> Increase
                  </button>
                  <button onClick={() => setMode("decrease")} className={`flex-1 rounded-lg px-3 py-2 font-semibold ${mode === "decrease" ? "bg-card shadow" : "text-muted-foreground"}`}>
                    <Minus className="mr-1 inline h-4 w-4" /> Decrease
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label className="mb-1 block text-xs font-semibold uppercase">Product</Label>
                    <Select defaultValue={erpProducts[0].id}><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{erpProducts.slice(0,12).map((p) => <SelectItem key={p.id} value={p.id}>{p.emoji} {p.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="mb-1 block text-xs font-semibold uppercase">Warehouse</Label>
                    <Select defaultValue={warehouses[0].code}><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>{warehouses.map((w) => <SelectItem key={w.code} value={w.code}>{w.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div><Label className="mb-1 block text-xs font-semibold uppercase">Quantity</Label><Input type="number" placeholder="10" className="h-11 rounded-xl" /></div>
                  <div><Label className="mb-1 block text-xs font-semibold uppercase">Reason</Label>
                    <Select defaultValue="count"><SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="count">Cycle count</SelectItem>
                        <SelectItem value="damage">Damage</SelectItem>
                        <SelectItem value="expiry">Expiry</SelectItem>
                        <SelectItem value="theft">Shrinkage</SelectItem>
                        <SelectItem value="found">Found stock</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div><Label className="mb-1 block text-xs font-semibold uppercase">Notes</Label><Textarea placeholder="Add context for the auditor…" className="min-h-[80px] rounded-xl" /></div>
                <div className="flex justify-end gap-2"><Button variant="ghost">Cancel</Button><Button className="rounded-xl" onClick={() => toast.success("Adjustment submitted for approval")}>Submit for approval</Button></div>
              </TabsContent>
              <TabsContent value="bulk" className="mt-4">
                <div className="rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-8 text-center">
                  <p className="text-sm font-semibold">Drop a CSV with SKU, warehouse, +/- qty</p>
                  <Button className="mt-3 rounded-xl">Choose file</Button>
                </div>
              </TabsContent>
              <TabsContent value="cycle" className="mt-4">
                <PanelCard title="Variance report" description="Counted vs. expected for selected SKUs">
                  <DataTable
                    rows={variance}
                    columns={[
                      { key: "name", label: "Product", render: (p) => <span><span className="mr-2">{p.emoji}</span>{p.name}</span> },
                      { key: "stock", label: "System", className: "text-center" },
                      { key: "counted", label: "Counted", className: "text-center" },
                      { key: "variance", label: "Δ", render: (p) => {
                        const d = p.counted - p.stock;
                        return <span className={`font-bold ${d>0?"text-emerald-600":d<0?"text-rose-600":""}`}>{d>0?"+":""}{d}</span>;
                      } },
                    ]}
                  />
                </PanelCard>
              </TabsContent>
            </Tabs>
          </PanelCard>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <PanelCard title="Approval workflow" description="Adjustment ADJ-0512">
            <ApprovalTimeline
              steps={[
                { label: "Drafted", by: "Vikram Singh", at: "10:24", status: "done" },
                { label: "Floor manager review", by: "Priya Kapoor", at: "10:38", status: "done" },
                { label: "Finance approval", by: "Rahul Mehta", status: "current" },
                { label: "Committed to ledger", status: "pending" },
              ]}
            />
          </PanelCard>
        </div>
      </div>
    </div>
  );
}