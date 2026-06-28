import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Printer, FileText, ClipboardList, IndianRupee, Truck, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { PurchaseOrderCard, ApprovalTimeline } from "@/features/admin/components/erp-widgets";
import { purchaseOrders, type PurchaseOrder } from "@/features/admin/mock/erp";
import { inr } from "@/lib/format";
import { format } from "date-fns";

export const Route = createFileRoute("/admin/purchase-orders")({ component: POPage });

function POPage() {
  const [tab, setTab] = useState<string>("all");
  const [active, setActive] = useState<PurchaseOrder | null>(null);

  const filtered = useMemo(
    () => purchaseOrders.filter((p) => tab === "all" || p.status === tab),
    [tab],
  );

  const totalValue = purchaseOrders.reduce(
    (s, p) => s + p.items.reduce((a, it) => a + it.qty * it.cost, 0),
    0,
  );

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Purchase Orders" }]}
        title="Purchase orders"
        description="Create, approve and receive POs across suppliers."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button className="rounded-xl" onClick={() => toast.success("New PO drafted")}><Plus className="mr-2 h-4 w-4" /> New PO</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total POs" value={purchaseOrders.length} icon={ClipboardList} tint="primary" />
        <KpiCard label="Order value" value={inr(totalValue)} icon={IndianRupee} tint="violet" />
        <KpiCard label="In transit" value={purchaseOrders.filter((p) => p.status === "ordered").length} icon={Truck} tint="sky" />
        <KpiCard label="Received this week" value={purchaseOrders.filter((p) => p.status === "received").length} icon={CheckCircle2} tint="emerald" />
      </section>

      <div className="mt-6">
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="rounded-xl">
            {["all","draft","approved","ordered","partial","received","cancelled"].map((s) => (
              <TabsTrigger key={s} value={s} className="capitalize">{s}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((po) => <PurchaseOrderCard key={po.id} po={po} onOpen={() => setActive(po)} />)}
      </section>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full max-w-2xl overflow-y-auto sm:max-w-2xl">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle className="flex items-center justify-between">
                  <span>{active.id} · {active.supplier}</span>
                  <span className="flex gap-2">
                    <Button size="sm" variant="outline" className="rounded-xl"><Printer className="mr-1.5 h-3.5 w-3.5" /> Print</Button>
                    <Button size="sm" variant="outline" className="rounded-xl"><FileText className="mr-1.5 h-3.5 w-3.5" /> PDF</Button>
                  </span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-6">
                <div className="grid grid-cols-3 gap-3 text-sm">
                  <Meta label="Warehouse" value={active.warehouse} />
                  <Meta label="Created" value={format(new Date(active.createdAt), "d MMM yyyy")} />
                  <Meta label="Expected" value={format(new Date(active.expectedAt), "d MMM yyyy")} />
                </div>
                <PanelCard title="Items">
                  <div className="overflow-hidden rounded-xl border border-border/60">
                    <table className="w-full text-sm">
                      <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                        <tr>{["Item","Ordered","Received","Cost","Tax","Subtotal"].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
                      </thead>
                      <tbody className="divide-y divide-border/60">
                        {active.items.map((it) => (
                          <tr key={it.productId}>
                            <td className="px-3 py-2"><span className="mr-2">{it.emoji}</span>{it.name}</td>
                            <td className="px-3 py-2">{it.qty}</td>
                            <td className="px-3 py-2">{it.received}</td>
                            <td className="px-3 py-2">{inr(it.cost)}</td>
                            <td className="px-3 py-2">{it.tax}%</td>
                            <td className="px-3 py-2 font-semibold">{inr(it.qty * it.cost)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Subtotal</span><span>{inr(active.items.reduce((s, it) => s + it.qty * it.cost, 0))}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tax</span><span>{inr(Math.round(active.items.reduce((s, it) => s + (it.qty * it.cost * it.tax) / 100, 0)))}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Shipping</span><span>{inr(active.shipping)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Discount</span><span>− {inr(active.discount)}</span></div>
                  </div>
                </PanelCard>
                <PanelCard title="Approval timeline">
                  <ApprovalTimeline
                    steps={[
                      { label: "Drafted", by: "Priya Kapoor", at: format(new Date(active.createdAt), "d MMM"), status: "done" },
                      { label: "Approved", by: active.approver, at: "Today", status: active.status === "draft" ? "current" : "done" },
                      { label: "Sent to supplier", by: "System", at: "Today", status: active.status === "ordered" || active.status === "received" || active.status === "partial" ? "done" : "pending" },
                      { label: "Received", by: active.status === "received" ? "Vikram Singh" : undefined, status: active.status === "received" ? "done" : active.status === "partial" ? "current" : "pending" },
                    ]}
                  />
                </PanelCard>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}