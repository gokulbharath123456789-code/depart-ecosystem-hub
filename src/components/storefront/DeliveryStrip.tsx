import { Clock, ShieldCheck, RotateCcw, Headphones, Leaf, IndianRupee } from "lucide-react";

const items = [
  {
    icon: Leaf,
    title: "Farm-fresh produce",
    sub: "Sourced daily from Coimbatore farms",
    tint: "bg-emerald-500/10 text-emerald-600",
  },
  {
    icon: Clock,
    title: "10-minute delivery",
    sub: "Express slots across 12 zones",
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: IndianRupee,
    title: "Best everyday prices",
    sub: "Consistent savings, no surprises",
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: ShieldCheck,
    title: "Quality promise",
    sub: "100% satisfaction guaranteed",
    tint: "bg-violet-500/10 text-violet-600",
  },
  {
    icon: RotateCcw,
    title: "Easy returns",
    sub: "Refund within 24 hours",
    tint: "bg-rose-500/10 text-rose-600",
  },
  {
    icon: Headphones,
    title: "24/7 support",
    sub: "Real humans, anytime",
    tint: "bg-teal-500/10 text-teal-600",
  },
];

export function DeliveryStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(({ icon: Icon, title, sub, tint }) => (
        <div
          key={title}
          className="flex items-start gap-4 rounded-3xl border border-border/60 bg-card p-5 soft-shadow transition-shadow hover:lift-shadow"
        >
          <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-2xl ${tint}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="font-display text-sm font-bold">{title}</div>
            <div className="mt-0.5 text-xs text-muted-foreground">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
