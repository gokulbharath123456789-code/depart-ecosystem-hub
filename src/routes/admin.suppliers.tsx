import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Truck, Plus, MapPin, PackageCheck, CalendarCheck } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable, EmptyState } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSuppliers, useCreateSupplier } from "@/features/catalog/hooks";
import type { DbSupplier } from "@/features/catalog/api";

export const Route = createFileRoute("/admin/suppliers")({
  component: SuppliersPage,
});

function SuppliersPage() {
  const [active, setActive] = useState<DbSupplier | null>(null);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", contact_name: "", email: "", phone: "", city: "", payment_terms: "Net 30" });
  const { data: suppliers = [], isLoading } = useSuppliers();
  const create = useCreateSupplier();
  const cities = new Set(suppliers.map((s) => s.city).filter(Boolean));

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Supply chain" }, { label: "Suppliers" }]}
        title="Suppliers"
        description="Manage vendors, lead times and purchase orders."
        actions={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Add supplier</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle>New supplier</DialogTitle></DialogHeader>
              <div className="grid gap-3 sm:grid-cols-2">
                <div><Label>Code</Label><Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} /></div>
                <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></div>
                <div><Label>Contact</Label><Input value={form.contact_name} onChange={(e) => setForm({ ...form, contact_name: e.target.value })} /></div>
                <div><Label>Email</Label><Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
                <div><Label>City</Label><Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></div>
                <div className="sm:col-span-2"><Label>Payment terms</Label><Input value={form.payment_terms} onChange={(e) => setForm({ ...form, payment_terms: e.target.value })} /></div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
                <Button disabled={!form.code || !form.name || create.isPending} onClick={async () => { await create.mutateAsync(form); setOpen(false); setForm({ code: "", name: "", contact_name: "", email: "", phone: "", city: "", payment_terms: "Net 30" }); }}>Create</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        }
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Suppliers" value={suppliers.length} icon={Truck} tint="primary" />
        <KpiCard label="Active" value={suppliers.filter((s) => s.is_active).length} icon={CalendarCheck} tint="emerald" />
        <KpiCard label="Cities" value={cities.size} icon={PackageCheck} tint="sky" />
        <KpiCard label="With email" value={suppliers.filter((s) => s.email).length} icon={MapPin} tint="amber" />
      </section>

      <PanelCard title="Supplier directory" className="mt-6">
        {isLoading ? (
          <div className="space-y-2">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-12 animate-pulse rounded-lg bg-muted" />)}</div>
        ) : suppliers.length === 0 ? (
          <EmptyState icon={Truck} title="No suppliers yet" description="Add your first supplier to start creating purchase orders." />
        ) : (
          <DataTable
            rows={suppliers}
            columns={[
              { key: "name", label: "Supplier", render: (s) => <button className="text-left" onClick={() => setActive(s)}><p className="text-sm font-semibold hover:text-primary">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.code} · {s.contact_name ?? "—"}</p></button> },
              { key: "city", label: "City", render: (s) => <span>{s.city ?? "—"}</span> },
              { key: "email", label: "Email", render: (s) => <span className="text-xs">{s.email ?? "—"}</span> },
              { key: "phone", label: "Phone", render: (s) => <span className="text-xs">{s.phone ?? "—"}</span> },
              { key: "payment_terms", label: "Terms", render: (s) => <span className="text-xs">{s.payment_terms ?? "—"}</span> },
            ]}
          />
        )}
      </PanelCard>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-xl">
          {active && (
            <>
              <SheetHeader>
                <SheetTitle>{active.name}</SheetTitle>
              </SheetHeader>
              <div className="mt-6 space-y-5">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <Cell label="Code" value={active.code} />
                  <Cell label="Contact" value={active.contact_name ?? "—"} />
                  <Cell label="Email" value={active.email ?? "—"} />
                  <Cell label="Phone" value={active.phone ?? "—"} />
                  <Cell label="City" value={active.city ?? "—"} />
                  <Cell label="Terms" value={active.payment_terms ?? "—"} />
                  <Cell label="Status" value={active.is_active ? "Active" : "Inactive"} />
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-muted/30 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="mt-0.5 text-sm font-semibold">{value}</p>
    </div>
  );
}