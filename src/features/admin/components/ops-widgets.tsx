import { motion } from "framer-motion";
import type { ReactNode } from "react";
import {
  Truck,
  Star,
  Mail,
  MessageSquare,
  Phone,
  Bell,
  Send,
  CheckCircle2,
  Clock,
  AlertCircle,
  IndianRupee,
  CreditCard,
  Sparkles,
  RotateCcw,
  Package,
  PackageCheck,
  MapPin,
  ClipboardList,
  FileText,
  Boxes,
  AlertTriangle,
  CircleDot,
  X,
} from "lucide-react";
import { format, formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  FULFILL_STATUSES,
  type FulfillStatus,
  type OpsOrder,
  type OpsDriver,
  type OpsCustomer,
  type OpsReturn,
  type OpsCampaign,
  type OpsTicket,
  type Workflow,
  type WorkflowStep,
  type OpsComm,
  loyaltyTiers,
} from "@/features/admin/mock/ops";

const STATUS_MAP = Object.fromEntries(FULFILL_STATUSES.map((s) => [s.key, s]));

// ─── StatusBadge ───
export function StatusBadge({ status }: { status: FulfillStatus }) {
  const s = STATUS_MAP[status];
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset", s.tone)}>
      <CircleDot className="h-2.5 w-2.5" />
      {s.label}
    </span>
  );
}

const priorityTone: Record<string, string> = {
  vip: "bg-violet-500/10 text-violet-600",
  express: "bg-rose-500/10 text-rose-600",
  scheduled: "bg-sky-500/10 text-sky-600",
  standard: "bg-muted text-muted-foreground",
};

// ─── OrderCard (kanban tile) ───
export function OrderCard({
  order,
  selected,
  onSelect,
  onClick,
}: {
  order: OpsOrder;
  selected?: boolean;
  onSelect?: () => void;
  onClick?: () => void;
}) {
  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      onClick={onClick}
      className={cn(
        "group w-full rounded-2xl border bg-card p-3 text-left soft-shadow transition-colors hover:bg-muted/30",
        selected ? "border-primary ring-2 ring-primary/30" : "border-border/60",
      )}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold">{order.id}</span>
        <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-semibold capitalize", priorityTone[order.priority])}>{order.priority}</span>
      </div>
      <p className="truncate text-sm font-semibold">{order.customer}</p>
      <p className="truncate text-[11px] text-muted-foreground">{order.city} · {order.itemsCount} items · {order.slot}</p>
      <div className="mt-2 flex items-center justify-between">
        <span className="font-display text-sm font-extrabold">{inr(order.total)}</span>
        <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(order.placedAt), { addSuffix: true })}</span>
      </div>
      {onSelect && (
        <div className="mt-2 flex items-center justify-between">
          <label className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
            <input type="checkbox" checked={!!selected} onChange={(e) => { e.stopPropagation(); onSelect(); }} onClick={(e) => e.stopPropagation()} className="h-3.5 w-3.5 rounded border-border" />
            Select
          </label>
          <span className="text-[11px] font-medium text-muted-foreground">{order.paymentMethod}</span>
        </div>
      )}
    </motion.button>
  );
}

// ─── OrderTimeline (vertical fulfillment journey) ───
export function OrderTimeline({ status }: { status: FulfillStatus }) {
  const flow: FulfillStatus[] = ["new", "confirmed", "picking", "packing", "ready", "assigned", "out-for-delivery", "delivered"];
  const idx = Math.max(0, flow.indexOf(status));
  return (
    <ol className="relative ml-2 space-y-3 border-l border-border/60 pl-5">
      {flow.map((step, i) => {
        const active = i <= idx;
        const s = STATUS_MAP[step];
        return (
          <li key={step} className="relative">
            <span className={cn("absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full ring-2", active ? "bg-primary text-primary-foreground ring-primary/30" : "bg-muted text-muted-foreground ring-border")}>
              {active ? <CheckCircle2 className="h-3 w-3" /> : <CircleDot className="h-2.5 w-2.5" />}
            </span>
            <p className={cn("text-sm font-semibold", !active && "text-muted-foreground")}>{s.label}</p>
            <p className="text-[11px] text-muted-foreground">{active ? "Completed" : "Pending"}</p>
          </li>
        );
      })}
    </ol>
  );
}

