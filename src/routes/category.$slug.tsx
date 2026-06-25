import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { categories } from "@/mock/categories";
import { productsByCategory } from "@/mock/products";
import { ProductRail } from "@/components/storefront/ProductRail";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/category/$slug")({
  loader: ({ params }) => {
    const cat = categories.find((c) => c.slug === params.slug);
    if (!cat) throw notFound();
    return { category: cat, products: productsByCategory(params.slug) };
  },
  head: ({ loaderData }) =>
    loaderData
      ? {
          meta: [
            { title: `${loaderData.category.name} — DEPART` },
            { name: "description", content: `Shop ${loaderData.category.name} at DEPART. ${loaderData.products.length} products available.` },
          ],
        }
      : {},
  component: CategoryPage,
});

function CategoryPage() {
  const { category, products } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 lg:px-6">
      <nav className="flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/shop" className="hover:text-foreground">Shop</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">{category.name}</span>
      </nav>

      <div className={`mt-4 overflow-hidden rounded-[24px] bg-gradient-to-br ${category.gradient} p-8 ring-1 ring-border/40`}>
        <div className="flex items-center gap-5">
          <div className="grid h-20 w-20 place-items-center rounded-2xl bg-white/70 text-5xl shadow-sm">
            {category.emoji}
          </div>
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
              {category.name}
            </h1>
            <p className="mt-1 text-sm text-foreground/70">{category.itemCount} products · Fresh daily</p>
          </div>
        </div>
      </div>

      <div className="mt-8">
        {products.length > 0 ? (
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