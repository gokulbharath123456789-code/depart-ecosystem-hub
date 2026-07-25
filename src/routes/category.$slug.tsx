import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, ShoppingBasket, ArrowRight, TrendingUp } from "lucide-react";
import { ProductRail } from "@/components/storefront/ProductRail";
import { useCategories, useProducts } from "@/features/catalog/hooks";
import { toUiProduct } from "@/features/catalog/adapters";
import { categories as uiCategories } from "@/mock/categories";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/category/$slug")({
  head: ({ params }) => ({
    meta: [{ title: `${params.slug} — SREE SUPER MART` }],
  }),
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const { data: categories = [] } = useCategories();
  const { data: dbProducts = [], isLoading } = useProducts({
    status: "active",
    categorySlug: slug,
  });
  const category = categories.find((c) => c.slug === slug);
  const products = useMemo(() => dbProducts.map(toUiProduct), [dbProducts]);
  const uiCat = uiCategories.find((c) => c.slug === slug);
  const Icon = uiCat?.icon ?? ShoppingBasket;

  if (!category && !isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-extrabold">Category not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 lg:px-6 lg:py-10">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category?.name}</span>
      </nav>

      {/* Category hero */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative mt-4 overflow-hidden rounded-[28px] bg-gradient-to-br from-emerald-50 via-lime-50/50 to-amber-50 p-8 ring-1 ring-border/40 lg:p-12"
      >
        <div className="pointer-events-none absolute -right-12 -top-12 h-64 w-64 rounded-full bg-primary/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-12 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />

        <div className="relative flex flex-col items-start gap-6 sm:flex-row sm:items-center">
          <div className="grid h-24 w-24 shrink-0 place-items-center rounded-3xl bg-white/80 shadow-sm ring-1 ring-white/70 backdrop-blur">
            <Icon className="h-12 w-12 text-primary" strokeWidth={1.6} />
          </div>
          <div className="flex-1">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-primary backdrop-blur">
              <TrendingUp className="h-3 w-3" /> {products.length} products available
            </div>
            <h1 className="mt-3 font-display text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
              {category?.name ?? slug}
            </h1>
            <p className="mt-2 max-w-lg text-sm text-foreground/70 sm:text-base">
              Fresh from Coimbatore farms and trusted brands — restocked daily for the best quality
              and value.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Sub-category quick links */}
      <div className="mt-6 flex gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden">
        {uiCategories
          .filter((c) => c.slug !== slug)
          .slice(0, 7)
          .map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground/80 transition hover:border-primary/40 hover:text-primary"
            >
              <c.icon className="h-3.5 w-3.5" strokeWidth={2} />
              {c.name}
            </Link>
          ))}
      </div>

      {/* Products */}
      <div className="mt-8">
        {isLoading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-muted" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <ProductRail products={products} />
        ) : (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card py-24 text-center">
            <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
              <ShoppingBasket className="h-9 w-9 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-display text-xl font-bold">More coming soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">We're stocking this shelf right now.</p>
            <Button asChild className="mt-5 rounded-full">
              <Link to="/shop">
                Browse other categories <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
