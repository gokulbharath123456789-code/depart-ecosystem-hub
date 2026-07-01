import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Minus, ClipboardCheck, AlertTriangle, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { useProducts, useWarehouses } from "@/features/catalog/hooks";
import { useAdjustInventory, useStockMovements } from "@/features/inventory/hooks";
import type { StockMovementKind } from "@/features/inventory/api";

export const Route = createFileRoute("/admin/stock-adjustments")({ component: AdjustmentsPage });

function AdjustmentsPage() {
  const [mode, setMode] = useState<"increase" | "decrease">("increase");
  const [productId, setProductId] = useState("");
  const [warehouseId, setWarehouseId] = useState("");
  const [qty, setQty] = useState(0);
  const [reason, setReason] = useState<StockMovementKind>("adjustment");
  const [note, setNote] = useState("");

  const { data: products = [] } = useProducts({ status: "active" });
  const { data: warehouses = [] } = useWarehouses();
  const { data: recent = [] } = useStockMovements({ kind: "adjustment", limit: 20 });
  const adjust = useAdjustInventory();

  const defaultWh = useMemo(() => warehouses.find((w) => w.is_default) ?? warehouses[0], [warehouses]);
  const activeWarehouseId = warehouseId || defaultWh?.id || "";
  const activeProductId = productId || products[0]?.id || "";

  const submit = async () => {
    if (!activeProductId || !activeWarehouseId || !qty) return;
    await adjust.mutateAsync({
      product_id: activeProductId,
      warehouse_id: activeWarehouseId,
      delta: mode === "increase" ? qty : -qty,
      kind: reason,
      note: note || undefined,
    });
    setQty(0);
    setNote("");
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Adjustments" }]}
        title="Stock adjustments"
        description="Reconcile physical counts and log every stock change."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Adjustments logged" value={recent.length} icon={ClipboardCheck} tint="amber" />
        <KpiCard label="Net units" value={recent.reduce((s, m) => s + m.qty, 0)} icon={Calculator} tint="primary" />
        <KpiCard label="Increases" value={recent.filter((m) => m.qty > 0).length} icon={Plus} tint="emerald" />
        <KpiCard label="Decreases" value={recent.filter((m) => m.qty < 0).length} icon={AlertTriangle} tint="rose" />
      </section>

      <div className="mt-6 grid grid-cols-12 gap-6">
        <div className="col-span-12 xl:col-span-7">
          <PanelCard title="New adjustment" description="Choose increase or decrease">
            <div className="space-y-4">
              <div className="flex rounded-xl bg-muted p-1 text-sm">
                <button onClick={() => setMode("increase")} className={`flex-1 rounded-lg px-3 py-2 font-semibold ${mode === "increase" ? "bg-card shadow" : "text-muted-foreground"}`}>
                  <Plus className="mr-1 inline h-4 w-4" /> Increase
                </button>
                <button onClick={() => setMode("decrease")} className={`flex-1 rounded-lg px-3 py-2 font-semibold ${mode === "decrease" ? "bg-card shadow" : "text-muted-foreground"}`}>
                  <Minus className="mr-1 inline h-4 w-4" /> Decrease
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="mb-1 block text-xs font-semibold uppercase">Product</Label>
                  <Select value={activeProductId} onValueChange={setProductId}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select product" /></SelectTrigger>
                    <SelectContent>{products.slice(0, 100).map((p) => <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-semibold uppercase">Warehouse</Label>
                  <Select value={activeWarehouseId} onValueChange={setWarehouseId}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue placeholder="Select warehouse" /></SelectTrigger>
                    <SelectContent>{warehouses.map((w) => <SelectItem key={w.id} value={w.id}>{w.name}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-semibold uppercase">Quantity</Label>
                  <Input type="number" min={1} placeholder="10" value={qty || ""} onChange={(e) => setQty(Number(e.target.value) || 0)} className="h-11 rounded-xl" />
                </div>
                <div>
                  <Label className="mb-1 block text-xs font-semibold uppercase">Reason</Label>
                  <Select value={reason} onValueChange={(v) => setReason(v as StockMovementKind)}>
                    <SelectTrigger className="h-11 rounded-xl"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="adjustment">Adjustment</SelectItem>
                      <SelectItem value="receipt">Receipt</SelectItem>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="return">Return</SelectItem>
                      <SelectItem value="transfer">Transfer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label className="mb-1 block text-xs font-semibold uppercase">Notes</Label>
                <Textarea placeholder="Add context…" value={note} onChange={(e) => setNote(e.target.value)} className="min-h-[80px] rounded-xl" />
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="ghost" onClick={() => { setQty(0); setNote(""); }}>Cancel</Button>
                <Button className="rounded-xl" disabled={!activeProductId || !activeWarehouseId || !qty || adjust.isPending} onClick={submit}>
                  {adjust.isPending ? "Submitting…" : "Submit adjustment"}
                </Button>
              </div>
            </div>
          </PanelCard>
        </div>
        <div className="col-span-12 xl:col-span-5">
          <PanelCard title="Recent adjustments" description="Live from stock_movements">
            <ul className="space-y-2">
              {recent.length === 0 && <li className="text-xs text-muted-foreground">No adjustments recorded yet.</li>}
              {recent.map((m) => (
                <li key={m.id} className="rounded-xl border border-border/60 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold">{m.product?.name ?? "—"}</span>
                    <span className={`font-bold ${m.qty > 0 ? "text-emerald-600" : "text-rose-600"}`}>{m.qty > 0 ? "+" : ""}{m.qty}</span>
                  </div>
                  <div className="mt-0.5 text-[11px] text-muted-foreground">{m.warehouse?.name ?? "—"} · {new Date(m.created_at).toLocaleString()}</div>
                  {m.note && <div className="mt-1 text-xs">{m.note}</div>}
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}
