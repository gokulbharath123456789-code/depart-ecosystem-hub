import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { SlidersHorizontal, LayoutGrid, List, X } from "lucide-react";
import { useProducts, useCategories } from "@/features/catalog/hooks";
import { toUiProduct } from "@/features/catalog/adapters";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/shop")({
  head: () => ({ meta: [{ title: "Shop all — SREE SUPER MART" }, { name: "description", content: "Browse 12,000+ products across fresh produce, pantry, dairy, snacks and more." }] }),
  component: Shop,
});

function Shop() {
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [price, setPrice] = useState<[number, number]>([0, 1200]);
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [sort, setSort] = useState("popular");
  const [view, setView] = useState<"grid" | "list">("grid");

  const { data: dbProducts = [], isLoading } = useProducts({ status: "active" });
  const { data: categories = [] } = useCategories();
  const products = useMemo(() => dbProducts.map(toUiProduct), [dbProducts]);

  const filtered = useMemo(() => {
    let list = products.filter(
      (p) =>
        (selectedCats.length === 0 || selectedCats.includes(p.categorySlug)) &&
        p.price >= price[0] &&
        p.price <= price[1] &&
        (tagFilter.length === 0 || tagFilter.some((t) => p.tags.includes(t as never))),
    );
    if (sort === "price-asc") list = [...list].sort((a, b) => a.price - b.price);
    if (sort === "price-desc") list = [...list].sort((a, b) => b.price - a.price);
    if (sort === "rating") list = [...list].sort((a, b) => b.rating - a.rating);
    if (sort === "discount")
      list = [...list].sort((a, b) => (b.mrp - b.price) / b.mrp - (a.mrp - a.price) / a.mrp);
    return list;
  }, [products, selectedCats, price, tagFilter, sort]);

  const toggle = (arr: string[], v: string, setter: (x: string[]) => void) =>
    setter(arr.includes(v) ? arr.filter((x) => x !== v) : [...arr, v]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">All products</h1>
          <p className="mt-1 text-sm text-muted-foreground">{filtered.length} results</p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-44 rounded-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most popular</SelectItem>
              <SelectItem value="rating">Top rated</SelectItem>
              <SelectItem value="price-asc">Price: low to high</SelectItem>
              <SelectItem value="price-desc">Price: high to low</SelectItem>
              <SelectItem value="discount">Biggest discount</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center rounded-full border border-border p-1">
            <button
              onClick={() => setView("grid")}
              className={`grid h-8 w-8 place-items-center rounded-full transition ${
                view === "grid" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={`grid h-8 w-8 place-items-center rounded-full transition ${
                view === "list" ? "bg-foreground text-background" : "text-muted-foreground"
              }`}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <aside className="hidden h-fit space-y-6 rounded-3xl border border-border bg-card p-5 lg:block">
          <div className="flex items-center justify-between">
            <h3 className="flex items-center gap-2 font-display font-bold">
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </h3>
            {(selectedCats.length || tagFilter.length) > 0 && (
              <button
                onClick={() => { setSelectedCats([]); setTagFilter([]); }}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Clear
              </button>
            )}
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</h4>
            <div className="space-y-2">
              {categories.map((c) => (
                <label key={c.id} className="flex cursor-pointer items-center gap-2 text-sm">
                  <Checkbox
                    checked={selectedCats.includes(c.slug)}
                    onCheckedChange={() => toggle(selectedCats, c.slug, setSelectedCats)}
                  />
                  <span>{c.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (₹)</h4>
            <Slider
              value={price}
              min={0}
              max={1200}
              step={50}
              onValueChange={(v) => setPrice(v as [number, number])}
            />
            <div className="mt-2 flex justify-between text-xs font-medium text-foreground/70">
              <span>₹{price[0]}</span>
              <span>₹{price[1]}</span>
            </div>
          </div>

          <div>
            <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-muted-foreground">Tags</h4>
            <div className="flex flex-wrap gap-1.5">
              {["organic", "bestseller", "new", "vegan", "imported", "low-fat"].map((t) => (
                <button
                  key={t}
                  onClick={() => toggle(tagFilter, t, setTagFilter)}
                  className={`rounded-full px-3 py-1 text-xs font-semibold capitalize transition ${
                    tagFilter.includes(t)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground/70 hover:bg-muted/70"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </aside>

        <div>
          {(selectedCats.length > 0 || tagFilter.length > 0) && (
            <div className="mb-3 flex flex-wrap gap-1.5">
              {selectedCats.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-full">
                  {categories.find((c) => c.slug === s)?.name}
                  <button onClick={() => toggle(selectedCats, s, setSelectedCats)} className="ml-1.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tagFilter.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full capitalize">
                  {t}
                  <button onClick={() => toggle(tagFilter, t, setTagFilter)} className="ml-1.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" />
              ))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
              <div className="text-5xl">🤷</div>
              <h3 className="mt-3 font-display text-xl font-bold">No products match</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters.</p>
              <Button onClick={() => { setSelectedCats([]); setTagFilter([]); setPrice([0, 1200]); }} className="mt-4 rounded-full">
                Reset filters
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className={
                view === "grid"
                  ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col gap-3"
              }
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}