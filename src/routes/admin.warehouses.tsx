import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, ArrowLeftRight, MapPin, Boxes } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { WarehouseCard, ConfirmDialog } from "@/features/admin/components/erp-widgets";
import { warehouses, transfers, inventoryKpis } from "@/features/admin/mock/erp";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/warehouses")({ component: WarehousesPage });

function WarehousesPage() {
  const [confirm, setConfirm] = useState(false);
  const totalCapacity = warehouses.reduce((s, w) => s + w.capacity, 0);
  const totalUsed = warehouses.reduce((s, w) => s + w.used, 0);
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Warehouses" }]}
        title="Warehouses"
        description="5 locations across India — dark stores, hubs and cold storage."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => setConfirm(true)}>
              <ArrowLeftRight className="mr-2 h-4 w-4" /> Transfer stock
            </Button>
            <Button className="rounded-xl" onClick={() => toast.success("Warehouse onboarding started")}>
              <Plus className="mr-2 h-4 w-4" /> New warehouse
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Warehouses" value={warehouses.length} icon={Boxes} tint="primary" />
        <KpiCard label="Capacity" value={`${totalCapacity.toLocaleString()} pal`} icon={Boxes} tint="sky" />
        <KpiCard label="Used" value={`${Math.round((totalUsed/totalCapacity)*100)}%`} icon={Boxes} tint="amber" />
        <KpiCard label="Transferred (7d)" value={inventoryKpis.transferred} icon={ArrowLeftRight} tint="violet" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {warehouses.map((w) => <WarehouseCard key={w.id} w={w} />)}
      </section>

      <PanelCard title="Stock transfers" description="Inter-warehouse movements" className="mt-6">
        <DataTable
          rows={transfers}
          columns={[
            { key: "id", label: "Transfer", render: (t) => <span className="font-mono text-xs font-semibold">{t.id}</span> },
            { key: "from", label: "From → To", render: (t) => (
              <span className="inline-flex items-center gap-2 text-sm"><span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px]">{t.from}</span><ArrowLeftRight className="h-3 w-3 text-muted-foreground" /><span className="rounded-md bg-muted px-1.5 py-0.5 font-mono text-[10px]">{t.to}</span></span>
            ) },
            { key: "items", label: "Items", className: "text-center" },
            { key: "qty", label: "Units", className: "text-center", render: (t) => <span className="font-semibold">{t.qty}</span> },
            { key: "createdAt", label: "Created", render: (t) => format(new Date(t.createdAt), "d MMM, HH:mm") },
            { key: "status", label: "Status", render: (t) => <StatusPill status={t.status === "in-transit" ? "shipped" : t.status === "received" ? "delivered" : t.status === "cancelled" ? "cancelled" : "pending"} /> },
          ]}
        />
      </PanelCard>

      <ConfirmDialog open={confirm} onOpenChange={setConfirm} title="Initiate stock transfer" description="Select warehouses and items to move. This will create a new transfer order." confirmLabel="Create transfer" onConfirm={() => toast.success("Transfer TR-0911 created (demo)")} />
    </div>
  );
}