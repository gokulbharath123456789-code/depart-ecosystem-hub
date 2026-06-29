import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Search, Plus, Truck, Star, CheckCircle2, IndianRupee, Phone, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { DeliveryCard } from "@/features/admin/components/ops-widgets";
import { opsDrivers, opsKpis } from "@/features/admin/mock/ops";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/delivery-partners")({ component: PartnersPage });

function PartnersPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const drivers = useMemo(() => opsDrivers.filter((d) => !q || d.name.toLowerCase().includes(q.toLowerCase()) || d.zone.toLowerCase().includes(q.toLowerCase())), [q]);
  const driver = active ? opsDrivers.find((d) => d.id === active) : null;
  const totalCash = opsDrivers.reduce((s, d) => s + d.cashCollected, 0);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Delivery", to: "/admin/delivery" }, { label: "Partners" }]}
        title="Delivery partners"
        description="Drivers, vehicles, performance and cash collection."
        actions={<Button className="rounded-xl" onClick={() => toast.success("Partner onboarding started")}><Plus className="mr-2 h-4 w-4" /> New partner</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active partners" value={opsDrivers.filter((d) => d.active).length} icon={Truck} tint="primary" />
        <KpiCard label="Avg on-time" value={`${opsKpis.onTimePct}%`} icon={CheckCircle2} tint="emerald" />
        <KpiCard label="Avg rating" value="4.7" icon={Star} tint="amber" />
        <KpiCard label="Cash collected" value={inr(totalCash)} icon={IndianRupee} tint="sky" />
      </section>

      <PanelCard title="Roster" description={`${drivers.length} partners`} className="mt-6"
        action={<div className="relative w-64"><Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" /><Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search partners…" className="h-9 rounded-xl pl-9" /></div>}
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {drivers.map((d) => <button key={d.id} onClick={() => setActive(d.id)} className="text-left"><DeliveryCard d={d} /></button>)}
        </div>
      </PanelCard>

      <Sheet open={!!driver} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-md">
          {driver && (
            <div>
              <SheetHeader>
                <SheetTitle>{driver.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-4 space-y-3 text-sm">
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Driver profile</p>
                  <p className="mt-1 inline-flex items-center gap-2"><Phone className="h-3.5 w-3.5" /> {driver.phone}</p>
                  <p className="inline-flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {driver.zone}</p>
                  <p>{driver.vehicle} · <span className="font-mono">{driver.plate}</span></p>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-xl border border-border/60 bg-card p-3"><p className="text-[10px] uppercase text-muted-foreground">Trips</p><p className="font-bold">{driver.trips}</p></div>
                  <div className="rounded-xl border border-border/60 bg-card p-3"><p className="text-[10px] uppercase text-muted-foreground">On-time</p><p className="font-bold">{driver.onTime}%</p></div>
                  <div className="rounded-xl border border-border/60 bg-card p-3"><p className="text-[10px] uppercase text-muted-foreground">Rating</p><p className="font-bold">{driver.rating} ★</p></div>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="text-xs font-bold uppercase text-muted-foreground">Today</p>
                  <p className="mt-1">{driver.deliveriesToday} deliveries · {inr(driver.cashCollected)} cash collected</p>
                </div>
                <Button className="w-full rounded-xl" onClick={() => toast.success("Cash settled")}>Settle cash</Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
