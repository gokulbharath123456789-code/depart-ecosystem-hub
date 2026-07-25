import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Leaf, ShieldCheck, Star, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

const TRUST = [
  { icon: Clock, label: "10-min express" },
  { icon: Leaf, label: "Farm-direct produce" },
  { icon: ShieldCheck, label: "100% quality promise" },
];

export function Hero() {
  return (
    <section className="relative mx-auto mt-4 max-w-7xl px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 ring-1 ring-border">
        <div className="pointer-events-none absolute -right-24 -top-28 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 -left-16 h-80 w-80 rounded-full bg-accent/30 blur-3xl" />

        <div className="relative grid items-center gap-8 px-6 py-12 sm:px-10 lg:grid-cols-[1.05fr_1fr] lg:px-14 lg:py-16">
          {/* Copy */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              Now delivering across Coimbatore · Tamil Nadu
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-[3.5rem]"
            >
              Fresh groceries,
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                delivered in minutes.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-md text-base text-foreground/70 sm:text-lg"
            >
              Farm-fresh vegetables and fruits, dairy, bakery, pantry staples and household
              essentials — hand-picked daily and delivered fast to your doorstep in Coimbatore.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-7 font-semibold">
                <Link to="/shop">
                  Start shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/15 bg-white/70 px-7 font-semibold backdrop-blur hover:bg-white"
              >
                <Link to="/shop">View today's deals</Link>
              </Button>
            </motion.div>

            <motion.ul
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs font-medium text-foreground/70"
            >
              {TRUST.map((t) => (
                <li key={t.label} className="inline-flex items-center gap-1.5">
                  <t.icon className="h-3.5 w-3.5 text-primary" />
                  {t.label}
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative hidden h-[440px] lg:block"
          >
            {/* Primary offer card */}
            <div className="absolute left-0 top-6 w-72 rounded-3xl bg-white/90 p-5 shadow-xl ring-1 ring-white/70 backdrop-blur">
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-destructive">
                  Up to 40% off
                </span>
                <span className="text-[10px] font-semibold text-muted-foreground">Today only</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-emerald-200 to-lime-100 text-4xl">
                  🥬
                </div>
                <div>
                  <p className="font-display text-sm font-bold">Fresh Veggies Combo</p>
                  <p className="text-[11px] text-muted-foreground">12 seasonal picks</p>
                  <p className="mt-1 font-display text-lg font-extrabold text-primary">₹599</p>
                </div>
              </div>
            </div>

            {/* Floating produce tiles */}
            {[
              { emoji: "🥑", from: "from-emerald-300", to: "to-lime-200", top: "top-0", right: "right-2", size: "h-36 w-36", rot: -6 },
              { emoji: "🍓", from: "from-rose-300", to: "to-pink-200", top: "top-44", right: "right-24", size: "h-28 w-28", rot: 8 },
              { emoji: "🥛", from: "from-sky-200", to: "to-blue-100", top: "top-72", right: "right-0", size: "h-32 w-32", rot: 6 },
              { emoji: "🥐", from: "from-amber-300", to: "to-orange-200", top: "top-56", right: "right-40", size: "h-24 w-24", rot: -4 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: t.rot }}
                transition={{ delay: 0.25 + i * 0.08, type: "spring", stiffness: 220, damping: 18 }}
                whileHover={{ scale: 1.08, rotate: t.rot + 2 }}
                className={`absolute ${t.top} ${t.right} ${t.size} grid place-items-center rounded-3xl bg-gradient-to-br ${t.from} ${t.to} text-5xl shadow-xl ring-1 ring-white/60`}
              >
                {t.emoji}
              </motion.div>
            ))}

            {/* Rating chip */}
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-2xl bg-white/90 px-4 py-2.5 shadow-lg ring-1 ring-white/70 backdrop-blur">
              <div className="flex items-center gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <div className="text-xs">
                <p className="font-bold leading-tight">4.9 / 5</p>
                <p className="text-[10px] text-muted-foreground">12,400+ reviews</p>
              </div>
            </div>

            {/* Delivery chip */}
            <div className="absolute right-2 top-2 flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-[11px] font-bold text-primary-foreground shadow-lg">
              <Truck className="h-3.5 w-3.5" />
              10-min delivery
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
