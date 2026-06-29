import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Truck, Clock, Route as RouteIcon } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { opsRoutes, opsDrivers } from "@/features/admin/mock/ops";

export const Route = createFileRoute("/admin/routes")({ component: RoutesPage });

function RoutesPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Delivery", to: "/admin/delivery" }, { label: "Routes" }]}
        title="Route planner"
        description="Group orders into optimised driver routes. Map integration coming soon."
        actions={<Button className="rounded-xl">Auto-plan routes</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active routes" value={opsRoutes.length} icon={RouteIcon} tint="primary" />
        <KpiCard label="Total stops" value={opsRoutes.reduce((s, r) => s + r.stops, 0)} icon={MapPin} tint="sky" />
        <KpiCard label="Avg ETA" value={`${Math.round(opsRoutes.reduce((s, r) => s + r.etaMins, 0) / opsRoutes.length)} min`} icon={Clock} tint="amber" />
        <KpiCard label="Drivers assigned" value={new Set(opsRoutes.map((r) => r.driverId)).size} icon={Truck} tint="violet" />
      </section>

      <PanelCard title="Map preview" description="Geo-aware route planning placeholder" className="mt-6">
        <div className="relative h-72 overflow-hidden rounded-2xl border border-dashed border-border/60 bg-gradient-to-br from-emerald-50 via-amber-50 to-sky-50">
          <div className="absolute inset-0 opacity-40" style={{ backgroundImage: "radial-gradient(circle at 20% 30%, rgba(34,197,94,.25), transparent 40%), radial-gradient(circle at 70% 60%, rgba(250,204,21,.25), transparent 40%), radial-gradient(circle at 40% 80%, rgba(56,189,248,.2), transparent 40%)" }} />
          {opsRoutes.slice(0, 8).map((r, i) => (
            <div key={r.id} className="absolute rounded-full border-2 border-primary bg-card px-2 py-1 text-[10px] font-bold soft-shadow" style={{ left: `${10 + (i * 11)}%`, top: `${15 + ((i * 17) % 70)}%` }}>{r.id}</div>
          ))}
          <div className="absolute bottom-3 right-3 rounded-xl bg-card/90 px-3 py-1.5 text-[11px] font-medium backdrop-blur">Map integration placeholder</div>
        </div>
      </PanelCard>

      <PanelCard title="Planned routes" description="Today" className="mt-6">
        <DataTable
          rows={opsRoutes}
          columns={[
            { key: "id", label: "Route", render: (r) => <span className="font-mono text-xs font-semibold">{r.id}</span> },
            { key: "zone", label: "Zone" },
            { key: "driverId", label: "Driver", render: (r) => opsDrivers.find((d) => d.id === r.driverId)?.name ?? "—" },
            { key: "stops", label: "Stops", className: "text-center" },
            { key: "orders", label: "Orders", className: "text-center" },
            { key: "distanceKm", label: "Distance", render: (r) => `${r.distanceKm} km` },
            { key: "etaMins", label: "ETA", render: (r) => `${r.etaMins} min` },
            { key: "status", label: "Status", render: (r) => <StatusPill status={r.status === "in-progress" ? "shipped" : r.status === "completed" ? "delivered" : "pending"} /> },
          ]}
        />
      </PanelCard>
    </div>
  );
}
