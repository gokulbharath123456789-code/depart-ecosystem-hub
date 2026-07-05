import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase, Tag, CheckCircle2, Loader2 } from "lucide-react";
import {
  useAddresses,
  useUpsertAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "@/features/addresses/hooks";
import type { DbAddress, AddressInput } from "@/features/addresses/api";
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
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

export const Route = createFileRoute("/account/addresses")({
  component: AddressesPage,
});

const labelIcon = { Home, Office: Briefcase, Other: Tag } as const;
type LabelKey = keyof typeof labelIcon;

function normalizeLabel(l: string): LabelKey {
  const k = l.charAt(0).toUpperCase() + l.slice(1).toLowerCase();
  return (k === "Home" || k === "Office" ? k : "Other") as LabelKey;
}

function AddressesPage() {
  const { data, isLoading, error } = useAddresses();
  const upsert = useUpsertAddress();
  const del = useDeleteAddress();
  const setDefault = useSetDefaultAddress();
  const [editing, setEditing] = useState<DbAddress | null>(null);
  const [open, setOpen] = useState(false);

  async function handleSetDefault(id: string) {
    try {
      await setDefault.mutateAsync(id);
      toast.success("Default address updated");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not update default");
    }
  }
  async function handleRemove(id: string) {
    try {
      await del.mutateAsync(id);
      toast.success("Address removed");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not remove address");
    }
  }
  async function handleSave(input: AddressInput) {
    try {
      await upsert.mutateAsync(input);
      setOpen(false);
      setEditing(null);
      toast.success("Address saved");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not save address");
    }
  }

  const list = data ?? [];

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
          <AddressDialog initial={editing} onSave={handleSave} saving={upsert.isPending} />
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12 text-muted-foreground">
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading addresses…
        </div>
      ) : error ? (
        <EmptyState
          icon={MapPin}
          title="Couldn't load addresses"
          description={error instanceof Error ? error.message : "Please try again."}
        />
      ) : list.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="No addresses saved"
          description="Add a delivery address to speed up checkout."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
        <AnimatePresence>
          {list.map((a) => {
            const key = normalizeLabel(a.label);
            const Icon = labelIcon[key];
            return (
              <motion.div
                key={a.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`rounded-3xl border p-5 soft-shadow ${a.is_default ? "border-primary bg-primary/5" : "border-border/60 bg-card"}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                      <Icon className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold">{key}</p>
                      {a.is_default && <Badge className="rounded-full bg-primary/15 text-[10px] text-primary">Default</Badge>}
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button size="icon" variant="ghost" className="rounded-full" onClick={() => { setEditing(a); setOpen(true); }}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" className="rounded-full text-rose-600" disabled={del.isPending} onClick={() => handleRemove(a.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <p className="mt-3 text-sm font-medium">{a.full_name}</p>
                <p className="text-xs text-muted-foreground">{a.phone}</p>
                <p className="mt-1 text-sm text-foreground/80">
                  {a.line1}, {a.line2 ? a.line2 + ", " : ""} {a.city}, {a.state} {a.pincode}
                </p>
                {!a.is_default && (
                  <Button size="sm" variant="outline" className="mt-3 rounded-full" disabled={setDefault.isPending} onClick={() => handleSetDefault(a.id)}>
                    <CheckCircle2 className="mr-1 h-4 w-4" /> Make default
                  </Button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
        </div>
      )}
    </div>
  );
}

function AddressDialog({
  initial,
  onSave,
  saving,
}: {
  initial: DbAddress | null;
  onSave: (a: AddressInput) => void;
  saving: boolean;
}) {
  const [form, setForm] = useState<AddressInput>(() =>
    initial
      ? {
          id: initial.id,
          user_id: initial.user_id,
          label: initial.label,
          full_name: initial.full_name,
          phone: initial.phone,
          line1: initial.line1,
          line2: initial.line2 ?? "",
          city: initial.city,
          state: initial.state,
          pincode: initial.pincode,
          country: initial.country,
          is_default: initial.is_default,
        }
      : {
          // user_id filled in by upsertAddress helper
          user_id: "",
          label: "Home",
          full_name: "",
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
          <Field label="Full name" value={form.full_name} onChange={(v) => setForm({ ...form, full_name: v })} />
          <Field label="Phone" value={form.phone} onChange={(v) => setForm({ ...form, phone: v })} />
        </div>
        <Field label="Address line 1" value={form.line1} onChange={(v) => setForm({ ...form, line1: v })} />
        <Field label="Address line 2" value={form.line2 ?? ""} onChange={(v) => setForm({ ...form, line2: v })} />
        <div className="grid grid-cols-3 gap-2">
          <Field label="City" value={form.city} onChange={(v) => setForm({ ...form, city: v })} />
          <Field label="State" value={form.state} onChange={(v) => setForm({ ...form, state: v })} />
          <Field label="Pincode" value={form.pincode} onChange={(v) => setForm({ ...form, pincode: v })} />
        </div>
        <label className="mt-1 flex items-center gap-2 text-xs">
          <input
            type="checkbox"
            checked={!!form.is_default}
            onChange={(e) => setForm({ ...form, is_default: e.target.checked })}
          />
          Set as default delivery address
        </label>
      </div>
      <DialogFooter>
        <Button className="rounded-full" disabled={saving} onClick={() => onSave(form)}>
          {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          Save address
        </Button>
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