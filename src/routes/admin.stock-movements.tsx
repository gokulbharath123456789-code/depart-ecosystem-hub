import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowLeftRight, ArrowDown, ArrowUp, Download, Sliders, ShoppingCart, RotateCcw, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { MovementTimeline, DateRangePicker } from "@/features/admin/components/erp-widgets";
import { stockMovements, type MovementType, inventoryKpis } from "@/features/admin/mock/erp";
import type { DateRange } from "react-day-picker";

export const Route = createFileRoute("/admin/stock-movements")({ component: MovementsPage });

function MovementsPage() {
  const [tab, setTab] = useState<string>("all");
  const [range, setRange] = useState<DateRange | undefined>();
  const filtered = useMemo(() => stockMovements.filter((m) => tab === "all" || m.type === (tab as MovementType)), [tab]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Stock Movements" }]}
        title="Stock movements"
        description="Every inventory change — purchases, sales, returns, damages, transfers and adjustments."
        actions={
          <>
            <DateRangePicker value={range} onChange={setRange} />
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Incoming (7d)" value={inventoryKpis.incoming} delta={8.2} icon={ArrowDown} tint="emerald" />
        <KpiCard label="Outgoing (7d)" value={inventoryKpis.outgoing} delta={4.1} icon={ArrowUp} tint="sky" />
        <KpiCard label="Adjustments" value={48} icon={Sliders} tint="amber" />
        <KpiCard label="Damages" value={inventoryKpis.damaged} delta={-12} icon={AlertTriangle} tint="rose" />
      </section>

      <div className="mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap rounded-xl">
            {["all","purchase","sale","return","damage","expiry","adjustment","transfer"].map((t) => (
              <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <PanelCard title="Audit trail" description={`${filtered.length} movements`} className="mt-4">
        <MovementTimeline items={filtered.slice(0, 30)} />
      </PanelCard>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-4">
        {[
          { label: "Sale", icon: ShoppingCart, tone: "bg-sky-500/10 text-sky-600" },
          { label: "Return", icon: RotateCcw, tone: "bg-violet-500/10 text-violet-600" },
          { label: "Transfer", icon: ArrowLeftRight, tone: "bg-primary/10 text-primary" },
          { label: "Damage", icon: AlertTriangle, tone: "bg-rose-500/10 text-rose-600" },
        ].map((x) => (
          <div key={x.label} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
            <span className={`grid h-10 w-10 place-items-center rounded-xl ${x.tone}`}><x.icon className="h-5 w-5" /></span>
            <div>
              <p className="text-xs text-muted-foreground">Most common reason</p>
              <p className="text-sm font-semibold">{x.label}</p>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}