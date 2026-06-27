import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Upload, Search, Filter } from "lucide-react";
import {
  PageHeader,
  PanelCard,
  DataTable,
  StatusPill,
  EmptyState,
  KpiCard,
} from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { adminProducts } from "@/features/admin/mock/data";
import { inr } from "@/lib/format";
import { Package, AlertTriangle, CheckCircle2, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [cat, setCat] = useState("all");

  const categories = useMemo(() => ["all", ...Array.from(new Set(adminProducts.map((p) => p.category)))], []);
  const filtered = adminProducts.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (cat !== "all" && p.category !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.sku.toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const totalValue = adminProducts.reduce((s, p) => s + p.price * p.stock, 0);
  const low = adminProducts.filter((p) => p.stock <= p.reorder).length;
  const active = adminProducts.filter((p) => p.status === "active").length;

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Products" }]}
        title="Products"
        description="Browse and manage every SKU across your stores."
        actions={
          <>
            <Button variant="outline" className="rounded-xl"><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add product</Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total SKUs" value={adminProducts.length} icon={Package} tint="primary" />
        <KpiCard label="Active" value={active} icon={CheckCircle2} tint="sky" />
        <KpiCard label="Low stock" value={low} icon={AlertTriangle} tint="amber" />
        <KpiCard label="Inventory value" value={inr(totalValue)} icon={IndianRupee} tint="violet" />
      </section>

      <PanelCard title="Catalog" description={`${filtered.length} of ${adminProducts.length} products`} className="mt-6">
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative min-w-[220px] flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by name or SKU…" className="h-10 rounded-xl pl-9" />
          </div>
          <Select value={cat} onValueChange={setCat}>
            <SelectTrigger className="h-10 w-[180px] rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
            <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}</SelectContent>
          </Select>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="h-10 w-[160px] rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="rounded-xl"><Filter className="mr-2 h-4 w-4" /> More filters</Button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products match your filters" description="Try clearing filters or searching for something else." />
        ) : (
          <DataTable
            rows={filtered}
            columns={[
              {
                key: "name",
                label: "Product",
                render: (p) => (
                  <div className="flex items-center gap-3">
                    <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.sku} · {p.vendor}</p>
                    </div>
                  </div>
                ),
              },
              { key: "category", label: "Category" },
              { key: "price", label: "Price", render: (p) => <span className="font-semibold">{inr(p.price)}</span> },
              {
                key: "stock",
                label: "Stock",
                render: (p) => (
                  <span className={`font-semibold ${p.stock === 0 ? "text-rose-600" : p.stock <= p.reorder ? "text-amber-600" : "text-foreground"}`}>{p.stock}</span>
                ),
              },
              { key: "status", label: "Status", render: (p) => <StatusPill status={p.status} /> },
            ]}
          />
        )}
      </PanelCard>
    </div>
  );
}