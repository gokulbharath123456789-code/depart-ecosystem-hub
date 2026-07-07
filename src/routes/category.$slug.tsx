import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { ChevronRight, ShoppingBasket } from "lucide-react";
import { ProductRail } from "@/components/storefront/ProductRail";
import { useCategories, useProducts } from "@/features/catalog/hooks";
import { toUiProduct } from "@/features/catalog/adapters";
import { categories as uiCategories } from "@/mock/categories";

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
  const Icon = uiCategories.find((c) => c.slug === slug)?.icon ?? ShoppingBasket;

  if (!category && !isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-extrabold">Category not found</h1>
      </div>
    );
  }
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category?.name}</span>
      </nav>

      <div className="mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br from-amber-100 to-orange-50 p-8 ring-1 ring-border/40">
        <div className="flex items-center gap-5">
          {category?.image_url ? (
            <img src={category.image_url} alt={category.name} className="h-20 w-20 rounded-2xl object-cover shadow-sm" />
          ) : (
            <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/70 text-primary shadow-sm">
              <Icon className="h-10 w-10" strokeWidth={1.8} />
            </div>
          )}
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {category?.name ?? slug}
            </h1>
            <p className="mt-1 text-sm text-foreground/70">{products.length} products · Fresh daily</p>
          </div>
        </div>
      </div>

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
            <div className="text-5xl">🛒</div>
            <h3 className="mt-3 font-display text-xl font-bold">More coming soon</h3>
            <p className="mt-1 text-sm text-muted-foreground">We're stocking this shelf right now.</p>
          </div>
        )}
      </div>
    </div>
  );
}