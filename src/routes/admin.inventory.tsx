import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, AlertTriangle, PackageCheck, Truck, Plus, Download, ArrowDown, ArrowUp, ArrowLeftRight, Skull, CalendarClock } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { StockCard } from "@/features/admin/components/erp-widgets";
import { erpProducts, inventoryKpis, warehouses } from "@/features/admin/mock/erp";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const low = erpProducts.filter((p) => p.stock > 0 && p.stock <= p.reorder);
  const out = erpProducts.filter((p) => p.stock === 0);
  const inStock = erpProducts.length - out.length;
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Inventory" }]}
        title="Inventory"
        description="Stock health across all locations and channels."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Stock report</Button>
            <Button asChild className="rounded-xl"><Link to="/admin/purchase-orders"><Plus className="mr-2 h-4 w-4" /> Receive stock</Link></Button>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4 xl:grid-cols-8">
        <KpiCard label="Current" value={inventoryKpis.current.toLocaleString()} icon={PackageCheck} tint="primary" />
        <KpiCard label="Reserved" value={inventoryKpis.reserved} icon={Boxes} tint="violet" />
        <KpiCard label="Incoming" value={inventoryKpis.incoming} icon={ArrowDown} tint="sky" />
        <KpiCard label="Outgoing" value={inventoryKpis.outgoing} icon={ArrowUp} tint="emerald" />
        <KpiCard label="Damaged" value={inventoryKpis.damaged} icon={AlertTriangle} tint="rose" />
        <KpiCard label="Expired" value={inventoryKpis.expired} icon={Skull} tint="rose" />
        <KpiCard label="Transferred" value={inventoryKpis.transferred} icon={ArrowLeftRight} tint="amber" />
        <KpiCard label="Inbound POs" value={4} icon={Truck} tint="sky" />
      </section>

      <PanelCard title="Warehouse utilization" description="Capacity across locations" className="mt-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-5">
          {warehouses.map((w) => {
            const pct = Math.round((w.used / w.capacity) * 100);
            return (
              <div key={w.id} className="rounded-2xl border border-border/60 p-3">
                <p className="text-xs font-semibold">{w.code}</p>
                <p className="truncate text-[11px] text-muted-foreground">{w.name}</p>
                <Progress value={pct} className="mt-2 h-1.5" />
                <p className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{pct}%</span><span>{w.used}/{w.capacity}</span></p>
              </div>
            );
          })}
        </div>
      </PanelCard>

      <PanelCard title="Critical SKUs" description="Out of stock & near reorder" className="mt-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...out, ...low].slice(0, 8).map((p) => <StockCard key={p.id} product={p} />)}
        </div>
      </PanelCard>

      <PanelCard title="Stock movements" description="Below reorder threshold" className="mt-6">
        <DataTable
          rows={[...out, ...low]}
          columns={[
            {
              key: "name",
              label: "Product",
              render: (p) => (
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{p.name}</p>
                    <p className="text-[11px] text-muted-foreground">{p.sku}</p>
                  </div>
                </div>
              ),
            },
            { key: "supplier", label: "Supplier" },
            {
              key: "stock",
              label: "On hand",
              render: (p) => (
                <div className="w-40">
                  <div className="mb-1 flex items-baseline justify-between text-xs">
                    <span className="font-semibold">{p.stock}</span>
                    <span className="text-muted-foreground">/ {p.reorder * 4}</span>
                  </div>
                  <Progress value={Math.min(100, (p.stock / (p.reorder * 4)) * 100)} className="h-1.5" />
                </div>
              ),
            },
            { key: "status", label: "Status", render: (p) => <StatusPill status={p.stock === 0 ? "cancelled" : "pending"} /> },
          ]}
        />
      </PanelCard>
    </div>
  );
}