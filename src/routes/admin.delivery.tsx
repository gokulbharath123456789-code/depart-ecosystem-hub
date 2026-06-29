import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Truck, Clock, CheckCircle2, AlertTriangle, MapPin, Calendar, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard, DataTable, EmptyState } from "@/features/admin/components/widgets";
import { DeliveryCard, StatusBadge } from "@/features/admin/components/ops-widgets";
import { opsDrivers, opsOrders, opsKpis } from "@/features/admin/mock/ops";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/delivery")({ component: DeliveryPage });

const SLOTS = ["10–11 AM", "11 AM–12 PM", "12–1 PM", "2–3 PM", "4–5 PM", "6–7 PM", "8–9 PM"];

function DeliveryPage() {
  const [tab, setTab] = useState("today");
  const todays = useMemo(() => opsOrders.filter((o) => ["assigned", "out-for-delivery", "ready"].includes(o.status)).slice(0, 30), []);
  const live = useMemo(() => opsOrders.filter((o) => o.status === "out-for-delivery").slice(0, 12), []);
  const failed = useMemo(() => opsOrders.filter((o) => o.status === "cancelled").slice(0, 8), []);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Delivery" }]}
        title="Delivery management"
        description="Today's runs, live driver status, slot capacity and proof of delivery."
        actions={
          <>
            <Link to="/admin/delivery-partners"><Button variant="outline" className="rounded-xl">Partners</Button></Link>
            <Link to="/admin/routes"><Button variant="outline" className="rounded-xl"><MapPin className="mr-2 h-4 w-4" /> Routes</Button></Link>
            <Link to="/admin/delivery-analytics"><Button className="rounded-xl">Analytics</Button></Link>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Avg delivery" value={`${opsKpis.avgDeliveryMins} min`} icon={Clock} tint="primary" />
        <KpiCard label="On-time" value={`${opsKpis.onTimePct}%`} delta={1.2} icon={CheckCircle2} tint="emerald" />
        <KpiCard label="Late" value={`${opsKpis.latePct}%`} delta={-0.5} icon={AlertTriangle} tint="amber" />
        <KpiCard label="Failed" value={`${opsKpis.failedPct}%`} icon={AlertTriangle} tint="rose" />
      </section>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="today">Today</TabsTrigger>
          <TabsTrigger value="live">Live</TabsTrigger>
          <TabsTrigger value="slots">Slots</TabsTrigger>
          <TabsTrigger value="failed">Failed</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "today" && (
        <PanelCard title="Today's deliveries" description={`${todays.length} runs`} className="mt-4">
          <DataTable
            rows={todays}
            columns={[
              { key: "id", label: "Order", render: (o) => <span className="font-mono text-xs font-semibold">{o.id}</span> },
              { key: "customer", label: "Customer", render: (o) => <div><p className="text-sm font-medium">{o.customer}</p><p className="text-[11px] text-muted-foreground">{o.address}, {o.city}</p></div> },
              { key: "slot", label: "Slot" },
              { key: "driverId", label: "Driver", render: (o) => o.driverId ? <span className="font-mono text-[11px]">{o.driverId}</span> : <span className="text-muted-foreground">—</span> },
              { key: "status", label: "Status", render: (o) => <StatusBadge status={o.status} /> },
            ]}
          />
        </PanelCard>
      )}

      {tab === "live" && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {live.map((o) => {
            const driver = opsDrivers.find((d) => d.id === o.driverId) ?? opsDrivers[0];
            return (
              <div key={o.id} className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] font-semibold">{o.id}</span>
                  <StatusBadge status={o.status} />
                </div>
                <p className="mt-1 truncate text-sm font-semibold">{o.customer}</p>
                <p className="truncate text-[11px] text-muted-foreground">{o.address}, {o.city}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-center">
                  <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Driver</p><p className="text-xs font-bold">{driver.name}</p></div>
                  <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">ETA</p><p className="text-xs font-bold">{18 + (parseInt(o.id.slice(-2)) % 25)} min</p></div>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
                  <span className="inline-flex items-center gap-1"><Truck className="h-3 w-3" /> Live tracking</span>
                  <Button size="sm" variant="ghost" className="h-7 px-2">OTP</Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {tab === "slots" && (
        <PanelCard title="Slot capacity" description="Today" className="mt-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {SLOTS.map((s, i) => {
              const used = 18 + ((i * 7) % 60);
              const cap = 80;
              return (
                <div key={s} className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
                  <p className="flex items-center gap-2 text-sm font-bold"><Calendar className="h-4 w-4 text-primary" /> {s}</p>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted"><div className="h-full rounded-full bg-primary" style={{ width: `${(used / cap) * 100}%` }} /></div>
                  <p className="mt-1 text-[11px] text-muted-foreground">{used}/{cap} slots</p>
                </div>
              );
            })}
          </div>
        </PanelCard>
      )}

      {tab === "failed" && (
        <PanelCard title="Failed deliveries" description="Awaiting reattempt" className="mt-4">
          {failed.length === 0 ? <EmptyState icon={AlertTriangle} title="No failed deliveries" /> : (
            <DataTable
              rows={failed}
              columns={[
                { key: "id", label: "Order", render: (o) => <span className="font-mono text-xs font-semibold">{o.id}</span> },
                { key: "customer", label: "Customer" },
                { key: "city", label: "City" },
                { key: "placedAt", label: "Failed at", render: (o) => format(new Date(o.placedAt), "d MMM, HH:mm") },
                { key: "id", label: "", render: () => <Button size="sm" variant="outline" className="rounded-lg">Reattempt</Button> },
              ]}
            />
          )}
        </PanelCard>
      )}
    </div>
  );
}
