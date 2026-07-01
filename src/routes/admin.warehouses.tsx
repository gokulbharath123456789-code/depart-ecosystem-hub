import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Boxes, MapPin, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PageHeader, PanelCard, KpiCard, EmptyState } from "@/features/admin/components/widgets";
import { useWarehouses, useCreateWarehouse } from "@/features/catalog/hooks";
import { useInventory } from "@/features/inventory/hooks";

export const Route = createFileRoute("/admin/warehouses")({ component: WarehousesPage });

function WarehousesPage() {
  const { data: warehouses = [], isLoading } = useWarehouses();
  const { data: inv = [] } = useInventory();
  const create = useCreateWarehouse();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", city: "" });
  const totalOnHand = inv.reduce((s, i) => s + i.on_hand, 0);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Warehouses" }]}
        title="Warehouses"
        description="Locations, dark stores and hubs storing your inventory."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> New warehouse</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New warehouse</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!form.code || !form.name || create.isPending} onClick={async () => { await create.mutateAsync(form); setOpen(false); setForm({ code: "", name: "", city: "" }); }}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Warehouses" value={warehouses.length} icon={Boxes} tint="primary" />
        <KpiCard label="Default" value={warehouses.find((w) => w.is_default)?.name ?? "—"} icon={CheckCircle2} tint="emerald" />
        <KpiCard label="Units on hand" value={totalOnHand.toLocaleString()} icon={Boxes} tint="sky" />
        <KpiCard label="Cities" value={new Set(warehouses.map((w) => w.city).filter(Boolean)).size} icon={MapPin} tint="amber" />
      </section>

      <PanelCard title="All warehouses" className="mt-6">
        {isLoading ? (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />)}
          </div>
        ) : warehouses.length === 0 ? (
          <EmptyState icon={Boxes} title="No warehouses yet" description="Add a warehouse to start receiving and shipping stock." />
        ) : (
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {warehouses.map((w) => {
              const wInv = inv.filter((i) => i.warehouse_id === w.id);
              const onHand = wInv.reduce((s, i) => s + i.on_hand, 0);
              return (
                <li key={w.id} className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
                  <div className="flex items-start gap-3">
                    <span className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary"><Boxes className="h-5 w-5" /></span>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">{w.name} {w.is_default && <span className="ml-1 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[10px] text-emerald-600">Default</span>}</p>
                      <p className="text-[11px] text-muted-foreground">{w.code} · {w.city ?? "—"}</p>
                    </div>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                    <div className="rounded-lg bg-muted/50 p-2"><p className="text-muted-foreground">SKUs</p><p className="font-semibold">{wInv.length}</p></div>
                    <div className="rounded-lg bg-muted/50 p-2"><p className="text-muted-foreground">Units</p><p className="font-semibold">{onHand.toLocaleString()}</p></div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </PanelCard>
    </div>
  );
}