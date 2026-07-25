import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  SlidersHorizontal,
  LayoutGrid,
  List,
  X,
  SearchX,
  ChevronRight,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { useProducts, useCategories } from "@/features/catalog/hooks";
import { toUiProduct } from "@/features/catalog/adapters";
import { ProductCard } from "@/components/storefront/ProductCard";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { categories as uiCategories } from "@/mock/categories";
import { cn } from "@/lib/utils";

const TAGS = ["organic", "bestseller", "new", "vegan", "imported", "low-fat"] as const;

type FilterPanelProps = {
  categories: { id: string; name: string; slug: string }[];
  selectedCats: string[];
  toggle: (arr: string[], v: string, setter: (x: string[]) => void) => void;
  setSelectedCats: (x: string[]) => void;
  price: [number, number];
  setPrice: (v: [number, number]) => void;
  tagFilter: string[];
  setTagFilter: (x: string[]) => void;
  onClear: () => void;
};

function FilterPanel({
  categories,
  selectedCats,
  toggle,
  setSelectedCats,
  price,
  setPrice,
  tagFilter,
  setTagFilter,
  onClear,
}: FilterPanelProps) {
  const activeCount = selectedCats.length + tagFilter.length + (price[0] > 0 || price[1] < 1200 ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 font-display text-base font-bold">
          <SlidersHorizontal className="h-4 w-4 text-primary" /> Filters
          {activeCount > 0 && (
            <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button onClick={onClear} className="text-xs font-semibold text-primary hover:underline">
            Clear all
          </button>
        )}
      </div>

      {/* Quick category links */}
      <div>
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Category
        </h4>
        <div className="space-y-1">
          {categories.map((c) => {
            const uiCat = uiCategories.find((uc) => uc.slug === c.slug);
            const Icon = uiCat?.icon;
            const checked = selectedCats.includes(c.slug);
            return (
              <button
                key={c.id}
                onClick={() => toggle(selectedCats, c.slug, setSelectedCats)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-sm transition",
                  checked ? "bg-primary/10 font-semibold text-primary" : "text-foreground/80 hover:bg-muted",
                )}
              >
                {Icon && <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />}
                <span className="flex-1 text-left">{c.name}</span>
                {checked && <X className="h-3.5 w-3.5" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Price range
        </h4>
        <Slider
          value={price}
          min={0}
          max={1200}
          step={50}
          onValueChange={(v) => setPrice(v as [number, number])}
        />
        <div className="mt-3 flex items-center justify-between">
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold tabular-nums">₹{price[0]}</span>
          <span className="text-xs text-muted-foreground">to</span>
          <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-bold tabular-nums">₹{price[1]}</span>
        </div>
      </div>

      <div className="h-px bg-border" />

      <div>
        <h4 className="mb-3 text-[11px] font-bold uppercase tracking-[0.15em] text-muted-foreground">
          Quick filters
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {TAGS.map((t) => (
            <button
              key={t}
              onClick={() => toggle(tagFilter, t, setTagFilter)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-semibold capitalize transition",
                tagFilter.includes(t)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-foreground/70 hover:bg-muted/70",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [
      { title: "Shop all — SREE SUPER MART" },
      { name: "description", content: "Browse 12,000+ products across fresh produce, pantry, dairy, snacks and more." },
    ],
  }),
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

  const clearAll = () => {
    setSelectedCats([]);
    setTagFilter([]);
    setPrice([0, 1200]);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Shop</span>
      </nav>

      {/* Page header */}
      <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">All products</h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
            {selectedCats.length > 0 && ` in ${categories.find((c) => c.slug === selectedCats[0])?.name ?? "selected categories"}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select value={sort} onValueChange={setSort}>
            <SelectTrigger className="h-10 w-44 rounded-full bg-card">
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
          <div className="flex items-center rounded-full border border-border bg-card p-1">
            <button
              onClick={() => setView("grid")}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition",
                view === "grid" ? "bg-foreground text-background" : "text-muted-foreground",
              )}
              aria-label="Grid view"
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("list")}
              className={cn(
                "grid h-8 w-8 place-items-center rounded-full transition",
                view === "list" ? "bg-foreground text-background" : "text-muted-foreground",
              )}
              aria-label="List view"
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter trigger */}
      <div className="mt-4 flex items-center gap-2 lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-full">
              <SlidersHorizontal className="mr-1.5 h-4 w-4" /> Filters
              {(selectedCats.length + tagFilter.length) > 0 && (
                <Badge className="ml-1.5 h-5 min-w-5 rounded-full px-1 text-[10px]">
                  {selectedCats.length + tagFilter.length}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          {(selectedCats.length || tagFilter.length) > 0 && (
            <button onClick={clearAll} className="text-xs font-semibold text-primary hover:underline">
              Clear all
            </button>
          )}
          <SheetContent side="left" className="w-full overflow-y-auto sm:max-w-sm">
            <SheetHeader>
              <SheetTitle className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4" /> Filters
              </SheetTitle>
            </SheetHeader>
            <div className="px-4 pb-6">
              <FilterPanel
                categories={categories}
                selectedCats={selectedCats}
                toggle={toggle}
                setSelectedCats={setSelectedCats}
                price={price}
                setPrice={setPrice}
                tagFilter={tagFilter}
                setTagFilter={setTagFilter}
                onClear={clearAll}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[260px_1fr]">
        {/* Desktop sidebar */}
        <aside className="hidden h-fit rounded-3xl border border-border/60 bg-card p-5 lg:sticky lg:top-32 lg:block">
          <FilterPanel
            categories={categories}
            selectedCats={selectedCats}
            toggle={toggle}
            setSelectedCats={setSelectedCats}
            price={price}
            setPrice={setPrice}
            tagFilter={tagFilter}
            setTagFilter={setTagFilter}
            onClear={clearAll}
          />
        </aside>

        <div>
          {/* Active filter chips */}
          {(selectedCats.length > 0 || tagFilter.length > 0 || price[0] > 0 || price[1] < 1200) && (
            <div className="mb-4 flex flex-wrap items-center gap-1.5">
              {selectedCats.map((s) => (
                <Badge key={s} variant="secondary" className="rounded-full py-1.5 pl-3 pr-1.5">
                  {categories.find((c) => c.slug === s)?.name}
                  <button onClick={() => toggle(selectedCats, s, setSelectedCats)} className="ml-1.5 grid h-5 w-5 place-items-center rounded-full hover:bg-foreground/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {tagFilter.map((t) => (
                <Badge key={t} variant="secondary" className="rounded-full py-1.5 pl-3 pr-1.5 capitalize">
                  {t}
                  <button onClick={() => toggle(tagFilter, t, setTagFilter)} className="ml-1.5 grid h-5 w-5 place-items-center rounded-full hover:bg-foreground/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
              {(price[0] > 0 || price[1] < 1200) && (
                <Badge variant="secondary" className="rounded-full py-1.5 pl-3 pr-1.5">
                  ₹{price[0]} – ₹{price[1]}
                  <button onClick={() => setPrice([0, 1200])} className="ml-1.5 grid h-5 w-5 place-items-center rounded-full hover:bg-foreground/10">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              )}
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
              <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
                <SearchX className="h-9 w-9 text-muted-foreground" />
              </div>
              <h3 className="mt-4 font-display text-xl font-bold">No products match</h3>
              <p className="mt-1 text-sm text-muted-foreground">Try clearing some filters.</p>
              <Button onClick={clearAll} className="mt-5 rounded-full">
                Reset filters
              </Button>
            </div>
          ) : (
            <motion.div
              layout
              className={cn(
                view === "grid"
                  ? "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4"
                  : "flex flex-col gap-3",
              )}
            >
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </motion.div>
          )}

          {/* Bottom info */}
          {!isLoading && filtered.length > 0 && (
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              Showing {filtered.length} products · Fresh stock updated daily
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
