import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { CalendarClock, AlertTriangle, PackageCheck, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { BatchCard } from "@/features/admin/components/erp-widgets";
import { batches } from "@/features/admin/mock/erp";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/batches")({ component: BatchesPage });

function BatchesPage() {
  const [tab, setTab] = useState("all");
  const enriched = useMemo(() => batches.map((b) => ({ ...b, daysLeft: Math.round((new Date(b.expiry).getTime() - Date.now()) / 86400000) })), []);
  const expired = enriched.filter((b) => b.daysLeft < 0);
  const near = enriched.filter((b) => b.daysLeft >= 0 && b.daysLeft <= 7);
  const fresh = enriched.filter((b) => b.daysLeft > 7);
  const view = tab === "expired" ? expired : tab === "near" ? near : tab === "fresh" ? fresh : enriched;

  const fefo = [...enriched].sort((a, b) => a.daysLeft - b.daysLeft).slice(0, 6);
  const fifo = [...enriched].sort((a, b) => new Date(a.mfg).getTime() - new Date(b.mfg).getTime()).slice(0, 6);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Batches & Expiry" }]}
        title="Batch & expiry"
        description="Track lots, manufacturing & expiry dates with FIFO/FEFO visibility."
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

      <section className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {view.slice(0, 16).map((b) => <BatchCard key={b.id} b={b} />)}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="FEFO queue" description="First-expiry-first-out picking order">
          <DataTable
            rows={fefo}
            columns={[
              { key: "productName", label: "Product", render: (b) => <span><span className="mr-2">{b.emoji}</span>{b.productName}</span> },
              { key: "batchNo", label: "Batch" },
              { key: "expiry", label: "Expiry", render: (b) => format(new Date(b.expiry), "d MMM yy") },
              { key: "daysLeft", label: "Days", render: (b) => <span className={`font-semibold ${b.daysLeft <= 7 ? "text-rose-600" : ""}`}>{b.daysLeft}d</span> },
            ]}
          />
        </PanelCard>
        <PanelCard title="FIFO queue" description="First-in-first-out by manufacturing date">
          <DataTable
            rows={fifo}
            columns={[
              { key: "productName", label: "Product", render: (b) => <span><span className="mr-2">{b.emoji}</span>{b.productName}</span> },
              { key: "batchNo", label: "Batch" },
              { key: "mfg", label: "Mfg", render: (b) => format(new Date(b.mfg), "d MMM yy") },
              { key: "qty", label: "Qty", className: "text-center" },
            ]}
          />
        </PanelCard>
      </section>
    </div>
  );
}