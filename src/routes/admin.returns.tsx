import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { RotateCcw, Search, ImageIcon, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { ReturnCard, RefundTimeline } from "@/features/admin/components/ops-widgets";
import { opsReturns } from "@/features/admin/mock/ops";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/returns")({ component: ReturnsPage });

const TABS = ["all", "requested", "inspection", "approved", "rejected", "pickup", "refunded", "replaced", "exchanged"] as const;

function ReturnsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("all");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const list = useMemo(() => opsReturns.filter((r) => (tab === "all" || r.status === tab) && (!q || r.id.toLowerCase().includes(q.toLowerCase()) || r.product.toLowerCase().includes(q.toLowerCase()))), [tab, q]);
  const detail = active ? opsReturns.find((r) => r.id === active) : null;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Returns" }]}
        title="Returns & refunds"
        description="From request to inspection, approval and refund — all in one workflow."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total returns" value={opsReturns.length} icon={RotateCcw} tint="primary" />
        <KpiCard label="Pending inspection" value={opsReturns.filter((r) => r.status === "inspection").length} icon={RotateCcw} tint="amber" />
        <KpiCard label="Refunded" value={opsReturns.filter((r) => r.status === "refunded").length} icon={RotateCcw} tint="emerald" />
        <KpiCard label="Refund value" value={inr(opsReturns.filter((r) => r.status === "refunded").reduce((s, r) => s + r.amount, 0))} icon={RotateCcw} tint="violet" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search returns…" className="h-10 rounded-xl pl-9" />
        </div>
        <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" /> Filters</Button>
      </div>

      <Tabs value={tab} onValueChange={(v) => setTab(v as never)} className="mt-3">
        <TabsList className="flex-wrap rounded-xl">{TABS.map((t) => <TabsTrigger key={t} value={t} className="capitalize text-xs">{t}</TabsTrigger>)}</TabsList>
      </Tabs>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.slice(0, 30).map((r) => <ReturnCard key={r.id} r={r} onClick={() => setActive(r.id)} />)}
      </section>

      <Sheet open={!!detail} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {detail && (
            <div>
              <SheetHeader><SheetTitle className="font-mono">{detail.id}</SheetTitle></SheetHeader>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="text-sm font-bold">{detail.product}</p>
                  <p className="text-[11px] text-muted-foreground">Order {detail.orderId} · {detail.customer}</p>
                  <p className="mt-2 text-xs">Reason: <span className="font-medium">{detail.reason}</span></p>
                  <p className="text-xs">Refund method: <span className="font-medium capitalize">{detail.refundMethod.replace("-", " ")}</span></p>
                  <p className="mt-1 font-display text-xl font-extrabold">{inr(detail.amount)}</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-4">
                  <p className="mb-3 text-xs font-bold uppercase text-muted-foreground">Workflow</p>
                  <RefundTimeline status={detail.status} />
                </div>
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-center text-xs text-muted-foreground">
                  <ImageIcon className="mx-auto mb-1 h-5 w-5" /> Image upload placeholder
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button className="rounded-xl" onClick={() => toast.success("Return approved")}>Approve</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Refund issued via " + detail.refundMethod)}>Issue refund</Button>
                  <Button variant="outline" className="rounded-xl" onClick={() => toast.success("Replacement scheduled")}>Replace</Button>
                  <Button variant="outline" className="rounded-xl text-rose-600" onClick={() => toast.error("Return rejected")}>Reject</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
