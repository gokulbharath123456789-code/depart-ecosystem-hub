import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Clock, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative mx-auto mt-6 max-w-7xl px-4 lg:px-6">
      <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 via-lime-50 to-amber-50 ring-1 ring-border">
        {/* decorative orbs */}
        <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-primary/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-72 w-72 rounded-full bg-accent/40 blur-3xl" />

        <div className="relative grid items-center gap-10 px-6 py-12 lg:grid-cols-2 lg:px-14 lg:py-20">
          <div>
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-1 text-xs font-semibold text-foreground/80 backdrop-blur"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              New flagship store · Coimbatore now live
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-5xl lg:text-6xl"
            >
              Your supermarket,
              <br />
              <span className="bg-gradient-to-r from-primary to-emerald-600 bg-clip-text text-transparent">
                delivered in 10 minutes.
              </span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mt-5 max-w-md text-base text-foreground/70 sm:text-lg"
            >
              12,000+ products. Fresh produce, premium pantry, household essentials —
              all from a beautifully merchandised shelf.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="mt-7 flex flex-wrap gap-3"
            >
              <Button asChild size="lg" className="rounded-full px-6 font-semibold">
                <Link to="/shop">
                  Start shopping <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-foreground/15 bg-white/70 px-6 font-semibold backdrop-blur hover:bg-white"
              >
                <Link to="/shop">View today's deals</Link>
              </Button>
            </motion.div>
            <div className="mt-8 flex flex-wrap gap-6 text-xs text-foreground/70">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-primary" /> 10-min express
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Leaf className="h-3.5 w-3.5 text-primary" /> Farm-direct produce
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Sparkles className="h-3.5 w-3.5 text-primary" /> 100% quality promise
              </span>
            </div>
          </div>

          {/* visual collage */}
          <div className="relative hidden h-[420px] lg:block">
            {[
              { emoji: "🥑", from: "from-emerald-300", to: "to-lime-200", top: "top-0", left: "left-8", size: "h-44 w-44", rot: -6 },
              { emoji: "🍓", from: "from-rose-300", to: "to-pink-200", top: "top-24", left: "left-56", size: "h-32 w-32", rot: 8 },
              { emoji: "🥐", from: "from-amber-300", to: "to-orange-200", top: "top-56", left: "left-12", size: "h-36 w-36", rot: -4 },
              { emoji: "🥛", from: "from-sky-200", to: "to-blue-100", top: "top-44", left: "left-60", size: "h-40 w-40", rot: 6 },
              { emoji: "🍫", from: "from-stone-300", to: "to-amber-200", top: "top-2", left: "left-72", size: "h-28 w-28", rot: -8 },
            ].map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.7, rotate: 0 }}
                animate={{ opacity: 1, scale: 1, rotate: t.rot }}
                transition={{ delay: 0.2 + i * 0.08, type: "spring", stiffness: 220, damping: 18 }}
                whileHover={{ scale: 1.08, rotate: t.rot + 2 }}
                className={`absolute ${t.top} ${t.left} ${t.size} grid place-items-center rounded-3xl bg-gradient-to-br ${t.from} ${t.to} text-6xl shadow-xl ring-1 ring-white/60`}
              >
                {t.emoji}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}