import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@tanstack/react-router";
import { Search, X, TrendingUp, Clock, Mic, ScanLine } from "lucide-react";
import { useUI } from "@/store/ui";
import { products } from "@/mock/products";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { inr } from "@/lib/format";

const trending = ["Avocados", "Cold brew", "Sourdough", "Greek yogurt", "Dark chocolate"];
const recent = ["Milk 1L", "Bananas", "Eggs"];

export function SearchDialog() {
  const open = useUI((s) => s.searchOpen);
  const setOpen = useUI((s) => s.setSearchOpen);
  const [q, setQ] = useState("");

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen(true);
      }
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [setOpen]);

  const results = q
    ? products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase())).slice(0, 6)
    : [];

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-50 bg-foreground/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-x-4 top-20 z-50 mx-auto max-w-2xl overflow-hidden rounded-3xl bg-background soft-shadow ring-1 ring-border"
          >
            <div className="flex items-center gap-3 border-b border-border px-5 py-4">
              <Search className="h-5 w-5 text-muted-foreground" />
              <input
                autoFocus
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search 12,000+ products…"
                className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <button className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Voice">
                <Mic className="h-4 w-4" />
              </button>
              <button className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted" aria-label="Scan">
                <ScanLine className="h-4 w-4" />
              </button>
              <button onClick={() => setOpen(false)} className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted">
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto p-5">
              {results.length > 0 ? (
                <ul className="space-y-1">
                  {results.map((p) => (
                    <li key={p.id}>
                      <Link
                        to="/product/$slug"
                        params={{ slug: p.slug }}
                        onClick={() => setOpen(false)}
                        className="flex items-center gap-3 rounded-2xl p-2 transition hover:bg-muted"
                      >
                        <ProductMedia
                          emoji={p.emoji}
                          gradient={p.gradient}
                          size="sm"
                          className="h-12 w-12"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="truncate text-sm font-semibold">{p.name}</div>
                          <div className="text-xs text-muted-foreground">{p.brand} · {p.unit}</div>
                        </div>
                        <div className="text-sm font-bold">{inr(p.price)}</div>
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="space-y-5">
                  <div>
                    <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <Clock className="h-3 w-3" /> Recent
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {recent.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQ(t)}
                          className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium transition hover:bg-muted/70"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h4 className="mb-2 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                      <TrendingUp className="h-3 w-3" /> Trending
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {trending.map((t) => (
                        <button
                          key={t}
                          onClick={() => setQ(t)}
                          className="rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium transition hover:border-primary hover:text-primary"
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}