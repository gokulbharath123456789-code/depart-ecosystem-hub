import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { format } from "date-fns";
import { Search, Users, IndianRupee, Star, UserPlus, MessageSquare, Heart, ShoppingBag, Tags, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { CustomerProfileCard, LoyaltyCard, CommunicationPanel, ActivityTimeline } from "@/features/admin/components/ops-widgets";
import { opsCustomers, opsOrders, opsComms, opsTickets, opsReturns } from "@/features/admin/mock/ops";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/crm")({ component: CrmPage });

const SEGMENTS = ["all", "VIP", "Loyal", "Regular", "New", "At Risk"] as const;

function CrmPage() {
  const [q, setQ] = useState("");
  const [seg, setSeg] = useState<(typeof SEGMENTS)[number]>("all");
  const [activeId, setActiveId] = useState<string | null>(null);
  const list = useMemo(() => opsCustomers.filter((c) => (seg === "all" || c.segment === seg) && (!q || c.name.toLowerCase().includes(q.toLowerCase()) || c.email.toLowerCase().includes(q.toLowerCase()))), [q, seg]);
  const active = activeId ? opsCustomers.find((c) => c.id === activeId) : null;
  const totalLtv = opsCustomers.reduce((s, c) => s + c.ltv, 0);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "CRM" }]}
        title="Customer CRM"
        description="360° profiles — purchase history, LTV, loyalty, communication, tickets and segments."
        actions={<Button className="rounded-xl"><UserPlus className="mr-2 h-4 w-4" /> Add customer</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Customers" value={opsCustomers.length} icon={Users} tint="primary" />
        <KpiCard label="Lifetime value" value={inr(totalLtv)} icon={IndianRupee} tint="sky" />
        <KpiCard label="VIP" value={opsCustomers.filter((c) => c.segment === "VIP").length} icon={Star} tint="violet" />
        <KpiCard label="At risk" value={opsCustomers.filter((c) => c.segment === "At Risk").length} icon={Bell} tint="amber" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search customers…" className="h-10 rounded-xl pl-9" />
        </div>
        <Tabs value={seg} onValueChange={(v) => setSeg(v as never)}>
          <TabsList className="rounded-xl">{SEGMENTS.map((s) => <TabsTrigger key={s} value={s} className="capitalize text-xs">{s}</TabsTrigger>)}</TabsList>
        </Tabs>
      </div>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.slice(0, 30).map((c) => <CustomerProfileCard key={c.id} c={c} onClick={() => setActiveId(c.id)} />)}
      </section>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActiveId(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-3xl">
          {active && (
            <CustomerDetail c={active} />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function CustomerDetail({ c }: { c: typeof opsCustomers[number] }) {
  const orders = opsOrders.filter((o) => o.customerId === c.id).slice(0, 8);
  const comms = opsComms.filter((m) => m.customerId === c.id).slice(0, 8);
  const returns = opsReturns.filter((r) => orders.some((o) => o.id === r.orderId)).slice(0, 4);
  const tickets = opsTickets.filter((t) => t.customer === c.name).slice(0, 3);
  return (
    <div>
      <SheetHeader>
        <SheetTitle>{c.name}</SheetTitle>
      </SheetHeader>
      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <LoyaltyCard c={c} />
        <div className="rounded-2xl border border-border/60 bg-card p-4">
          <p className="text-xs font-bold uppercase text-muted-foreground">Personal</p>
          <p className="mt-1 text-sm">{c.email}</p>
          <p className="text-sm">{c.phone}</p>
          <p className="text-sm">{c.city}</p>
          <Separator className="my-3" />
          <p className="text-xs font-bold uppercase text-muted-foreground">Tags</p>
          <div className="mt-2 flex flex-wrap gap-1">{c.tags.map((t) => <span key={t} className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-[11px] font-medium"><Tags className="h-3 w-3" /> {t}</span>)}</div>
          <Separator className="my-3" />
          <p className="text-xs font-bold uppercase text-muted-foreground">Favorite categories</p>
          <div className="mt-2 flex flex-wrap gap-1">{c.favoriteCategories.map((cat) => <span key={cat} className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">{cat}</span>)}</div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Marketing preferences">
          <ul className="space-y-2 text-sm">
            {(["email", "sms", "push", "whatsapp"] as const).map((k) => (
              <li key={k} className="flex items-center justify-between"><span className="capitalize">{k}</span><Switch defaultChecked={c.marketingOptIn[k]} /></li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="Recent orders" description={`${orders.length} shown`}>
          <ul className="space-y-2">
            {orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-2 text-xs">
                <span className="font-mono font-semibold">{o.id}</span>
                <span>{o.itemsCount} items</span>
                <span className="font-bold">{inr(o.total)}</span>
              </li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="Wallet & wishlist">
          <p className="text-xs text-muted-foreground">Wallet balance</p>
          <p className="font-display text-2xl font-extrabold">{inr(c.wallet)}</p>
          <Separator className="my-3" />
          <p className="text-xs text-muted-foreground">Wishlist</p>
          <p className="flex items-center gap-1 text-sm font-semibold"><Heart className="h-4 w-4 fill-rose-500 text-rose-500" /> 14 items</p>
        </PanelCard>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="Activity timeline">
          <ActivityTimeline items={orders.map((o) => ({ id: o.id, title: `Order ${o.id}`, sub: `${o.itemsCount} items · ${inr(o.total)}`, at: o.placedAt, icon: <ShoppingBag className="h-3 w-3" /> }))} />
        </PanelCard>
        <CommunicationPanel comms={comms} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="Returns" description={`${returns.length}`}>
          <ul className="space-y-2">{returns.map((r) => <li key={r.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-2 text-xs"><span className="font-mono">{r.id}</span><span>{r.product}</span><span className="capitalize">{r.status}</span></li>)}</ul>
        </PanelCard>
        <PanelCard title="Support tickets" description={`${tickets.length}`}>
          <ul className="space-y-2">{tickets.map((t) => <li key={t.id} className="flex items-center justify-between rounded-xl bg-muted/30 p-2 text-xs"><span className="font-mono">{t.id}</span><span className="truncate">{t.subject}</span><span className="capitalize">{t.status}</span></li>)}</ul>
        </PanelCard>
      </div>

      <div className="mt-4 rounded-2xl border border-border/60 bg-card p-4">
        <p className="text-xs font-bold uppercase text-muted-foreground">Internal notes</p>
        <textarea className="mt-2 min-h-[80px] w-full rounded-xl border border-border/60 bg-background p-3 text-sm outline-none focus:ring-2 focus:ring-primary/30" placeholder="Add a note about this customer…" defaultValue="Prefers evening delivery slots. Frequently re-orders pantry staples." />
      </div>
    </div>
  );
}
