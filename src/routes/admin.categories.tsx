import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Tag } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, EmptyState } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCategories, useCreateCategory, useProducts } from "@/features/catalog/hooks";

export const Route = createFileRoute("/admin/categories")({
  component: CategoriesPage,
});

function CategoriesPage() {
  const { data: categories = [], isLoading } = useCategories();
  const { data: products = [] } = useProducts();
  const create = useCreateCategory();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  const counts = categories.map((c) => ({
    ...c,
    count: products.filter((p) => p.category?.id === c.id).length,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Categories" }]}
        title="Categories"
        description="Organize your catalog with merchandising categories and tags."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> New category</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New category</DialogTitle></DialogHeader>
              <div className="space-y-3">
                <div><Label>Name</Label><Input value={name} onChange={(e) => { setName(e.target.value); setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "")); }} /></div>
                <div><Label>Slug</Label><Input value={slug} onChange={(e) => setSlug(e.target.value)} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!name || !slug || create.isPending} onClick={async () => { await create.mutateAsync({ name, slug }); setOpen(false); setName(""); setSlug(""); }}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Categories" value={categories.length} icon={Tag} tint="primary" />
        <KpiCard label="Products" value={products.length} icon={Tag} tint="sky" />
        <KpiCard label="Top category" value={counts[0]?.name ?? "—"} icon={Tag} tint="amber" />
        <KpiCard label="Empty" value={counts.filter((c) => c.count === 0).length} icon={Tag} tint="violet" />
      </section>
      <PanelCard title="All categories" className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-16 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : counts.length === 0 ? (
          <EmptyState icon={Tag} title="No categories yet" description="Create your first category to organize the catalog." />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {counts.map((c, i) => (
              <li key={c.id} className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow transition-shadow hover:lift-shadow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                  <Tag className="h-5 w-5" />
                </span>
                <div className="flex-1">
                  <p className="text-sm font-semibold">{c.name}</p>
                  <p className="text-xs text-muted-foreground">{c.count} products · #{i + 1}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </PanelCard>
    </div>
  );
}