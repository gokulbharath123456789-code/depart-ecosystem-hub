import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Plus, MapPin, PackageCheck, CalendarCheck, LayoutGrid, List } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, StatusPill } from "@/features/admin/components/widgets";
import { SupplierCard } from "@/features/admin/components/erp-widgets";
import { erpSuppliers, type ErpSupplier, purchaseOrders } from "@/features/admin/mock/erp";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersPage,
});

function SuppliersPage() {
  const [view, setView] = useState<"grid" | "list">("grid");
  const [active, setActive] = useState<ErpSupplier | null>(null);
  const activeCount = erpSuppliers.filter((s) => s.status === "active").length;
  const onTimeAvg = Math.round(erpSuppliers.reduce((s, x) => s + x.onTime, 0) / erpSuppliers.length);
  const totalSkus = erpSuppliers.reduce((s, x) => s + x.skus, 0);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Supply chain" }, { label: "Suppliers" }]}
        title="Suppliers"
        description="Manage vendors, lead times and purchase orders."
        actions={
          <>
            <div className="inline-flex rounded-xl bg-muted p-1">
              <button onClick={() => setView("grid")} className={`grid h-8 w-8 place-items-center rounded-lg ${view === "grid" ? "bg-card shadow" : "text-muted-foreground"}`}><LayoutGrid className="h-4 w-4" /></button>
              <button onClick={() => setView("list")} className={`grid h-8 w-8 place-items-center rounded-lg ${view === "list" ? "bg-card shadow" : "text-muted-foreground"}`}><List className="h-4 w-4" /></button>
            </div>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add supplier</Button>
          </>
        }
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Suppliers" value={erpSuppliers.length} icon={Truck} tint="primary" />
        <KpiCard label="Active" value={activeCount} icon={CalendarCheck} tint="emerald" />
        <KpiCard label="Total SKUs supplied" value={totalSkus} icon={PackageCheck} tint="sky" />
        <KpiCard label="On-time rate" value={`${onTimeAvg}%`} icon={MapPin} tint="amber" />
      </section>

      {view === "grid" ? (
        <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {erpSuppliers.map((s) => <SupplierCard key={s.id} s={s} onView={() => setActive(s)} />)}
        </section>
      ) : (
        <PanelCard title="Supplier directory" className="mt-6">
          <DataTable
            rows={erpSuppliers}
            columns={[
              { key: "name", label: "Supplier", render: (s) => <div><p className="text-sm font-semibold">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.contact}</p></div> },
              { key: "city", label: "City" },
              { key: "skus", label: "SKUs", className: "text-center" },
              { key: "onTime", label: "On-time", render: (s) => <span className="font-semibold">{s.onTime}%</span> },
              { key: "outstanding", label: "Outstanding", render: (s) => <span className={s.outstanding > 0 ? "font-semibold text-rose-600" : ""}>{inr(s.outstanding)}</span> },
              { key: "status", label: "Status", render: (s) => <StatusPill status={s.status === "onboarding" ? "invited" : s.status} /> },
            ]}
          />
        </PanelCard>
      )}

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Cell label="Contact" value={active.contact} />
                  <Cell label="Phone" value={active.phone} />
                  <Cell label="City" value={active.city} />
                  <Cell label="Terms" value={active.paymentTerms} />
                  <Cell label="Rating" value={`${active.rating} ★`} />
                  <Cell label="On-time" value={`${active.onTime}%`} />
                  <Cell label="Spend" value={inr(active.totalSpend)} />
                  <Cell label="Outstanding" value={inr(active.outstanding)} />
                </div>
                <PanelCard title="Recent purchase orders">
                  <ul className="space-y-2">
                    {purchaseOrders.filter((p) => p.supplier === active.name).slice(0, 5).map((po) => (
                      <li key={po.id} className="flex items-center justify-between rounded-xl border border-border/60 p-3 text-sm">
                        <span className="font-mono text-xs font-semibold">{po.id}</span>
                        <StatusPill status={po.status === "partial" ? "pending" : po.status === "ordered" ? "shipped" : po.status === "received" ? "delivered" : po.status} />
                      </li>
                    ))}
                    {purchaseOrders.filter((p) => p.supplier === active.name).length === 0 && <li className="text-xs text-muted-foreground">No recent POs.</li>}
                  </ul>
                </PanelCard>
                <PanelCard title="Communication">
                  <ul className="space-y-2 text-sm">
                    <li className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">3d ago · Email</p><p>Confirmed delivery for PO-08012 by Friday.</p></li>
                    <li className="rounded-xl border border-border/60 p-3"><p className="text-xs text-muted-foreground">1w ago · Call</p><p>Renegotiated Net 30 → Net 45.</p></li>
                  </ul>
                </PanelCard>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}