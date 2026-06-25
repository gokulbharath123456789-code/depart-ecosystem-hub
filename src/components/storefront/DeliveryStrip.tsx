import { Truck, ShieldCheck, RotateCcw, Headphones } from "lucide-react";

const items = [
  { icon: Truck, title: "10-min delivery", sub: "Across 12 cities" },
  { icon: ShieldCheck, title: "Quality promise", sub: "100% satisfaction guaranteed" },
  { icon: RotateCcw, title: "Easy returns", sub: "Refund within 24 hrs" },
  { icon: Headphones, title: "24/7 support", sub: "Real humans, anytime" },
];

export function DeliveryStrip() {
  return (
    <div className="grid gap-4 rounded-3xl bg-card p-6 ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
      {items.map(({ icon: Icon, title, sub }) => (
        <div key={title} className="flex items-center gap-3">
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-bold">{title}</div>
            <div className="text-xs text-muted-foreground">{sub}</div>
          </div>
        </div>
      ))}
    </div>
  );
}