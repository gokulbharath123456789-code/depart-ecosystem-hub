import { createFileRoute } from "@tanstack/react-router";
import { Plus, Tag } from "lucide-react";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { adminProducts } from "@/features/admin/mock/data";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const grouped = adminProducts.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});
  const entries = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Categories" }]}
        title="Categories"
        description="Organize your catalog with merchandising categories and tags."
        actions={<Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> New category</Button>}
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Categories" value={entries.length} icon={Tag} tint="primary" />
        <KpiCard label="Active SKUs" value={adminProducts.length} icon={Tag} tint="sky" />
        <KpiCard label="Top category" value={entries[0]?.[0] ?? "—"} icon={Tag} tint="amber" />
        <KpiCard label="Empty" value={0} icon={Tag} tint="violet" />
      </section>
      <PanelCard title="All categories" description="Drag to reorder · click to manage" className="mt-6">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {entries.map(([name, count], i) => (
            <li key={name} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow transition-shadow hover:lift-shadow">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{name}</p>
                <p className="text-xs text-muted-foreground">{count} products · #{i + 1}</p>
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}