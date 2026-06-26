import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase, Tag, CheckCircle2 } from "lucide-react";
import { addresses as initial, type Address } from "@/mock/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/dashboard/cards";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

const labelIcon = { Home, Office: Briefcase, Other: Tag } as const;

function AddressesPage() {
  const [list, setList] = useState<Address[]>(initial);
  const [editing, setEditing] = useState<Address | null>(null);
  const [open, setOpen] = useState(false);

  function setDefault(id: string) {
    setList((l) => l.map((a) => ({ ...a, isDefault: a.id === id })));
    toast.success("Default address updated");
  }
  function remove(id: string) {
    setList((l) => l.filter((a) => a.id !== id));
    toast.success("Address removed");
  }
  function save(a: Address) {
    setList((l) => {
      if (l.find((x) => x.id === a.id)) return l.map((x) => (x.id === a.id ? a : x));
      return [...l, { ...a, id: `a${l.length + 1}` }];
    });
    setOpen(false);
    setEditing(null);
    toast.success("Address saved");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{list.length} saved addresses</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full" onClick={() => setEditing(null)}>
              <Plus className="mr-2 h-4 w-4" /> Add address
            </Button>
          </DialogTrigger>
          <AddressDialog initial={editing} onSave={save} />
        </Dialog>
      </div>

      <div className="relative h-48 overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-100 via-sky-100 to-violet-100 dark:from-emerald-900/20 dark:via-sky-900/20 dark:to-violet-900/20">
        <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:24px_24px]" />
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <MapPin className="mx-auto h-8 w-8 text-primary" />
          <p className="mt-1 text-xs font-medium text-foreground/70">Map preview (demo)</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {list.map((a) => {
            const Icon = labelIcon[a.label as keyof typeof labelIcon];
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-3xl border p-5 soft-shadow ${a.isDefault ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{a.label}</p>
                      {a.isDefault && <Badge className="rounded-full bg-primary/15 text-[10px] text-primary">Default</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => { setEditing(a); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-rose-600" onClick={() => remove(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium">{a.name}</p>
                <p className="text-xs text-muted-foreground">{a.phone}</p>
                <p className="mt-1 text-sm text-foreground/80">
                  {a.line1}, {a.line2 ? a.line2 + ", " : ""} {a.city}, {a.state} {a.pincode}
                </p>
                {!a.isDefault && (
                  <Button size="sm" variant="outline" className="mt-3 rounded-full" onClick={() => setDefault(a.id)}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Make default
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

function AddressDialog({ initial, onSave }: { initial: Address | null; onSave: (a: Address) => void }) {
  const [form, setForm] = useState<Address>(
    initial ?? {
      id: "",
      label: "Home",
      name: "",
      phone: "",
      line1: "",
      line2: "",
      city: "",
      state: "",
      pincode: "",
    },
  );
  return (
    <DialogContent className="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>{initial ? "Edit address" : "Add new address"}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-3">
        <div className="grid grid-cols-3 gap-2">
          {(["Home", "Office", "Other"] as const).map((l) => (
            <button
              key={l}
              onClick={() => setForm({ ...form, label: l })}
              className={`rounded-2xl border px-3 py-2 text-xs font-medium ${form.label === l ? "border-primary bg-primary/10 text-primary" : "border-border bg-muted/30"}`}
            >
              {l}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Full name" value={form.name} onChange={(v) => setForm({ ...form, name: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
        <Field label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} />
        <Field label="Address line 2" value={form.line2 ?? ""} onChange={(v) => setForm({ ...form, line2: v })} />
        <div className="grid grid-cols-3 gap-2">
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
          <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
        </div>
      </div>
      <DialogFooter>
        <Button className="rounded-full" onClick={() => onSave(form)}>Save address</Button>
      </DialogFooter>
    </DialogContent>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} className="mt-1 rounded-xl" />
    </div>
  );
}