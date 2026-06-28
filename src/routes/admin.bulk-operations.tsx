import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Upload, Download, Trash2, Edit3, Tag, IndianRupee, Boxes, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { CsvImportDialog, ExportDialog, ConfirmDialog } from "@/features/admin/components/erp-widgets";
import { auditLog } from "@/features/admin/mock/erp";

export const Route = createFileRoute("/admin/bulk-operations")({ component: BulkPage });

function BulkPage() {
  const [impOpen, setImpOpen] = useState(false);
  const [expOpen, setExpOpen] = useState(false);
  const [delOpen, setDelOpen] = useState(false);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Bulk Operations" }]}
        title="Bulk operations"
        description="Import, export and update thousands of SKUs at once — safely."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Imports (30d)" value={12} icon={Upload} tint="primary" />
        <KpiCard label="Rows processed" value="42.8k" icon={FileSpreadsheet} tint="sky" />
        <KpiCard label="Conflicts resolved" value={87} icon={Edit3} tint="amber" />
        <KpiCard label="Exports (30d)" value={34} icon={Download} tint="violet" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ActionTile icon={Upload} title="Bulk import" desc="CSV / Excel with validation & conflict resolution" onClick={() => setImpOpen(true)} />
        <ActionTile icon={Download} title="Bulk export" desc="Export filtered catalog to CSV, Excel or PDF" onClick={() => setExpOpen(true)} />
        <ActionTile icon={Edit3} title="Bulk edit" desc="Change brand, supplier, tags or status for many SKUs" onClick={() => toast.info("Open the products page and select rows to bulk edit")} />
        <ActionTile icon={Tag} title="Bulk category change" desc="Move multiple SKUs into a new category" onClick={() => toast.info("Open the products page and select rows to recategorize")} />
        <ActionTile icon={IndianRupee} title="Bulk price update" desc="Adjust prices by % or fixed amount" />
        <ActionTile icon={Boxes} title="Bulk stock update" desc="Set stock levels across SKUs and warehouses" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Quick price update" description="Apply to selected category" className="xl:col-span-2">
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <div><Label className="text-xs font-semibold uppercase">Category</Label><Input defaultValue="Beverages" className="h-11 rounded-xl" /></div>
            <div><Label className="text-xs font-semibold uppercase">Adjustment</Label><Input defaultValue="+5%" className="h-11 rounded-xl" /></div>
            <div><Label className="text-xs font-semibold uppercase">Rounding</Label><Input defaultValue="0.99" className="h-11 rounded-xl" /></div>
            <div><Label className="text-xs font-semibold uppercase">Effective</Label><Input type="date" className="h-11 rounded-xl" /></div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setDelOpen(true)}><Trash2 className="mr-2 h-4 w-4" /> Bulk delete</Button>
            <Button className="rounded-xl" onClick={() => toast.success("Preview generated for 42 SKUs")}>Preview impact</Button>
          </div>
        </PanelCard>
        <PanelCard title="Recent activity" description="Audit log">
          <ul className="space-y-2">
            {auditLog.slice(0, 6).map((a) => (
              <li key={a.id} className="flex items-start gap-2 rounded-xl border border-border/60 p-2.5 text-sm">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-primary/10 text-primary text-[10px] font-bold">{a.user.split(" ").map((n) => n[0]).join("")}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate"><span className="font-semibold">{a.user}</span> {a.action} <span className="font-mono text-xs">{a.entityId}</span></p>
                  <p className="text-[10px] text-muted-foreground">{a.diff} · {a.at}</p>
                </div>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>

      <PanelCard title="Audit log" description="Full history" className="mt-6">
        <DataTable
          rows={auditLog}
          columns={[
            { key: "at", label: "When" },
            { key: "user", label: "User" },
            { key: "action", label: "Action" },
            { key: "entity", label: "Entity" },
            { key: "entityId", label: "Ref", render: (a) => <span className="font-mono text-xs">{a.entityId}</span> },
            { key: "diff", label: "Change" },
          ]}
        />
      </PanelCard>

      <CsvImportDialog open={impOpen} onOpenChange={setImpOpen} onConfirm={() => toast.success("42 products imported")} />
      <ExportDialog open={expOpen} onOpenChange={setExpOpen} onExport={(f) => toast.success(`Exported as ${f.toUpperCase()}`)} />
      <ConfirmDialog open={delOpen} onOpenChange={setDelOpen} tone="danger" title="Bulk delete?" description="This will permanently archive 0 selected products. This action cannot be undone." confirmLabel="Delete" onConfirm={() => toast.success("Bulk delete queued (demo)")} />
    </div>
  );
}

function ActionTile({
  icon: Icon,
  title,
  desc,
  onClick,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex items-start gap-3 rounded-3xl border border-border/60 bg-card p-5 text-left soft-shadow transition-shadow hover:lift-shadow"
    >
      <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-sm font-bold">{title}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{desc}</p>
      </div>
    </button>
  );
}