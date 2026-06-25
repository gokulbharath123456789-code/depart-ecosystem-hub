import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function OffersBento() {
  return (
    <div className="grid gap-4 lg:grid-cols-3 lg:grid-rows-2">
      <Link
        to="/shop"
        className="relative col-span-2 row-span-2 flex h-72 flex-col justify-between overflow-hidden rounded-[24px] bg-gradient-to-br from-emerald-500 to-teal-600 p-8 text-white lg:h-auto"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/15 blur-3xl" />
        <div className="text-9xl">🥬</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">Combo offer</div>
          <h3 className="mt-1 font-display text-3xl font-extrabold sm:text-4xl">Weekly Fresh Box</h3>
          <p className="mt-1 max-w-md text-sm text-white/85">
            12 hand-picked seasonal fruits & vegetables, delivered every Saturday. From ₹599.
          </p>
          <span className="mt-3 inline-flex items-center gap-1 text-sm font-bold">
            Subscribe <ArrowRight className="h-4 w-4" />
          </span>
        </div>
      </Link>
      <Link
        to="/shop"
        className="relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-300 to-orange-300 p-6"
      >
        <div className="text-6xl">☕</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">Buy 2 Get 1</div>
          <h3 className="font-display text-xl font-extrabold text-foreground">Specialty Coffee</h3>
          <p className="text-xs text-foreground/70">All beans & cold brews</p>
        </div>
      </Link>
      <Link
        to="/shop"
        className="relative flex items-center gap-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-200 to-pink-200 p-6"
      >
        <div className="text-6xl">🧴</div>
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-foreground/70">Up to 30% off</div>
          <h3 className="font-display text-xl font-extrabold text-foreground">Personal Care</h3>
          <p className="text-xs text-foreground/70">Mamaearth, Dot & Key, more</p>
        </div>
      </Link>
    </div>
  );
}