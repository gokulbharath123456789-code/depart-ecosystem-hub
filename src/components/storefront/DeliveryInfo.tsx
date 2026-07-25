import { Link } from "@tanstack/react-router";
import { Truck, Store, Clock, LifeBuoy, MapPin, ArrowRight } from "lucide-react";

const ZONES = [
  "R.S. Puram",
  "Saibaba Colony",
  "Race Course",
  "Peelamedu",
  "Gandhipuram",
  "Singanallur",
  "Saravanampatti",
  "Vadavalli",
];

const OPTIONS = [
  {
    icon: Truck,
    title: "Same-day delivery",
    desc: "Order before 8 PM and get it delivered the same day across Coimbatore.",
    tint: "bg-primary/10 text-primary",
  },
  {
    icon: Store,
    title: "Store pickup",
    desc: "Reserve online and collect from our R.S. Puram outlet in under 30 minutes.",
    tint: "bg-amber-500/10 text-amber-600",
  },
  {
    icon: Clock,
    title: "Express in 10 minutes",
    desc: "Dark-store powered express slots for daily essentials across 12 zones.",
    tint: "bg-sky-500/10 text-sky-600",
  },
  {
    icon: LifeBuoy,
    title: "Customer support",
    desc: "Talk to a real person 24/7 on WhatsApp, phone, or in-app chat.",
    tint: "bg-violet-500/10 text-violet-600",
  },
];

export function DeliveryInfo() {
  return (
    <div className="grid gap-4 lg:grid-cols-[1.4fr_1fr]">
      <div className="grid gap-4 sm:grid-cols-2">
        {OPTIONS.map(({ icon: Icon, title, desc, tint }) => (
          <div
            key={title}
            className="flex flex-col gap-3 rounded-3xl border border-border/60 bg-card p-5 soft-shadow transition-shadow hover:lift-shadow"
          >
            <div className={`grid h-12 w-12 place-items-center rounded-2xl ${tint}`}>
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <div className="font-display text-base font-bold">{title}</div>
              <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground soft-shadow">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/15 blur-3xl" />
        <div className="relative">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold">
            <MapPin className="h-3.5 w-3.5" /> Coimbatore · Tamil Nadu
          </div>
          <h3 className="mt-4 font-display text-2xl font-extrabold tracking-tight">
            Now delivering across the city
          </h3>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Fresh from our dark stores to your doorstep — across 12 zones in Coimbatore.
          </p>
          <div className="mt-5 flex flex-wrap gap-1.5">
            {ZONES.map((z) => (
              <span
                key={z}
                className="rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium"
              >
                {z}
              </span>
            ))}
          </div>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-primary transition hover:scale-[1.02]"
          >
            Check your pincode <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