// ─── Driver card ───
export function DeliveryCard({ d, onAssign }: { d: OpsDriver; onAssign?: () => void }) {
  const tone: Record<string, string> = {
    available: "bg-emerald-500/10 text-emerald-600",
    "on-delivery": "bg-sky-500/10 text-sky-600",
    break: "bg-amber-500/10 text-amber-600",
    "off-duty": "bg-muted text-muted-foreground",
  };
  return (
    <div className="group flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow hover:lift-shadow">
      <div className="flex items-center gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/15 text-sm font-bold text-primary">{d.avatar}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{d.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{d.vehicle} · {d.plate}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", tone[d.status])}>{d.status.replace("-", " ")}</span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/40 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Today</p>
          <p className="text-sm font-bold">{d.deliveriesToday}</p>
        </div>
        <div className="rounded-xl bg-muted/40 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">On-time</p>
          <p className="text-sm font-bold">{d.onTime}%</p>
        </div>
        <div className="rounded-xl bg-muted/40 p-2">
          <p className="text-[10px] uppercase text-muted-foreground">Rating</p>
          <p className="flex items-center justify-center gap-0.5 text-sm font-bold"><Star className="h-3 w-3 fill-amber-400 text-amber-500" /> {d.rating}</p>
        </div>
      </div>
      <div className="flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {d.zone}</span>
        <span className="inline-flex items-center gap-1"><IndianRupee className="h-3 w-3" /> {d.cashCollected.toLocaleString("en-IN")}</span>
      </div>
      {onAssign && (
        <Button size="sm" variant="outline" className="rounded-xl" onClick={onAssign}>
          <Truck className="mr-1 h-3.5 w-3.5" /> Assign order
        </Button>
      )}
    </div>
  );
}

// ─── Customer profile card (compact) ───
export function CustomerProfileCard({ c, onClick }: { c: OpsCustomer; onClick?: () => void }) {
  const tierColors: Record<string, string> = {
    Silver: "from-slate-300 to-slate-500",
    Gold: "from-amber-300 to-amber-500",
    Platinum: "from-violet-400 to-fuchsia-500",
  };
  return (
    <button onClick={onClick} className="group w-full rounded-2xl border border-border/60 bg-card p-4 text-left soft-shadow hover:lift-shadow">
      <div className="flex items-center gap-3">
        <span className={cn("grid h-12 w-12 place-items-center rounded-full bg-gradient-to-br text-sm font-bold text-white shadow", tierColors[c.tier])}>{c.name.split(" ").map((n) => n[0]).join("")}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{c.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{c.email}</p>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px]">{c.tier}</Badge>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">LTV</p><p className="text-xs font-bold">{inr(c.ltv)}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Orders</p><p className="text-xs font-bold">{c.orders}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Points</p><p className="text-xs font-bold">{c.points.toLocaleString()}</p></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-1">
        {c.tags.slice(0, 3).map((t) => <span key={t} className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium">{t}</span>)}
      </div>
    </button>
  );
}

// ─── Loyalty card ───
export function LoyaltyCard({ c }: { c: OpsCustomer }) {
  const current = loyaltyTiers.find((t) => t.name === c.tier)!;
  const next = loyaltyTiers.find((t) => t.min > current.min);
  const pct = next ? Math.min(100, Math.round((c.ltv / next.min) * 100)) : 100;
  return (
    <div className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white soft-shadow", current.color)}>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-widest opacity-90">SREE SUPER MART Loyalty</p>
          <p className="font-display text-2xl font-extrabold tracking-tight">{current.name} Member</p>
        </div>
        <Sparkles className="h-6 w-6" />
      </div>
      <div className="relative mt-6">
        <div className="flex items-center justify-between text-[11px]">
          <span>{c.points.toLocaleString()} pts</span>
          {next ? <span>{(next.min - c.ltv).toLocaleString()} to {next.name}</span> : <span>Top tier reached</span>}
        </div>
        <div className="mt-1 h-2 overflow-hidden rounded-full bg-white/25"><div className="h-full rounded-full bg-white" style={{ width: pct + "%" }} /></div>
      </div>
      <ul className="relative mt-4 space-y-1 text-xs">
        {current.perks.map((p) => <li key={p} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> {p}</li>)}
      </ul>
    </div>
  );
}

// ─── Campaign card ───
const camTone: Record<string, string> = {
  live: "bg-emerald-500/10 text-emerald-600",
  scheduled: "bg-sky-500/10 text-sky-600",
  paused: "bg-amber-500/10 text-amber-600",
  draft: "bg-muted text-muted-foreground",
  ended: "bg-rose-500/10 text-rose-600",
};
export function CampaignCard({ c }: { c: OpsCampaign }) {
  return (
    <div className="group rounded-2xl border border-border/60 bg-card p-4 soft-shadow hover:lift-shadow">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-bold">{c.name}</p>
          <p className="text-[11px] text-muted-foreground">{c.type} · {c.audience}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", camTone[c.status])}>{c.status}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Reach</p><p className="text-xs font-bold">{c.reach.toLocaleString()}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Conv.</p><p className="text-xs font-bold">{c.conversions.toLocaleString()}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] uppercase text-muted-foreground">Revenue</p><p className="text-xs font-bold">{inr(c.revenue)}</p></div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>{format(new Date(c.startAt), "d MMM")} → {format(new Date(c.endAt), "d MMM")}</span>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs">Edit</Button>
      </div>
    </div>
  );
}

// ─── Return card ───
const retTone: Record<string, string> = {
  requested: "bg-amber-500/10 text-amber-600",
  inspection: "bg-sky-500/10 text-sky-600",
  approved: "bg-emerald-500/10 text-emerald-600",
  rejected: "bg-rose-500/10 text-rose-600",
  pickup: "bg-violet-500/10 text-violet-600",
  refunded: "bg-fuchsia-500/10 text-fuchsia-600",
  replaced: "bg-primary/10 text-primary",
  exchanged: "bg-teal-500/10 text-teal-600",
};
export function ReturnCard({ r, onClick }: { r: OpsReturn; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl border border-border/60 bg-card p-4 text-left soft-shadow hover:lift-shadow">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold">{r.id}</span>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", retTone[r.status])}>{r.status}</span>
      </div>
      <p className="mt-2 truncate text-sm font-semibold">{r.product}</p>
      <p className="truncate text-[11px] text-muted-foreground">{r.customer} · Order {r.orderId}</p>
      <p className="mt-1 text-[11px] text-muted-foreground">Reason: <span className="font-medium text-foreground">{r.reason}</span></p>
      <div className="mt-3 flex items-center justify-between">
        <span className="rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-medium capitalize">{r.refundMethod.replace("-", " ")}</span>
        <span className="font-display text-sm font-extrabold">{inr(r.amount)}</span>
      </div>
    </button>
  );
}

// ─── RefundTimeline ───
export function RefundTimeline({ status }: { status: OpsReturn["status"] }) {
  const steps = ["requested", "inspection", "approved", "pickup", "refunded"] as const;
  const idx = steps.indexOf(status as (typeof steps)[number]);
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
      {steps.map((s, i) => {
        const active = i <= idx;
        return (
          <div key={s} className="flex items-center gap-2">
            <span className={cn("grid h-7 w-7 place-items-center rounded-full text-[11px] font-bold", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground")}>{i + 1}</span>
            <span className={cn("text-xs capitalize", active ? "font-semibold" : "text-muted-foreground")}>{s}</span>
            {i < steps.length - 1 && <span className="hidden h-px w-6 bg-border sm:block" />}
          </div>
        );
      })}
    </ol>
  );
}

// ─── Ticket card ───
const prioTone: Record<string, string> = {
  urgent: "bg-rose-500/10 text-rose-600",
  high: "bg-orange-500/10 text-orange-600",
  medium: "bg-amber-500/10 text-amber-600",
  low: "bg-muted text-muted-foreground",
};
const tStatusTone: Record<string, string> = {
  open: "bg-sky-500/10 text-sky-600",
  pending: "bg-amber-500/10 text-amber-600",
  resolved: "bg-emerald-500/10 text-emerald-600",
  closed: "bg-muted text-muted-foreground",
  escalated: "bg-rose-500/10 text-rose-600",
};
export function TicketCard({ t, onClick }: { t: OpsTicket; onClick?: () => void }) {
  return (
    <button onClick={onClick} className="w-full rounded-2xl border border-border/60 bg-card p-4 text-left soft-shadow hover:lift-shadow">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11px] font-semibold">{t.id}</span>
        <div className="flex items-center gap-1">
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", prioTone[t.priority])}>{t.priority}</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", tStatusTone[t.status])}>{t.status}</span>
        </div>
      </div>
      <p className="mt-2 truncate text-sm font-semibold">{t.subject}</p>
      <p className="truncate text-[11px] text-muted-foreground">{t.customer} · {t.category}</p>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Assigned to {t.assignee}</span>
        <span>{formatDistanceToNow(new Date(t.updatedAt), { addSuffix: true })}</span>
      </div>
    </button>
  );
}

// ─── Activity timeline (generic) ───
export function ActivityTimeline({ items }: { items: { id: string; icon?: ReactNode; title: string; sub?: string; at: string; tone?: string }[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-5">
      {items.map((it) => (
        <li key={it.id} className="relative">
          <span className={cn("absolute -left-[27px] grid h-5 w-5 place-items-center rounded-full bg-card ring-2 ring-border", it.tone)}>
            {it.icon ?? <CircleDot className="h-3 w-3" />}
          </span>
          <p className="text-sm font-semibold">{it.title}</p>
          {it.sub && <p className="text-xs text-muted-foreground">{it.sub}</p>}
          <p className="text-[11px] text-muted-foreground">{format(new Date(it.at), "d MMM, HH:mm")}</p>
        </li>
      ))}
    </ol>
  );
}

// ─── Communication panel ───
const chanIcon: Record<string, ReactNode> = {
  email: <Mail className="h-3.5 w-3.5" />,
  sms: <MessageSquare className="h-3.5 w-3.5" />,
  whatsapp: <MessageSquare className="h-3.5 w-3.5" />,
  push: <Bell className="h-3.5 w-3.5" />,
  call: <Phone className="h-3.5 w-3.5" />,
};
const commStatusTone: Record<string, string> = {
  sent: "text-muted-foreground",
  delivered: "text-sky-600",
  read: "text-emerald-600",
  failed: "text-rose-600",
};
export function CommunicationPanel({ comms, onSend }: { comms: OpsComm[]; onSend?: (channel: string, text: string) => void }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
      <p className="mb-3 font-display text-sm font-bold">Communication</p>
      <ol className="max-h-72 space-y-2 overflow-y-auto pr-1">
        {comms.map((c) => (
          <li key={c.id} className="flex items-start gap-2 rounded-xl border border-border/40 bg-muted/20 p-2.5">
            <span className="mt-0.5 grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary">{chanIcon[c.channel]}</span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center justify-between">
                <p className="truncate text-xs font-semibold capitalize">{c.channel} · {c.direction === "out" ? "Sent" : "Received"}</p>
                <span className={cn("text-[10px] font-medium capitalize", commStatusTone[c.status])}>{c.status}</span>
              </div>
              <p className="truncate text-xs">{c.subject}</p>
              <p className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(c.at), { addSuffix: true })}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="mt-3 flex gap-2">
        <div className="flex flex-1 items-center gap-1 rounded-xl border border-border/60 bg-background px-2">
          <input className="h-9 flex-1 bg-transparent text-sm outline-none" placeholder="Send a message…" />
          <Button size="sm" variant="ghost" className="h-7 px-2" onClick={() => onSend?.("email", "")}><Send className="h-3.5 w-3.5" /></Button>
        </div>
      </div>
    </div>
  );
}

// ─── Bulk toolbar ───
export function BulkToolbar({
  count,
  onClear,
  actions,
}: {
  count: number;
  onClear: () => void;
  actions: ReactNode;
}) {
  if (!count) return null;
  return (
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="sticky bottom-4 z-40 mx-auto flex w-fit max-w-full items-center gap-2 rounded-2xl border border-border/60 bg-card/90 px-3 py-2 lift-shadow backdrop-blur">
      <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-bold text-primary">{count} selected</span>
      <div className="flex items-center gap-1">{actions}</div>
      <button onClick={onClear} className="rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground"><X className="h-3.5 w-3.5" /></button>
    </motion.div>
  );
}

// ─── Workflow builder ───
const stepIcon: Record<string, ReactNode> = {
  CreditCard: <CreditCard className="h-3.5 w-3.5" />,
  Boxes: <Boxes className="h-3.5 w-3.5" />,
  PackageCheck: <PackageCheck className="h-3.5 w-3.5" />,
  Bell: <Bell className="h-3.5 w-3.5" />,
  AlertTriangle: <AlertTriangle className="h-3.5 w-3.5" />,
  ClipboardList: <ClipboardList className="h-3.5 w-3.5" />,
  FileText: <FileText className="h-3.5 w-3.5" />,
  Mail: <Mail className="h-3.5 w-3.5" />,
  Package: <Package className="h-3.5 w-3.5" />,
  MapPin: <MapPin className="h-3.5 w-3.5" />,
  Truck: <Truck className="h-3.5 w-3.5" />,
  MessageSquare: <MessageSquare className="h-3.5 w-3.5" />,
  Sparkles: <Sparkles className="h-3.5 w-3.5" />,
  Star: <Star className="h-3.5 w-3.5" />,
  RotateCcw: <RotateCcw className="h-3.5 w-3.5" />,
  IndianRupee: <IndianRupee className="h-3.5 w-3.5" />,
};
const stepTone: Record<WorkflowStep["type"], string> = {
  trigger: "bg-primary/10 text-primary ring-primary/30",
  condition: "bg-amber-500/10 text-amber-600 ring-amber-500/30",
  action: "bg-sky-500/10 text-sky-600 ring-sky-500/30",
};
export function WorkflowBuilder({ workflow }: { workflow: Workflow }) {
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow">
      <div className="mb-4 flex items-start justify-between">
        <div>
          <p className="font-display text-base font-bold">{workflow.name}</p>
          <p className="mt-0.5 text-xs text-muted-foreground">{workflow.description}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", workflow.status === "active" ? "bg-emerald-500/10 text-emerald-600" : workflow.status === "paused" ? "bg-amber-500/10 text-amber-600" : "bg-muted text-muted-foreground")}>{workflow.status}</span>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {workflow.steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={cn("inline-flex items-center gap-1.5 rounded-xl px-2.5 py-1.5 text-xs font-medium ring-1 ring-inset", stepTone[s.type])}>
              {stepIcon[s.icon] ?? <CircleDot className="h-3.5 w-3.5" />}
              <span>{s.label}</span>
              <span className="rounded-full bg-background/60 px-1.5 py-0 text-[9px] uppercase tracking-wider">{s.type}</span>
            </div>
            {i < workflow.steps.length - 1 && <span className="text-muted-foreground">→</span>}
          </div>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1"><Clock className="h-3 w-3" /> Last run {formatDistanceToNow(new Date(workflow.lastRun), { addSuffix: true })}</span>
        <span>{workflow.runs.toLocaleString()} runs</span>
      </div>
    </div>
  );
}
