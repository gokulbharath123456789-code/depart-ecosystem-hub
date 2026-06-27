import { createFileRoute } from "@tanstack/react-router";
import { Boxes, AlertTriangle, PackageCheck, Truck, Plus, Download } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { adminProducts } from "@/features/admin/mock/data";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

export const Route = createFileRoute("/admin/inventory")({
  component: InventoryPage,
});

function InventoryPage() {
  const low = adminProducts.filter((p) => p.stock > 0 && p.stock <= p.reorder);
  const out = adminProducts.filter((p) => p.stock === 0);
  const inStock = adminProducts.length - out.length;
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Inventory" }]}
        title="Inventory"
        description="Stock health across all locations and channels."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Stock report</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Receive stock</Button>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="In stock" value={inStock} icon={PackageCheck} tint="primary" />
        <KpiCard label="Low stock" value={low.length} icon={AlertTriangle} tint="amber" />
        <KpiCard label="Out of stock" value={out.length} icon={Boxes} tint="rose" />
        <KpiCard label="Inbound POs" value={4} icon={Truck} tint="sky" />
      </section>

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
            { key: "vendor", label: "Supplier" },
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