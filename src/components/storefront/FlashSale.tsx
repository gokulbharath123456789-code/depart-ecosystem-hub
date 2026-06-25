import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Flame, ArrowRight } from "lucide-react";
import { products } from "@/mock/products";
import { ProductCard } from "./ProductCard";

function useCountdown(targetSec = 60 * 60 * 6) {
  const [t, setT] = useState(targetSec);
  useEffect(() => {
    const id = setInterval(() => setT((x) => (x > 0 ? x - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const h = Math.floor(t / 3600);
  const m = Math.floor((t % 3600) / 60);
  const s = t % 60;
  return { h, m, s };
}

function Cell({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 font-display text-xl font-extrabold tabular-nums text-white">
        {String(n).padStart(2, "0")}
      </span>
      <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider text-white/70">{label}</span>
    </div>
  );
}

export function FlashSale() {
  const { h, m, s } = useCountdown();
  const items = products.filter((p) => p.mrp > p.price).slice(0, 6);

  return (
    <section className="mx-auto mt-16 max-w-7xl px-4 lg:px-6">
      <div className="overflow-hidden rounded-[24px] bg-gradient-to-br from-rose-600 via-red-600 to-orange-500 p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-white/15 text-white">
              <Flame className="h-6 w-6" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/80">
                Limited time
              </div>
              <h2 className="font-display text-2xl font-extrabold text-white sm:text-3xl">
                Flash Sale — up to 40% off
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Cell n={h} label="Hours" />
            <Cell n={m} label="Min" />
            <Cell n={s} label="Sec" />
            <Link
              to="/shop"
              className="ml-3 inline-flex items-center gap-1 rounded-full bg-white px-4 py-2 text-sm font-bold text-rose-600 transition hover:scale-[1.02]"
            >
              Shop all <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {items.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  );
}