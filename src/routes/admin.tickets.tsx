import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { LifeBuoy, Search, Plus, Send, Star, MessageSquare, Phone, BookOpen } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { TicketCard } from "@/features/admin/components/ops-widgets";
import { opsTickets } from "@/features/admin/mock/ops";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/tickets")({ component: TicketsPage });

const TABS = ["all", "open", "pending", "resolved", "closed", "escalated"] as const;

function TicketsPage() {
  const [tab, setTab] = useState<(typeof TABS)[number]>("open");
  const [q, setQ] = useState("");
  const [active, setActive] = useState<string | null>(null);
  const list = useMemo(() => opsTickets.filter((t) => (tab === "all" || t.status === tab) && (!q || t.subject.toLowerCase().includes(q.toLowerCase()) || t.id.toLowerCase().includes(q.toLowerCase()))), [tab, q]);
  const ticket = active ? opsTickets.find((t) => t.id === active) : null;
  const csat = (opsTickets.filter((t) => t.satisfaction).reduce((s, t) => s + (t.satisfaction ?? 0), 0) / opsTickets.filter((t) => t.satisfaction).length).toFixed(1);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Support" }]}
        title="Customer support"
        description="Tickets, live chat, calls and knowledge base."
        actions={
          <>
            <Link to="/admin/knowledge-base"><Button variant="outline" className="rounded-xl"><BookOpen className="mr-2 h-4 w-4" /> Knowledge base</Button></Link>
            <Button className="rounded-xl" onClick={() => toast.success("New ticket created")}><Plus className="mr-2 h-4 w-4" /> New ticket</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Open tickets" value={opsTickets.filter((t) => t.status === "open").length} icon={LifeBuoy} tint="primary" />
        <KpiCard label="Escalated" value={opsTickets.filter((t) => t.status === "escalated").length} icon={LifeBuoy} tint="rose" />
        <KpiCard label="Avg CSAT" value={`${csat} / 5`} icon={Star} tint="amber" />
        <KpiCard label="Resolved (7d)" value={opsTickets.filter((t) => t.status === "resolved").length} icon={LifeBuoy} tint="emerald" />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative min-w-[220px] flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search tickets…" className="h-10 rounded-xl pl-9" />
        </div>
        <Tabs value={tab} onValueChange={(v) => setTab(v as never)}>
          <TabsList className="rounded-xl">{TABS.map((t) => <TabsTrigger key={t} value={t} className="capitalize text-xs">{t}</TabsTrigger>)}</TabsList>
        </Tabs>
      </div>

      <section className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {list.slice(0, 24).map((t) => <TicketCard key={t.id} t={t} onClick={() => setActive(t.id)} />)}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <PanelCard title="Live chat" description="Placeholder"><div className="flex flex-col items-center justify-center gap-2 py-6 text-center"><MessageSquare className="h-8 w-8 text-primary" /><p className="text-sm font-semibold">3 visitors waiting</p><Button size="sm" className="rounded-xl">Open inbox</Button></div></PanelCard>
        <PanelCard title="Call log" description="Placeholder"><div className="flex flex-col items-center justify-center gap-2 py-6 text-center"><Phone className="h-8 w-8 text-primary" /><p className="text-sm font-semibold">12 calls today · avg 4m 22s</p><Button size="sm" variant="outline" className="rounded-xl">View recordings</Button></div></PanelCard>
        <PanelCard title="Knowledge base"><Link to="/admin/knowledge-base"><div className="flex flex-col items-center justify-center gap-2 py-6 text-center"><BookOpen className="h-8 w-8 text-primary" /><p className="text-sm font-semibold">38 articles · 28k reads</p><Button size="sm" variant="outline" className="rounded-xl">Manage</Button></div></Link></PanelCard>
      </section>

      <Sheet open={!!ticket} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          {ticket && (
            <div>
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <span className="font-mono text-sm">{ticket.id}</span>
                  <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", ticket.priority === "urgent" ? "bg-rose-500/10 text-rose-600" : "bg-amber-500/10 text-amber-600")}>{ticket.priority}</span>
                </SheetTitle>
              </SheetHeader>
              <div className="mt-3 space-y-3">
                <p className="text-base font-bold">{ticket.subject}</p>
                <p className="text-xs text-muted-foreground">{ticket.customer} · {ticket.category} · Assigned to {ticket.assignee}</p>
                <div className="space-y-2">
                  {ticket.messages.map((m, i) => (
                    <div key={i} className={cn("max-w-[85%] rounded-2xl p-3 text-sm", m.from === "agent" ? "ml-auto bg-primary text-primary-foreground" : m.from === "system" ? "mx-auto bg-muted text-center text-xs text-muted-foreground" : "bg-muted")}>
                      <p>{m.text}</p>
                      <p className="mt-1 text-[10px] opacity-70">{format(new Date(m.at), "d MMM, HH:mm")}</p>
                    </div>
                  ))}
                </div>
                <div className="rounded-2xl border border-border/60 bg-card p-2">
                  <div className="flex items-center gap-2">
                    <input className="h-10 flex-1 bg-transparent text-sm outline-none" placeholder="Reply to customer…" />
                    <Button size="sm" className="rounded-xl" onClick={() => toast.success("Reply sent")}><Send className="mr-1 h-3.5 w-3.5" /> Send</Button>
                  </div>
                  <p className="px-2 pb-1 pt-0 text-[10px] text-muted-foreground">Press / for canned replies · attach files via 📎</p>
                </div>
                <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-3 text-xs text-muted-foreground">
                  Internal note: customer has 3 prior orders this week. Offer ₹100 wallet credit on resolution.
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" className="rounded-xl" onClick={() => toast.success("Marked resolved")}>Resolve</Button>
                  <Button size="sm" variant="outline" className="rounded-xl text-rose-600" onClick={() => toast("Escalated to senior")}>Escalate</Button>
                  <Button size="sm" variant="ghost" className="rounded-xl">Reassign</Button>
                </div>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
