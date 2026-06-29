import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import {
  LayoutGrid,
  List,
  Activity,
  Search,
  Filter,
  Download,
  Printer,
  Truck,
  CheckCircle2,
  X,
  Split,
  User,
  FileText,
  AlertCircle,
  ShoppingCart,
  Timer,
  PackageCheck,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { OrderCard, OrderTimeline, StatusBadge, BulkToolbar, CommunicationPanel, ActivityTimeline } from "@/features/admin/components/ops-widgets";
import { FULFILL_STATUSES, type FulfillStatus, opsOrders, opsKpis, opsDrivers, opsComms } from "@/features/admin/mock/ops";
import { useOpsStore } from "@/store/ops";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/fulfillment")({ component: FulfillmentPage });

function FulfillmentPage() {
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const view = useOpsStore((s) => s.view);
  const setView = useOpsStore((s) => s.setView);
  const selected = useOpsStore((s) => s.selected);
  const toggleSelect = useOpsStore((s) => s.toggleSelect);
  const clear = useOpsStore((s) => s.clear);
  const setStatus = useOpsStore((s) => s.setStatus);
  const setStatusMany = useOpsStore((s) => s.setStatusMany);
  const overrides = useOpsStore((s) => s.statusOverrides);

  const orders = useMemo(
    () => opsOrders.map((o) => ({ ...o, status: overrides[o.id] ?? o.status })),
    [overrides],
  );

  const filtered = useMemo(
    () =>
      orders.filter((o) => {
        if (!q) return true;
        const s = q.toLowerCase();
        return o.id.toLowerCase().includes(s) || o.customer.toLowerCase().includes(s) || o.city.toLowerCase().includes(s);
      }),
    [orders, q],
  );

  const activeOrder = active ? orders.find((o) => o.id === active) : null;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Fulfillment" }]}
        title="Order Fulfillment Center"
        description="Real-time operations from new order to delivered — picking, packing, dispatch and tracking."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Exported queue (demo)")}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button className="rounded-xl" onClick={() => toast.success("New order draft created")}><ShoppingCart className="mr-2 h-4 w-4" /> New order</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="New today" value={opsKpis.todayOrders} icon={ShoppingCart} tint="primary" delta={12} />
        <KpiCard label="In progress" value={opsKpis.inProgress} icon={Timer} tint="amber" />
        <KpiCard label="Delivered" value={opsKpis.delivered} icon={PackageCheck} tint="emerald" delta={6.4} />
        <KpiCard label="Cancelled" value={opsKpis.cancelled} icon={X} tint="rose" delta={-2.1} />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by order, customer or city…" className="h-10 rounded-xl pl-9" />
        </div>
        <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
        <div className="ml-auto inline-flex items-center rounded-xl border border-border/60 bg-card p-1">
          {[{ k: "kanban", icon: LayoutGrid }, { k: "table", icon: List }, { k: "timeline", icon: Activity }].map((v) => (
            <button key={v.k} onClick={() => setView(v.k as never)} className={`grid h-8 w-8 place-items-center rounded-lg transition-colors ${view === v.k ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted"}`}>
              <v.icon className="h-4 w-4" />
            </button>
          ))}
        </div>
      </div>

      {view === "kanban" && (
        <div className="mt-4 flex gap-3 overflow-x-auto pb-3">
          {FULFILL_STATUSES.slice(0, 9).map((s) => {
            const rows = filtered.filter((o) => o.status === s.key).slice(0, 6);
            return (
              <div key={s.key} className="w-[280px] flex-shrink-0 rounded-2xl border border-border/60 bg-muted/30 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                  <span className="rounded-full bg-card px-1.5 py-0.5 text-[10px] font-bold">{filtered.filter((o) => o.status === s.key).length}</span>
                </div>
                <div className="space-y-2">
                  {rows.map((o) => (
                    <OrderCard key={o.id} order={o} selected={selected.includes(o.id)} onSelect={() => toggleSelect(o.id)} onClick={() => setActive(o.id)} />
                  ))}
                  {rows.length === 0 && <p className="rounded-xl border border-dashed border-border/60 p-3 text-center text-[11px] text-muted-foreground">No orders</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {view === "table" && (
        <PanelCard title="Orders" description={`${filtered.length} total`} className="mt-4">
          <DataTable
            rows={filtered.slice(0, 80)}
            columns={[
              { key: "id", label: "Order", render: (o) => <button onClick={() => setActive(o.id)} className="font-mono text-xs font-semibold text-primary hover:underline">{o.id}</button> },
              { key: "customer", label: "Customer", render: (o) => <div><p className="text-sm font-semibold">{o.customer}</p><p className="text-[11px] text-muted-foreground">{o.city}</p></div> },
              { key: "items", label: "Items", className: "text-center", render: (o) => o.itemsCount },
              { key: "total", label: "Total", render: (o) => <span className="font-semibold">{inr(o.total)}</span> },
              { key: "priority", label: "Priority", render: (o) => <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold capitalize">{o.priority}</span> },
              { key: "status", label: "Status", render: (o) => <StatusBadge status={o.status} /> },
              { key: "placedAt", label: "Placed", render: (o) => <span className="text-xs text-muted-foreground">{format(new Date(o.placedAt), "d MMM, HH:mm")}</span> },
            ]}
          />
        </PanelCard>
      )}

      {view === "timeline" && (
        <PanelCard title="Live activity" description="Most recent order events" className="mt-4">
          <ActivityTimeline
            items={filtered.slice(0, 20).map((o) => ({
              id: o.id,
              title: `${o.id} · ${o.customer}`,
              sub: `${o.itemsCount} items · ${inr(o.total)} · ${o.status}`,
              at: o.placedAt,
              tone: o.priority === "express" || o.priority === "vip" ? "bg-rose-500/10" : undefined,
            }))}
          />
        </PanelCard>
      )}

      <BulkToolbar
        count={selected.length}
        onClear={clear}
        actions={
          <>
            <Select onValueChange={(v) => { setStatusMany(selected, v as FulfillStatus); toast.success(`Moved ${selected.length} order(s)`); }}>
              <SelectTrigger className="h-8 w-[160px] rounded-lg text-xs"><SelectValue placeholder="Move to…" /></SelectTrigger>
              <SelectContent>
                {FULFILL_STATUSES.map((s) => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => toast.success("Picking list printed")}><Printer className="mr-1 h-3.5 w-3.5" /> Picking list</Button>
            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => toast.success("Labels generated")}><FileText className="mr-1 h-3.5 w-3.5" /> Labels</Button>
            <Button size="sm" variant="ghost" className="h-8 px-2" onClick={() => toast.success("Assigned to staff")}><User className="mr-1 h-3.5 w-3.5" /> Assign</Button>
          </>
        }
      />

      {/* Order details drawer */}
      <Sheet open={!!activeOrder} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-2xl">
          {activeOrder && (
            <div>
              <SheetHeader className="space-y-1">
                <div className="flex items-center gap-2">
                  <SheetTitle className="font-mono">{activeOrder.id}</SheetTitle>
                  <StatusBadge status={activeOrder.status} />
                </div>
                <p className="text-xs text-muted-foreground">Placed {format(new Date(activeOrder.placedAt), "d MMM, HH:mm")} · {activeOrder.channel.toUpperCase()} · {activeOrder.paymentMethod}</p>
              </SheetHeader>

              <div className="mt-5 grid grid-cols-1 gap-4">
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-bold">{activeOrder.customer}</p>
                      <p className="text-xs text-muted-foreground">{activeOrder.email} · {activeOrder.phone}</p>
                      <p className="mt-1 text-xs">{activeOrder.address}, {activeOrder.city} {activeOrder.pincode}</p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Button size="sm" variant="outline" className="rounded-lg">View customer</Button>
                      <Button size="sm" variant="ghost" className="rounded-lg">Message</Button>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Items</p>
                  <ul className="divide-y divide-border/50">
                    {activeOrder.items.map((it, i) => (
                      <li key={i} className="flex items-center justify-between py-2 text-sm">
                        <div><p className="font-medium">{it.name}</p><p className="text-[11px] text-muted-foreground">{it.sku} × {it.qty}</p></div>
                        <span className="font-semibold">{inr(it.price * it.qty)}</span>
                      </li>
                    ))}
                  </ul>
                  <Separator className="my-3" />
                  <div className="space-y-1 text-sm">
                    <Row label="Subtotal" v={inr(activeOrder.subtotal)} />
                    <Row label="Shipping" v={inr(activeOrder.shipping)} />
                    <Row label="Tax" v={inr(activeOrder.tax)} />
                    <Row label="Total" v={inr(activeOrder.total)} bold />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Fulfillment journey</p>
                    <OrderTimeline status={activeOrder.status} />
                  </div>
                  <div className="rounded-2xl border border-border/60 bg-card p-4">
                    <p className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Picking & packing</p>
                    <ul className="space-y-2 text-sm">
                      {activeOrder.items.map((it, i) => (
                        <li key={i} className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-primary" /> {it.qty} × {it.name}</li>
                      ))}
                    </ul>
                    <Separator className="my-3" />
                    <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">Assigned driver</p>
                    <Select defaultValue={activeOrder.driverId} onValueChange={() => toast.success("Driver reassigned")}>
                      <SelectTrigger className="h-9 rounded-lg"><SelectValue placeholder="Assign driver" /></SelectTrigger>
                      <SelectContent>{opsDrivers.slice(0, 12).map((d) => <SelectItem key={d.id} value={d.id}>{d.name} · {d.zone}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-xl" onClick={() => { setStatus(activeOrder.id, "picking"); toast.success("Moved to Picking"); }}><PackageCheck className="mr-2 h-4 w-4" /> Start picking</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Shipping label generated")}><Printer className="mr-2 h-4 w-4" /> Shipping label</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Packing slip downloaded")}><FileText className="mr-2 h-4 w-4" /> Packing slip</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Invoice PDF ready")}><FileText className="mr-2 h-4 w-4" /> Invoice</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Order split — 2 child orders created")}><Split className="mr-2 h-4 w-4" /> Split</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Driver assigned")}><Truck className="mr-2 h-4 w-4" /> Assign driver</Button>
                  <Button variant="outline" className="rounded-xl text-rose-600" onClick={() => { setStatus(activeOrder.id, "cancelled"); toast.error("Order cancelled"); }}><AlertCircle className="mr-2 h-4 w-4" /> Cancel</Button>
                </div>

                <CommunicationPanel comms={opsComms.filter((c) => c.customerId === activeOrder.customerId).slice(0, 6)} />
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Row({ label, v, bold }: { label: string; v: string; bold?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className={bold ? "text-sm font-bold" : "text-muted-foreground"}>{label}</span>
      <span className={bold ? "font-display text-base font-extrabold" : "font-semibold"}>{v}</span>
    </div>
  );
}
