import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Leaf, ShieldCheck, Star, Truck, Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { products } from "@/mock/products";
import { inr, pct } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

const TRUST = [
  { icon: Clock, label: "10-min express" },
  { icon: Leaf, label: "Farm-direct produce" },
  { icon: ShieldCheck, label: "100% quality promise" },
];

export function Hero() {
  const heroProduct = products.find((p) => p.tags.includes("bestseller")) ?? products[0];
  const discount = pct(heroProduct.mrp, heroProduct.price);

  return (
    <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-emerald-50/60 via-background to-background">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(16,185,129,0.12),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 pb-16 pt-10 lg:px-6 lg:pb-24 lg:pt-16">
        <div className="grid items-center gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
          {/* Copy + search */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-3.5 py-1.5 text-xs font-semibold text-foreground/80 backdrop-blur"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <MapPin className="h-3 w-3 text-primary" />
              Coimbatore · Tamil Nadu
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-5 font-display text-[2.6rem] font-extrabold leading-[1.02] tracking-tight text-foreground sm:text-5xl lg:text-[3.6rem]"
            >
              Groceries that arrive
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                before you unpack.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-md text-base text-foreground/70 sm:text-lg"
            >
              Fresh produce, dairy, bakery and pantry staples from Coimbatore's trusted
              supermarket — hand-picked daily, delivered in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7 flex flex-col gap-3 sm:flex-row"
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
                className="rounded-full px-7 font-semibold"
              >
                <Link to="/shop">Today's deals</Link>
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

          {/* Product showcase card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-100 via-lime-50 to-amber-50 ring-1 ring-border/60">
              <div className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-20 -left-12 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />

              <div className="relative grid gap-6 p-6 sm:p-8">
                {/* Featured product */}
                <div className="flex items-center gap-5 rounded-2xl bg-white/80 p-5 shadow-sm ring-1 ring-white/70 backdrop-blur">
                  <div className={`grid h-24 w-24 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${heroProduct.gradient} text-5xl shadow-sm`}>
                    <span className="drop-shadow-sm">{heroProduct.emoji}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-destructive">
                        {discount}% off
                      </span>
                      <span className="text-[10px] font-semibold text-muted-foreground">Bestseller</span>
                    </div>
                    <h3 className="mt-2 font-display text-lg font-bold leading-tight">{heroProduct.name}</h3>
                    <p className="text-xs text-muted-foreground">{heroProduct.brand} · {heroProduct.unit}</p>
                    <div className="mt-2 flex items-baseline gap-2">
                      <span className="font-display text-2xl font-extrabold text-primary">{inr(heroProduct.price)}</span>
                      {heroProduct.mrp > heroProduct.price && (
                        <span className="text-sm text-muted-foreground line-through">{inr(heroProduct.mrp)}</span>
                      )}
                    </div>
                  </div>
                  <Button asChild size="sm" className="shrink-0 rounded-full">
                    <Link to="/product/$slug" params={{ slug: heroProduct.slug }}>Buy</Link>
                  </Button>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { icon: Truck, label: "Delivery", value: "10 min" },
                    { icon: Star, label: "Rating", value: "4.9 / 5" },
                    { icon: ShieldCheck, label: "Reviews", value: "12,400+" },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl bg-white/70 p-4 text-center ring-1 ring-white/60 backdrop-blur">
                      <s.icon className="mx-auto h-5 w-5 text-primary" />
                      <p className="mt-2 font-display text-lg font-extrabold leading-none">{s.value}</p>
                      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Floating delivery badge */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -right-2 -top-2 flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-[11px] font-bold text-primary-foreground shadow-lg sm:right-4 sm:top-4"
            >
              <Truck className="h-3.5 w-3.5" />
              Free over ₹499
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
