import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Filter, Download, ShoppingCart, IndianRupee, Truck, CircleDot } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill, EmptyState } from "@/features/admin/components/widgets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { adminOrders } from "@/features/admin/mock/data";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/orders")({
  component: OrdersPage,
});

const TABS = ["all", "pending", "paid", "shipped", "delivered", "refunded", "cancelled"] as const;

function OrdersPage() {
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");

  const filtered = useMemo(
    () =>
      adminOrders.filter((o) => {
        if (tab !== "all" && o.status !== tab) return false;
        if (q && !o.id.toLowerCase().includes(q.toLowerCase()) && !o.customer.toLowerCase().includes(q.toLowerCase())) return false;
        return true;
      }),
    [q, tab],
  );

  const sum = adminOrders.reduce((s, o) => s + o.total, 0);
  const pending = adminOrders.filter((o) => o.status === "pending").length;
  const shipping = adminOrders.filter((o) => o.status === "shipped").length;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Orders" }]}
        title="Orders"
        description="Track and fulfill orders across web, app and POS."
        actions={<Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>}
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total orders" value={adminOrders.length} icon={ShoppingCart} tint="primary" />
        <KpiCard label="Revenue" value={inr(sum)} icon={IndianRupee} tint="sky" />
        <KpiCard label="Pending" value={pending} icon={CircleDot} tint="amber" />
        <KpiCard label="Shipping" value={shipping} icon={Truck} tint="violet" />
      </section>

      <PanelCard title="All orders" description={`${filtered.length} of ${adminOrders.length}`} className="mt-6">
        <Tabs value={tab} onValueChange={(v) => setTab(v as never)} className="mb-4">
          <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/40 p-1">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="text-xs capitalize">{t}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders…" className="h-10 rounded-xl pl-9" />
          </div>
          <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
        </div>
        {filtered.length === 0 ? (
          <EmptyState icon={ShoppingCart} title="No orders" description="Try a different search or filter." />
        ) : (
          <DataTable
            rows={filtered}
            columns={[
              { key: "id", label: "Order", render: (o) => <span className="font-mono text-xs font-semibold">{o.id}</span> },
              { key: "customer", label: "Customer", render: (o) => <div><p className="text-sm font-semibold">{o.customer}</p><p className="text-[11px] text-muted-foreground">{o.email}</p></div> },
              { key: "createdAt", label: "Placed", render: (o) => <span className="text-xs text-muted-foreground">{format(new Date(o.createdAt), "dd MMM, HH:mm")}</span> },
              { key: "channel", label: "Channel", render: (o) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium capitalize">{o.channel}</span> },
              { key: "items", label: "Items", className: "text-center" },
              { key: "total", label: "Total", render: (o) => <span className="font-semibold">{inr(o.total)}</span> },
              { key: "status", label: "Status", render: (o) => <StatusPill status={o.status} /> },
            ]}
          />
        )}
      </PanelCard>
    </div>
  );
}