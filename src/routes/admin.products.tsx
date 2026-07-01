import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { Plus, Download, Upload, Archive, Copy, Trash2, Tag, Star } from "lucide-react";
import { toast } from "sonner";
import {
  PageHeader,
  PanelCard,
  DataTable,
  StatusPill,
  EmptyState,
  KpiCard,
} from "@/features/admin/components/widgets";
import {
  AdvancedFilters,
  ColumnToggle,
  BulkActionToolbar,
  CsvImportDialog,
  ExportDialog,
  ConfirmDialog,
  Checkbox,
} from "@/features/admin/components/erp-widgets";
import { useErpStore } from "@/store/erp";
import { Button } from "@/components/ui/button";
import { useProducts, useArchiveProduct, useDeleteProduct } from "@/features/catalog/hooks";
import type { ProductWithRefs } from "@/features/catalog/api";
import type { ReactNode } from "react";
import { inr } from "@/lib/format";
import { Package, AlertTriangle, CheckCircle2, IndianRupee } from "lucide-react";

export const Route = createFileRoute("/admin/products")({
  component: ProductsPage,
});

function ProductsPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [cat, setCat] = useState("all");
  const [impOpen, setImpOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);
  const { selected, toggleSelect, selectMany, clear, savedFilters, visibleColumns, toggleColumn } = useErpStore();

  const { data: rows = [], isLoading } = useProducts();
  const archiveMut = useArchiveProduct();
  const deleteMut = useDeleteProduct();

  const categories = useMemo(
    () => ["all", ...Array.from(new Set(rows.map((p) => p.category?.name).filter(Boolean) as string[]))],
    [rows],
  );

  const filtered = rows.filter((p) => {
    if (status !== "all" && p.status !== status) return false;
    if (cat !== "all" && p.category?.name !== cat) return false;
    if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !(p.sku ?? "").toLowerCase().includes(q.toLowerCase())) return false;
    return true;
  });

  const stockOf = (p: ProductWithRefs) => p.inventory.reduce((s, i) => s + i.on_hand, 0);
  const reservedOf = (p: ProductWithRefs) => p.inventory.reduce((s, i) => s + i.reserved, 0);
  const reorderOf = (p: ProductWithRefs) => p.inventory.reduce((s, i) => s + i.reorder_point, 0);
  const totalValue = rows.reduce((s, p) => s + Number(p.price) * stockOf(p), 0);
  const low = rows.filter((p) => stockOf(p) <= reorderOf(p)).length;
  const active = rows.filter((p) => p.status === "active").length;
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  const runBulk = async (kind: "archive" | "delete") => {
    for (const id of selected) {
      if (kind === "archive") await archiveMut.mutateAsync(id).catch(() => null);
      if (kind === "delete") await deleteMut.mutateAsync(id).catch(() => null);
    }
    clear();
  };

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Catalog" }, { label: "Products" }]}
        title="Products"
        description="Browse and manage every SKU across your stores."
        actions={
          <>
            <Button variant="outline" className="rounded-xl" onClick={() => setImpOpen(true)}><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" className="rounded-xl" onClick={() => setExpOpen(true)}><Download className="mr-2 h-4 w-4" /> Export</Button>
            <Button asChild className="rounded-xl"><Link to="/admin/products/new"><Plus className="mr-2 h-4 w-4" /> Add product</Link></Button>
          </>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total SKUs" value={rows.length} icon={Package} tint="primary" />
        <KpiCard label="Active" value={active} icon={CheckCircle2} tint="sky" />
        <KpiCard label="Low stock" value={low} icon={AlertTriangle} tint="amber" />
        <KpiCard label="Inventory value" value={inr(totalValue)} icon={IndianRupee} tint="violet" />
      </section>

      <BulkActionToolbar
        count={selected.length}
        onClear={clear}
        actions={[
          { label: "Duplicate", icon: Copy, onClick: () => toast.info("Duplicate coming soon") },
          { label: "Recategorize", icon: Tag, onClick: () => toast.info("Bulk recategorize coming soon") },
          { label: "Archive", icon: Archive, onClick: () => runBulk("archive") },
          { label: "Delete", icon: Trash2, tone: "danger", onClick: () => setDelOpen(true) },
        ]}
      />

      <PanelCard title="Catalog" description={`${filtered.length} of ${rows.length} products`} className="mt-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <AdvancedFilters
            search={q}
            onSearch={setQ}
            status={status}
            onStatus={setStatus}
            statuses={[{value:"all",label:"All statuses"},{value:"active",label:"Active"},{value:"draft",label:"Draft"},{value:"archived",label:"Archived"}]}
            category={cat}
            onCategory={setCat}
            categories={categories}
          />
          <ColumnToggle
            visible={visibleColumns}
            onToggle={toggleColumn}
            columns={[
              { key: "barcode", label: "Barcode" },
              { key: "brand", label: "Brand" },
              { key: "supplier", label: "Supplier" },
              { key: "cost", label: "Cost" },
              { key: "margin", label: "Margin" },
              { key: "reserved", label: "Reserved" },
              { key: "available", label: "Available" },
              { key: "updated", label: "Last updated" },
            ]}
          />
        </div>
        {savedFilters.length > 0 && (
          <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-muted-foreground">Saved:</span>
            {savedFilters.map((sf) => (
              <button key={sf.id} onClick={() => { setQ(sf.query); setStatus(sf.status); setCat(sf.category); }} className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1 font-medium hover:bg-muted">
                <Star className="h-3 w-3 text-amber-500" /> {sf.name}
              </button>
            ))}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Package} title="No products yet" description="Add your first product to get started." />
        ) : (
          <DataTable<ProductWithRefs>
            rows={filtered}
            columns={(() => {
              type Col = { key: string; label: string; className?: string; render?: (p: ProductWithRefs) => ReactNode };
              const cols: Col[] = [
                { key: "select", label: "", className: "w-8", render: (p) => <Checkbox checked={selected.includes(p.id)} onCheckedChange={() => toggleSelect(p.id)} aria-label="Select row" /> },
                { key: "name", label: "Product", render: (p) => (
                  <div className="flex items-center gap-3">
                    {p.images[0]?.url ? (
                      <img src={p.images[0].url} alt="" className="h-9 w-9 rounded-xl object-cover" />
                    ) : (
                      <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-base">📦</span>
                    )}
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.sku ?? "—"} · {p.brand?.name ?? "—"}</p>
                    </div>
                  </div>
                ) },
              ];
              if (visibleColumns.brand) cols.push({ key: "brand", label: "Brand", render: (p) => <span>{p.brand?.name ?? "—"}</span> });
              cols.push({ key: "category", label: "Category", render: (p) => <span>{p.category?.name ?? "—"}</span> });
              if (visibleColumns.supplier) cols.push({ key: "supplier", label: "Supplier", render: (p) => <span>{p.supplier?.name ?? "—"}</span> });
              if (visibleColumns.cost) cols.push({ key: "cost", label: "Cost", render: (p) => <span>{inr(Number(p.cost_price ?? 0))}</span> });
              cols.push({ key: "price", label: "Price", render: (p) => <span className="font-semibold">{inr(p.price)}</span> });
              if (visibleColumns.margin) cols.push({ key: "margin", label: "Margin", render: (p) => {
                const cost = Number(p.cost_price ?? 0);
                const price = Number(p.price);
                if (!price || !cost) return <span>—</span>;
                return <span className="text-emerald-600">{Math.round(((price - cost) / price) * 100)}%</span>;
              } });
              cols.push({ key: "stock", label: "Stock", render: (p) => {
                const s = stockOf(p); const r = reorderOf(p);
                return <span className={`font-semibold ${s === 0 ? "text-rose-600" : s <= r ? "text-amber-600" : "text-foreground"}`}>{s}</span>;
              } });
              if (visibleColumns.available) cols.push({ key: "available", label: "Avail.", render: (p) => <span>{stockOf(p) - reservedOf(p)}</span> });
              cols.push({ key: "status", label: "Status", render: (p) => <StatusPill status={p.status} /> });
              return cols;
            })()}
          />
        )}
        <div className="mt-4 flex items-center justify-between text-xs text-muted-foreground">
          <button onClick={() => allSelected ? clear() : selectMany(filtered.map((p) => p.id))} className="font-semibold hover:text-foreground">
            {allSelected ? "Clear selection" : `Select all ${filtered.length}`}
          </button>
          <span>Page 1 of 4 · 25 per page</span>
        </div>
      </PanelCard>

      <CsvImportDialog open={impOpen} onOpenChange={setImpOpen} onConfirm={() => toast.info("CSV import coming soon")} />
      <ExportDialog open={expOpen} onOpenChange={setExpOpen} onExport={(f) => toast.success(`Exported as ${f.toUpperCase()}`)} />
      <ConfirmDialog open={delOpen} onOpenChange={setDelOpen} tone="danger" title="Delete selected products?" description={`${selected.length} products will be permanently deleted.`} confirmLabel="Delete" onConfirm={() => runBulk("delete")} />
    </div>
  );
}