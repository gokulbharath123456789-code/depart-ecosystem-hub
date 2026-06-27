import { createFileRoute } from "@tanstack/react-router";
import { Truck, Plus, MapPin, PackageCheck, CalendarCheck } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { adminSuppliers } from "@/features/admin/mock/data";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersPage,
});

function SuppliersPage() {
  const active = adminSuppliers.filter((s) => s.status === "active").length;
  const onTimeAvg = Math.round(adminSuppliers.reduce((s, x) => s + x.onTime, 0) / adminSuppliers.length);
  const totalSkus = adminSuppliers.reduce((s, x) => s + x.skus, 0);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Supply chain" }, { label: "Suppliers" }]}
        title="Suppliers"
        description="Manage vendors, lead times and purchase orders."
        actions={<Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add supplier</Button>}
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Suppliers" value={adminSuppliers.length} icon={Truck} tint="primary" />
        <KpiCard label="Active" value={active} icon={CalendarCheck} tint="emerald" />
        <KpiCard label="Total SKUs supplied" value={totalSkus} icon={PackageCheck} tint="sky" />
        <KpiCard label="On-time rate" value={`${onTimeAvg}%`} icon={MapPin} tint="amber" />
      </section>

      <PanelCard title="Supplier directory" className="mt-6">
        <DataTable
          rows={adminSuppliers}
          columns={[
            { key: "name", label: "Supplier", render: (s) => <div><p className="text-sm font-semibold">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.contact}</p></div> },
            { key: "city", label: "City" },
            { key: "skus", label: "SKUs", className: "text-center" },
            { key: "onTime", label: "On-time", render: (s) => <span className="font-semibold">{s.onTime}%</span> },
            { key: "status", label: "Status", render: (s) => <StatusPill status={s.status} /> },
          ]}
        />
      </PanelCard>
    </div>
  );
}