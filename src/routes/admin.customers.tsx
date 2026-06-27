import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Users, IndianRupee, Repeat, Star, Search, Plus, Download } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, EmptyState } from "@/features/admin/components/widgets";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { adminCustomers } from "@/features/admin/mock/data";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/customers")({
  component: CustomersPage,
});

function CustomersPage() {
  const [q, setQ] = useState("");
  const rows = adminCustomers.filter((c) =>
    !q ? true : c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()),
  );
  const total = adminCustomers.length;
  const spend = adminCustomers.reduce((s, c) => s + c.spend, 0);
  const repeat = adminCustomers.filter((c) => c.orders > 1).length;
  const platinum = adminCustomers.filter((c) => c.tier === "Platinum").length;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Customers" }]}
        title="Customers"
        description="Your audience — VIPs, repeat buyers and new arrivals."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add customer</Button>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Customers" value={total} icon={Users} tint="primary" />
        <KpiCard label="Lifetime spend" value={inr(spend)} icon={IndianRupee} tint="sky" />
        <KpiCard label="Repeat buyers" value={repeat} icon={Repeat} tint="amber" />
        <KpiCard label="Platinum" value={platinum} icon={Star} tint="violet" />
      </section>

      <PanelCard title="Directory" description={`${rows.length} of ${total}`} className="mt-6">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="h-10 rounded-xl pl-9" />
          </div>
        </div>
        {rows.length === 0 ? (
          <EmptyState icon={Users} title="No customers match" />
        ) : (
          <DataTable
            rows={rows}
            columns={[
              {
                key: "name", label: "Customer",
                render: (c) => (
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{c.name.split(" ").map(n => n[0]).join("")}</span>
                    <div className="min-w-0"><p className="truncate text-sm font-semibold">{c.name}</p><p className="text-[11px] text-muted-foreground">{c.email}</p></div>
                  </div>
                ),
              },
              { key: "city", label: "City" },
              { key: "tier", label: "Tier", render: (c) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">{c.tier}</span> },
              { key: "orders", label: "Orders", className: "text-center" },
              { key: "spend", label: "Spend", render: (c) => <span className="font-semibold">{inr(c.spend)}</span> },
              { key: "lastSeen", label: "Last seen", render: (c) => <span className="text-xs text-muted-foreground">{c.lastSeen}</span> },
            ]}
          />
        )}
      </PanelCard>
    </div>
  );
}