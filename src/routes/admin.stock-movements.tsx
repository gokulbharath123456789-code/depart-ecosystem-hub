import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Download, Sliders, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard, DataTable, EmptyState } from "@/features/admin/components/widgets";
import { useStockMovements } from "@/features/inventory/hooks";
import type { StockMovementKind } from "@/features/inventory/api";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/stock-movements")({ component: MovementsPage });

const KINDS: Array<"all" | StockMovementKind> = ["all", "receipt", "sale", "return", "adjustment", "transfer"];

function MovementsPage() {
  const [tab, setTab] = useState<string>("all");
  const { data: movements = [], isLoading } = useStockMovements({ limit: 500 });
  const filtered = useMemo(
    () => (tab === "all" ? movements : movements.filter((m) => m.kind === tab)),
    [movements, tab],
  );
  const incoming = movements.filter((m) => m.qty > 0).reduce((s, m) => s + m.qty, 0);
  const outgoing = movements.filter((m) => m.qty < 0).reduce((s, m) => s + Math.abs(m.qty), 0);
  const adjustments = movements.filter((m) => m.kind === "adjustment").length;
  const returns = movements.filter((m) => m.kind === "return").length;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Stock Movements" }]}
        title="Stock movements"
        description="Every inventory change — purchases, sales, returns, adjustments and transfers."
        actions={<Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Incoming units" value={incoming.toLocaleString()} icon={ArrowDown} tint="emerald" />
        <KpiCard label="Outgoing units" value={outgoing.toLocaleString()} icon={ArrowUp} tint="sky" />
        <KpiCard label="Adjustments" value={adjustments} icon={Sliders} tint="amber" />
        <KpiCard label="Returns" value={returns} icon={AlertTriangle} tint="rose" />
      </section>

      <div className="mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="flex-wrap rounded-xl">
            {KINDS.map((t) => <TabsTrigger key={t} value={t} className="capitalize">{t}</TabsTrigger>)}
          </TabsList>
        </Tabs>
      </div>

      <PanelCard title="Audit trail" description={`${filtered.length} movements`} className="mt-4">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Sliders} title="No movements yet" description="Stock movements will appear here as they happen." />
        ) : (
          <DataTable
            rows={filtered.slice(0, 200)}
            columns={[
              { key: "created_at", label: "When", render: (r) => <span className="text-xs">{format(new Date(r.created_at), "d MMM yy HH:mm")}</span> },
              { key: "kind", label: "Type", render: (r) => <span className="capitalize text-xs font-semibold">{r.kind}</span> },
              { key: "product", label: "Product", render: (r) => r.product?.name ?? "—" },
              { key: "warehouse", label: "Warehouse", render: (r) => r.warehouse?.name ?? "—" },
              { key: "qty", label: "Qty", render: (r) => <span className={`font-bold ${r.qty > 0 ? "text-emerald-600" : "text-rose-600"}`}>{r.qty > 0 ? "+" : ""}{r.qty}</span> },
              { key: "note", label: "Note", render: (r) => <span className="text-xs text-muted-foreground">{r.note ?? r.reference ?? ""}</span> },
            ]}
          />
        )}
      </PanelCard>
    </div>
  );
}
