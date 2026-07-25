import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function OffersBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
      {/* Hero offer — weekend combo */}
      <Link
        to="/shop"
        className="relative col-span-2 row-span-2 flex h-72 flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white transition-transform duration-300 hover:-translate-y-1 lg:h-auto"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="text-8xl">🥬</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
            Weekend combo
          </div>
          <h3 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">
            Family Fresh Box
          </h3>
          <p className="mt-1 max-w-md text-sm text-white/85">
            12 seasonal vegetables & fruits hand-picked from Coimbatore farms — delivered every
            Saturday from ₹599.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
            Order the box <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>

      {/* Pantry offer */}
      <Link
        to="/shop"
        className="relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-300 to-orange-300 p-6 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="text-6xl">🍚</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
            Save ₹120
          </div>
          <h3 className="font-display text-xl font-extrabold text-foreground">Rice & Grocery</h3>
          <p className="text-xs text-foreground/70">Ponni, Sona Masoori, Basmati & dals</p>
        </div>
      </Link>

      {/* Personal care offer */}
      <Link
        to="/shop"
        className="relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-200 to-pink-200 p-6 transition-transform duration-300 hover:-translate-y-1"
      >
        <div className="text-6xl">🧴</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">
            Up to 30% off
          </div>
          <h3 className="font-display text-xl font-extrabold text-foreground">Personal Care</h3>
          <p className="text-xs text-foreground/70">Shampoo, soaps, skincare & more</p>
        </div>
      </Link>
    </div>
  );
}
