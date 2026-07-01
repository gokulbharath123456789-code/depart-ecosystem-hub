import { createFileRoute, Link } from "@tanstack/react-router";
import { Boxes, AlertTriangle, PackageCheck, Plus, Download } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill, EmptyState } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useInventory } from "@/features/inventory/hooks";
import { useWarehouses } from "@/features/catalog/hooks";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const { data: inv = [], isLoading } = useInventory();
  const { data: warehouses = [] } = useWarehouses();
  const totalOnHand = inv.reduce((s, i) => s + i.on_hand, 0);
  const totalReserved = inv.reduce((s, i) => s + i.reserved, 0);
  const out = inv.filter((i) => i.on_hand === 0);
  const low = inv.filter((i) => i.on_hand > 0 && i.on_hand <= i.reorder_point);
  const critical = [...out, ...low];

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Inventory" }]}
        title="Inventory"
        description="Stock health across all locations and channels."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Stock report</Button>
            <Button asChild className="rounded-xl"><Link to="/admin/stock-adjustments"><Plus className="mr-2 h-4 w-4" /> Adjust stock</Link></Button>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <KpiCard label="Units on hand" value={totalOnHand.toLocaleString()} icon={PackageCheck} tint="primary" />
        <KpiCard label="Reserved" value={totalReserved.toLocaleString()} icon={Boxes} tint="violet" />
        <KpiCard label="Low stock" value={low.length} icon={AlertTriangle} tint="amber" />
        <KpiCard label="Out of stock" value={out.length} icon={AlertTriangle} tint="rose" />
      </section>

      <PanelCard title="Warehouse breakdown" className="mt-6">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {warehouses.map((w) => {
            const wInv = inv.filter((i) => i.warehouse_id === w.id);
            const wOnHand = wInv.reduce((s, i) => s + i.on_hand, 0);
            const pct = totalOnHand ? Math.round((wOnHand / totalOnHand) * 100) : 0;
            return (
              <div key={w.id} className="rounded-2xl border border-border/60 p-3">
                <p className="text-xs font-semibold">{w.code}</p>
                <p className="truncate text-[11px] text-muted-foreground">{w.name}</p>
                <Progress value={pct} className="mt-2 h-1.5" />
                <p className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>{pct}% of total</span><span>{wOnHand.toLocaleString()} units</span></p>
              </div>
            );
          })}
        </div>
      </PanelCard>

      <PanelCard title="Critical SKUs" description="Out of stock & below reorder point" className="mt-6">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div>
        ) : critical.length === 0 ? (
          <EmptyState icon={PackageCheck} title="All stock healthy" description="No SKUs are currently below reorder point." />
        ) : (
          <DataTable
            rows={critical}
            columns={[
              { key: "name", label: "Product", render: (r) => (
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{r.product?.name ?? "—"}</p><p className="text-[11px] text-muted-foreground">{r.product?.sku ?? "—"}</p></div>
              ) },
              { key: "warehouse", label: "Warehouse", render: (r) => <span className="text-xs">{r.warehouse?.name ?? "—"}</span> },
              { key: "stock", label: "On hand", render: (r) => {
                const target = Math.max(r.reorder_point * 4, 1);
                return (
                  <div className="w-40">
                    <div className="mb-1 flex items-baseline justify-between text-xs">
                      <span className="font-semibold">{r.on_hand}</span>
                      <span className="text-muted-foreground">/ reorder {r.reorder_point}</span>
                    </div>
                    <Progress value={Math.min(100, (r.on_hand / target) * 100)} className="h-1.5" />
                  </div>
                );
              } },
              { key: "status", label: "Status", render: (r) => <StatusPill status={r.on_hand === 0 ? "cancelled" : "pending"} /> },
            ]}
          />
        )}
      </PanelCard>
    </div>
  );
}