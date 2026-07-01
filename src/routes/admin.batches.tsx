import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, AlertTriangle, PackageCheck, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard, DataTable, EmptyState } from "@/features/admin/components/widgets";
import { useBatches } from "@/features/inventory/hooks";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/batches")({ component: BatchesPage });

function BatchesPage() {
  const [tab, setTab] = useState("all");
  const { data: batches = [], isLoading } = useBatches();
  const enriched = useMemo(
    () => batches.map((b) => ({
      ...b,
      daysLeft: b.expiry_date ? Math.round((new Date(b.expiry_date).getTime() - Date.now()) / 86400000) : Number.POSITIVE_INFINITY,
    })),
    [batches],
  );
  const expired = enriched.filter((b) => b.daysLeft < 0);
  const near = enriched.filter((b) => b.daysLeft >= 0 && b.daysLeft <= 7);
  const fresh = enriched.filter((b) => b.daysLeft > 7);
  const view = tab === "expired" ? expired : tab === "near" ? near : tab === "fresh" ? fresh : enriched;

  const fefo = [...enriched].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 12);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Batches & Expiry" }]}
        title="Batch & expiry"
        description="Track lots, manufacturing & expiry dates with FEFO visibility."
        actions={<Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Expiry report</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total batches" value={batches.length} icon={Layers} tint="primary" />
        <KpiCard label="Near expiry" value={near.length} icon={CalendarClock} tint="amber" />
        <KpiCard label="Expired" value={expired.length} icon={AlertTriangle} tint="rose" />
        <KpiCard label="Fresh" value={fresh.length} icon={PackageCheck} tint="emerald" />
      </section>

      <div className="mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="rounded-xl">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="fresh">Fresh</TabsTrigger>
            <TabsTrigger value="near">Near expiry</TabsTrigger>
            <TabsTrigger value="expired">Expired</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <PanelCard title="Batches" description={`${view.length} lots`} className="mt-4">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-lg bg-muted" />)}</div>
        ) : view.length === 0 ? (
          <EmptyState icon={Layers} title="No batches" description="Batch tracking data will appear here once received." />
        ) : (
          <DataTable
            rows={view.slice(0, 100)}
            columns={[
              { key: "batch_code", label: "Batch" },
              { key: "product", label: "Product", render: (b) => b.product?.name ?? "—" },
              { key: "warehouse", label: "Warehouse", render: (b) => b.warehouse?.name ?? "—" },
              { key: "qty", label: "Qty", className: "text-center" },
              { key: "mfg_date", label: "Mfg", render: (b) => b.mfg_date ? format(new Date(b.mfg_date), "d MMM yy") : "—" },
              { key: "expiry_date", label: "Expiry", render: (b) => b.expiry_date ? format(new Date(b.expiry_date), "d MMM yy") : "—" },
              { key: "daysLeft", label: "Days", render: (b) => Number.isFinite(b.daysLeft) ? <span className={`font-semibold ${b.daysLeft <= 7 ? "text-rose-600" : ""}`}>{b.daysLeft}d</span> : "—" },
            ]}
          />
        )}
      </PanelCard>

      <PanelCard title="FEFO pick queue" description="First-expiry-first-out priority" className="mt-6">
        <DataTable
          rows={fefo}
          columns={[
            { key: "product", label: "Product", render: (b) => b.product?.name ?? "—" },
            { key: "batch_code", label: "Batch" },
            { key: "expiry_date", label: "Expiry", render: (b) => b.expiry_date ? format(new Date(b.expiry_date), "d MMM yy") : "—" },
            { key: "daysLeft", label: "Days", render: (b) => Number.isFinite(b.daysLeft) ? <span className={`font-semibold ${b.daysLeft <= 7 ? "text-rose-600" : ""}`}>{b.daysLeft}d</span> : "—" },
          ]}
        />
      </PanelCard>
    </div>
  );
}
