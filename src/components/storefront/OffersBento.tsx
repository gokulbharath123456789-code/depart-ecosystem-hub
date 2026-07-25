import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Sparkles, Percent } from "lucide-react";

export function OffersBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
      {/* Hero offer — weekend combo */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.4 }}
        className="col-span-2 row-span-2"
      >
        <Link
          to="/shop"
          className="group relative flex h-full min-h-[18rem] flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-8 text-white transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-48 w-48 rounded-full bg-lime-300/15 blur-3xl" />

          <div className="relative flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur">
              <Calendar className="h-3 w-3" /> Weekend combo
            </span>
          </div>

          <div className="relative">
            <h3 className="font-display text-3xl font-extrabold leading-tight sm:text-4xl">
              Family Fresh Box
            </h3>
            <p className="mt-2 max-w-md text-sm text-white/85 sm:text-base">
              12 seasonal vegetables & fruits hand-picked from Coimbatore farms — delivered every
              Saturday from ₹599.
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 transition group-hover:gap-2.5">
              Order the box <ArrowRight className="h-4 w-4" />
            </span>
          </div>
        </Link>
      </motion.div>

      {/* Pantry offer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <Link
          to="/shop"
          className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-400 to-orange-500 p-6 text-white transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Percent className="h-7 w-7" />
          </div>
          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              Save ₹120
            </div>
            <h3 className="font-display text-xl font-extrabold">Rice & Grocery</h3>
            <p className="text-xs text-white/80">Ponni, Sona Masoori, Basmati & dals</p>
          </div>
        </Link>
      </motion.div>

      {/* Personal care offer */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <Link
          to="/shop"
          className="group relative flex h-full items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-400 to-pink-500 p-6 text-white transition-transform duration-300 hover:-translate-y-1"
        >
          <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/15 blur-2xl" />
          <div className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/20 backdrop-blur">
            <Sparkles className="h-7 w-7" />
          </div>
          <div className="relative">
            <div className="text-[11px] font-bold uppercase tracking-wider text-white/80">
              Up to 30% off
            </div>
            <h3 className="font-display text-xl font-extrabold">Personal Care</h3>
            <p className="text-xs text-white/80">Shampoo, soaps, skincare & more</p>
          </div>
        </Link>
      </motion.div>
    </div>
  );
}
