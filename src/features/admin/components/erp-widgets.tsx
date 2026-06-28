import { useMemo, useState, type ReactNode } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Barcode,
  Boxes,
  Calendar as CalendarIcon,
  Check,
  ChevronDown,
  CircleDot,
  Clock,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  Filter,
  MapPin,
  Package,
  PackageCheck,
  Printer,
  Search,
  Star,
  Trash2,
  TrendingDown,
  TrendingUp,
  Truck,
  Upload,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";
import type {
  Warehouse,
  ErpProduct,
  ErpSupplier,
  StockMovement,
  PurchaseOrder,
  Batch,
} from "@/features/admin/mock/erp";

// ────────────── Stock Card ──────────────
export function StockCard({ product }: { product: ErpProduct }) {
  const available = product.stock - product.reserved;
  const health = product.stock === 0 ? "out" : product.stock <= product.reorder ? "low" : "ok";
  const tint = health === "ok" ? "bg-emerald-500/10 text-emerald-600" : health === "low" ? "bg-amber-500/10 text-amber-600" : "bg-rose-500/10 text-rose-600";
  const pct = Math.min(100, Math.round((product.stock / (product.reorder * 5)) * 100));
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="group rounded-2xl border border-border/60 bg-card p-4 soft-shadow hover:lift-shadow"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-muted text-2xl">{product.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{product.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{product.sku} · {product.brand}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", tint)}>{health}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-center">
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">On hand</p><p className="text-sm font-bold">{product.stock}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Reserved</p><p className="text-sm font-bold">{product.reserved}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Available</p><p className="text-sm font-bold">{available}</p></div>
      </div>
      <Progress value={pct} className="mt-3 h-1.5" />
      <p className="mt-1 flex items-center justify-between text-[10px] text-muted-foreground">
        <span>Reorder at {product.reorder}</span>
        <span>{product.warehouse}</span>
      </p>
    </motion.div>
  );
}

// ────────────── Warehouse Card ──────────────
export function WarehouseCard({ w }: { w: Warehouse }) {
  const pct = Math.round((w.used / w.capacity) * 100);
  const tint = pct > 85 ? "bg-rose-500/10 text-rose-600" : pct > 70 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600";
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow hover:lift-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary/10 text-primary"><Boxes className="h-5 w-5" /></span>
          <div>
            <p className="font-display text-sm font-bold">{w.name}</p>
            <p className="text-[11px] text-muted-foreground">{w.code} · {w.type}</p>
          </div>
        </div>
        <Badge variant="outline" className="rounded-full text-[10px] capitalize">{w.type.replace("-", " ")}</Badge>
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {w.city} · {w.address}</span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-baseline justify-between text-xs">
          <span className="font-semibold">Utilization</span>
          <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tint)}>{pct}%</span>
        </div>
        <Progress value={pct} className="h-2" />
        <p className="mt-1 text-[11px] text-muted-foreground">{w.used.toLocaleString()} / {w.capacity.toLocaleString()} pallets</p>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <p className="text-[11px] text-muted-foreground">Manager · {w.manager}</p>
        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs">Manage</Button>
      </div>
    </motion.div>
  );
}

// ────────────── Supplier Card ──────────────
export function SupplierCard({ s, onView }: { s: ErpSupplier; onView?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow hover:lift-shadow"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary font-display font-bold">
          {s.name.split(" ").map((w) => w[0]).slice(0, 2).join("")}
        </span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold">{s.name}</p>
          <p className="truncate text-[11px] text-muted-foreground">{s.contact}</p>
        </div>
        <div className="flex items-center gap-1 text-amber-500">
          <Star className="h-3.5 w-3.5 fill-current" />
          <span className="text-xs font-semibold text-foreground">{s.rating}</span>
        </div>
      </div>
      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">On-time</p><p className="font-bold">{s.onTime}%</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">SKUs</p><p className="font-bold">{s.skus}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Spend</p><p className="font-bold">{inr(s.totalSpend)}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Outstanding</p><p className={cn("font-bold", s.outstanding > 0 && "text-rose-600")}>{inr(s.outstanding)}</p></div>
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <p className="text-[11px] text-muted-foreground">{s.paymentTerms} · Last {s.lastOrder}</p>
        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs" onClick={onView}>View</Button>
      </div>
    </motion.div>
  );
}

// ────────────── Purchase Order Card ──────────────
const POstatusTone: Record<PurchaseOrder["status"], string> = {
  draft: "bg-muted text-muted-foreground",
  approved: "bg-sky-500/10 text-sky-600",
  ordered: "bg-violet-500/10 text-violet-600",
  received: "bg-emerald-500/10 text-emerald-600",
  partial: "bg-amber-500/10 text-amber-600",
  cancelled: "bg-rose-500/10 text-rose-600",
};
export function PurchaseOrderCard({ po, onOpen }: { po: PurchaseOrder; onOpen?: () => void }) {
  const subtotal = po.items.reduce((s, it) => s + it.qty * it.cost, 0);
  const tax = po.items.reduce((s, it) => s + (it.qty * it.cost * it.tax) / 100, 0);
  const total = Math.round(subtotal + tax + po.shipping - po.discount);
  const receivedPct = Math.round((po.items.reduce((s, it) => s + it.received, 0) / po.items.reduce((s, it) => s + it.qty, 0)) * 100);
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow hover:lift-shadow"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-xs font-semibold text-muted-foreground">{po.id}</p>
          <p className="mt-0.5 font-display text-sm font-bold">{po.supplier}</p>
          <p className="text-[11px] text-muted-foreground">{po.warehouse} · {po.items.length} items</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold capitalize", POstatusTone[po.status])}>{po.status}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Total</p><p className="font-bold">{inr(total)}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Expected</p><p className="font-bold">{format(new Date(po.expectedAt), "d MMM")}</p></div>
        <div className="rounded-xl bg-muted/40 p-2"><p className="text-[10px] text-muted-foreground">Received</p><p className="font-bold">{receivedPct}%</p></div>
      </div>
      <Progress value={receivedPct} className="mt-3 h-1.5" />
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3">
        <p className="text-[11px] text-muted-foreground">Approver · {po.approver ?? "—"}</p>
        <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs" onClick={onOpen}>Open <ArrowRight className="ml-1 h-3 w-3" /></Button>
      </div>
    </motion.div>
  );
}

// ────────────── Batch Card ──────────────
export function BatchCard({ b }: { b: Batch }) {
  const days = Math.round((new Date(b.expiry).getTime() - Date.now()) / 86400000);
  const tone = days < 0 ? "bg-rose-500/10 text-rose-600" : days <= 7 ? "bg-amber-500/10 text-amber-600" : "bg-emerald-500/10 text-emerald-600";
  const label = days < 0 ? "Expired" : days <= 7 ? "Near expiry" : "Fresh";
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 place-items-center rounded-2xl bg-muted text-xl">{b.emoji}</span>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{b.productName}</p>
          <p className="truncate text-[11px] text-muted-foreground">{b.batchNo} · {b.lotNo}</p>
        </div>
        <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-semibold", tone)}>{label}</span>
      </div>
      <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
        <div><p className="text-[10px] text-muted-foreground">Qty</p><p className="font-bold">{b.qty}</p></div>
        <div><p className="text-[10px] text-muted-foreground">Mfg</p><p className="font-bold">{format(new Date(b.mfg), "d MMM")}</p></div>
        <div><p className="text-[10px] text-muted-foreground">Expiry</p><p className={cn("font-bold", days <= 7 && "text-rose-600")}>{format(new Date(b.expiry), "d MMM yy")}</p></div>
      </div>
      <p className="mt-2 text-[10px] text-muted-foreground">{b.warehouse}</p>
    </div>
  );
}

// ────────────── Forecast Card ──────────────
export function ForecastCard({
  title,
  value,
  delta,
  hint,
  positive = true,
}: {
  title: string;
  value: string;
  delta: string;
  hint?: string;
  positive?: boolean;
}) {
  const Icon = positive ? TrendingUp : TrendingDown;
  return (
    <div className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow">
      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{title}</p>
      <p className="mt-2 font-display text-2xl font-extrabold">{value}</p>
      <p className={cn("mt-1 inline-flex items-center gap-1 text-xs font-semibold", positive ? "text-emerald-600" : "text-rose-600")}>
        <Icon className="h-3.5 w-3.5" /> {delta}
      </p>
      {hint && <p className="mt-2 text-[11px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ────────────── Movement Timeline ──────────────
const moveTone: Record<string, string> = {
  purchase: "bg-emerald-500/10 text-emerald-600",
  sale: "bg-sky-500/10 text-sky-600",
  return: "bg-violet-500/10 text-violet-600",
  damage: "bg-rose-500/10 text-rose-600",
  expiry: "bg-rose-500/10 text-rose-600",
  adjustment: "bg-amber-500/10 text-amber-600",
  transfer: "bg-primary/10 text-primary",
};
export function MovementTimeline({ items }: { items: StockMovement[] }) {
  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-5">
      {items.map((m) => (
        <li key={m.id} className="relative">
          <span className={cn("absolute -left-[26px] top-1 grid h-4 w-4 place-items-center rounded-full", moveTone[m.type])}>
            <CircleDot className="h-2.5 w-2.5" />
          </span>
          <div className="flex items-start justify-between gap-3 rounded-xl border border-border/60 bg-card p-3">
            <div className="flex items-start gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-base">{m.emoji}</span>
              <div>
                <p className="text-sm font-semibold capitalize">{m.type} · {m.productName}</p>
                <p className="text-[11px] text-muted-foreground">{m.reference} · {m.warehouse} · by {m.user}</p>
                {m.reason !== "—" && <p className="mt-0.5 text-[11px] text-muted-foreground">{m.reason}</p>}
              </div>
            </div>
            <div className="text-right">
              <p className={cn("text-sm font-bold", m.qty >= 0 ? "text-emerald-600" : "text-rose-600")}>
                {m.qty >= 0 ? "+" : ""}{m.qty}
              </p>
              <p className="text-[10px] text-muted-foreground">{format(new Date(m.date), "d MMM, HH:mm")}</p>
            </div>
          </div>
        </li>
      ))}
    </ol>
  );
}

// ────────────── Approval Timeline ──────────────
export function ApprovalTimeline({
  steps,
}: {
  steps: { label: string; by?: string; at?: string; status: "done" | "current" | "pending" }[];
}) {
  return (
    <ol className="relative space-y-4 border-l border-border/60 pl-5">
      {steps.map((s, i) => (
        <li key={i} className="relative">
          <span
            className={cn(
              "absolute -left-[22px] top-1 grid h-5 w-5 place-items-center rounded-full",
              s.status === "done" ? "bg-emerald-500 text-white" : s.status === "current" ? "bg-amber-500 text-white" : "bg-muted text-muted-foreground",
            )}
          >
            {s.status === "done" ? <Check className="h-3 w-3" /> : s.status === "current" ? <Clock className="h-3 w-3" /> : <CircleDot className="h-2 w-2" />}
          </span>
          <p className={cn("text-sm font-semibold", s.status === "pending" && "text-muted-foreground")}>{s.label}</p>
          {(s.by || s.at) && <p className="text-[11px] text-muted-foreground">{s.by} {s.at && `· ${s.at}`}</p>}
        </li>
      ))}
    </ol>
  );
}

// ────────────── Barcode generator (SVG, Code-128-ish visual) ──────────────
export function BarcodeGenerator({ value, height = 60 }: { value: string; height?: number }) {
  const bars = useMemo(() => {
    const arr: { w: number; black: boolean }[] = [];
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 31 + value.charCodeAt(i)) >>> 0;
    for (let i = 0; i < 60; i++) {
      seed = (seed * 1103515245 + 12345) >>> 0;
      arr.push({ w: 1 + (seed % 3), black: i % 2 === 0 });
    }
    return arr;
  }, [value]);
  const total = bars.reduce((s, b) => s + b.w, 0);
  let x = 0;
  return (
    <div className="inline-flex flex-col items-center gap-1">
      <svg width={Math.min(220, total * 2)} height={height} viewBox={`0 0 ${total} ${height}`} preserveAspectRatio="none">
        {bars.map((b, i) => {
          const rx = x; x += b.w;
          return b.black ? <rect key={i} x={rx} y={0} width={b.w} height={height - 12} fill="currentColor" /> : null;
        })}
      </svg>
      <span className="font-mono text-[10px] tracking-widest">{value}</span>
    </div>
  );
}

// ────────────── QR placeholder ──────────────
export function QrCode({ value, size = 120 }: { value: string; size?: number }) {
  const cells = 21;
  const arr = useMemo(() => {
    let seed = 0;
    for (let i = 0; i < value.length; i++) seed = (seed * 33 + value.charCodeAt(i)) >>> 0;
    return Array.from({ length: cells * cells }, () => {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed & 0xff) > 128;
    });
  }, [value]);
  const cs = size / cells;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <rect width={size} height={size} fill="white" />
      {arr.map((on, i) => on ? <rect key={i} x={(i % cells) * cs} y={Math.floor(i / cells) * cs} width={cs} height={cs} fill="currentColor" /> : null)}
      {/* anchors */}
      {[[0, 0], [cells - 7, 0], [0, cells - 7]].map(([cx, cy], k) => (
        <g key={k}>
          <rect x={cx * cs} y={cy * cs} width={7 * cs} height={7 * cs} fill="currentColor" />
          <rect x={(cx + 1) * cs} y={(cy + 1) * cs} width={5 * cs} height={5 * cs} fill="white" />
          <rect x={(cx + 2) * cs} y={(cy + 2) * cs} width={3 * cs} height={3 * cs} fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}

// ────────────── Date Range Picker ──────────────
export function DateRangePicker({
  value,
  onChange,
}: {
  value?: { from?: Date; to?: Date };
  onChange?: (r: { from?: Date; to?: Date }) => void;
}) {
  const [open, setOpen] = useState(false);
  const label = value?.from
    ? value.to
      ? `${format(value.from, "d MMM")} – ${format(value.to, "d MMM")}`
      : format(value.from, "d MMM yyyy")
    : "Pick a date range";
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 justify-start gap-2 rounded-xl">
          <CalendarIcon className="h-4 w-4" /> {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={value as never}
          onSelect={(r: never) => onChange?.(r ?? {})}
          numberOfMonths={2}
          className={cn("p-3 pointer-events-auto")}
        />
      </PopoverContent>
    </Popover>
  );
}

// ────────────── Advanced filters bar ──────────────
export function AdvancedFilters({
  search,
  onSearch,
  status,
  onStatus,
  statuses,
  category,
  onCategory,
  categories,
  extra,
}: {
  search: string;
  onSearch: (v: string) => void;
  status: string;
  onStatus: (v: string) => void;
  statuses: { value: string; label: string }[];
  category: string;
  onCategory: (v: string) => void;
  categories: string[];
  extra?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Search products, SKUs, barcodes…" className="h-10 rounded-xl pl-9" />
      </div>
      <Select value={category} onValueChange={onCategory}>
        <SelectTrigger className="h-10 w-[180px] rounded-xl"><SelectValue placeholder="Category" /></SelectTrigger>
        <SelectContent>{categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={status} onValueChange={onStatus}>
        <SelectTrigger className="h-10 w-[160px] rounded-xl"><SelectValue placeholder="Status" /></SelectTrigger>
        <SelectContent>{statuses.map((s) => <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>)}</SelectContent>
      </Select>
      {extra}
      <Button variant="outline" className="h-10 rounded-xl"><Filter className="mr-2 h-4 w-4" /> More</Button>
    </div>
  );
}

// ────────────── Column visibility menu ──────────────
export function ColumnToggle({
  columns,
  visible,
  onToggle,
}: {
  columns: { key: string; label: string }[];
  visible: Record<string, boolean>;
  onToggle: (k: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="h-10 rounded-xl"><Eye className="mr-2 h-4 w-4" /> Columns</Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-56 p-2">
        <p className="px-2 py-1 text-xs font-semibold text-muted-foreground">Toggle columns</p>
        {columns.map((c) => (
          <button
            key={c.key}
            onClick={() => onToggle(c.key)}
            className="flex w-full items-center justify-between rounded-lg px-2 py-1.5 text-sm hover:bg-muted"
          >
            <span>{c.label}</span>
            {visible[c.key] ? <Eye className="h-3.5 w-3.5 text-primary" /> : <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />}
          </button>
        ))}
      </PopoverContent>
    </Popover>
  );
}

// ────────────── Bulk Action Toolbar ──────────────
export function BulkActionToolbar({
  count,
  onClear,
  actions,
}: {
  count: number;
  onClear: () => void;
  actions: { label: string; icon?: React.ComponentType<{ className?: string }>; onClick: () => void; tone?: "default" | "danger" }[];
}) {
  if (count === 0) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-2 z-30 mb-3 flex items-center justify-between gap-3 rounded-2xl border border-border/60 bg-card/95 p-3 backdrop-blur soft-shadow"
    >
      <div className="flex items-center gap-2 text-sm">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">{count}</span>
        <span className="font-medium">selected</span>
        <Button variant="ghost" size="sm" className="h-7 rounded-lg" onClick={onClear}><X className="mr-1 h-3.5 w-3.5" /> Clear</Button>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {actions.map((a) => (
          <Button
            key={a.label}
            size="sm"
            variant={a.tone === "danger" ? "destructive" : "outline"}
            className="h-8 rounded-lg"
            onClick={a.onClick}
          >
            {a.icon && <a.icon className="mr-1.5 h-3.5 w-3.5" />}
            {a.label}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

// ────────────── CSV Import Dialog ──────────────
export function CsvImportDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onConfirm: () => void;
}) {
  const [stage, setStage] = useState<"upload" | "preview" | "done">("upload");
  const preview = [
    ["SKU-20101", "Mango Alphonso", "Fruits & Veg", "₹449", "200"],
    ["SKU-20102", "Cold Brew Pack", "Beverages", "₹599", "120"],
    ["SKU-20103", "Ghee A2", "Dairy & Eggs", "₹899", "60"],
    ["SKU-20104", "Saffron 2g", "Pantry", "₹1,299", "30"],
  ];
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl rounded-3xl">
        <DialogHeader>
          <DialogTitle>Bulk import</DialogTitle>
          <DialogDescription>Upload a CSV / Excel file. We'll validate rows and let you resolve conflicts before committing.</DialogDescription>
        </DialogHeader>
        {stage === "upload" && (
          <div className="rounded-2xl border-2 border-dashed border-border/60 bg-muted/30 p-10 text-center">
            <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
            <p className="text-sm font-semibold">Drop your CSV here</p>
            <p className="mt-1 text-xs text-muted-foreground">Maximum 10,000 rows · 20MB</p>
            <Button className="mt-4 rounded-xl" onClick={() => setStage("preview")}><Upload className="mr-2 h-4 w-4" /> Choose file</Button>
          </div>
        )}
        {stage === "preview" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600">42 valid</span>
                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-semibold text-amber-600">3 warnings</span>
                <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600">1 conflict</span>
              </div>
              <p className="text-xs text-muted-foreground">products_2026Q3.csv</p>
            </div>
            <div className="overflow-hidden rounded-2xl border border-border/60">
              <table className="w-full text-sm">
                <thead className="bg-muted/40 text-[11px] uppercase text-muted-foreground">
                  <tr>{["SKU","Name","Category","Price","Stock"].map((h) => <th key={h} className="px-3 py-2 text-left">{h}</th>)}</tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {preview.map((row, i) => (
                    <tr key={i}>{row.map((c, j) => <td key={j} className="px-3 py-2">{c}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        {stage === "done" && (
          <div className="py-8 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-full bg-emerald-500/10 text-emerald-600">
              <Check className="h-6 w-6" />
            </div>
            <p className="font-display text-lg font-bold">Import complete</p>
            <p className="text-sm text-muted-foreground">42 products imported successfully.</p>
          </div>
        )}
        <DialogFooter>
          {stage === "upload" && <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>}
          {stage === "preview" && (
            <>
              <Button variant="ghost" onClick={() => setStage("upload")}>Back</Button>
              <Button className="rounded-xl" onClick={() => { setStage("done"); setTimeout(() => { onConfirm(); onOpenChange(false); setStage("upload"); }, 900); }}>Commit import</Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────────────── Export Dialog ──────────────
export function ExportDialog({ open, onOpenChange, onExport }: { open: boolean; onOpenChange: (v: boolean) => void; onExport: (fmt: string) => void }) {
  const [fmt, setFmt] = useState("csv");
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader><DialogTitle>Export data</DialogTitle><DialogDescription>Choose a format for your download.</DialogDescription></DialogHeader>
        <div className="grid grid-cols-3 gap-2">
          {["csv","xlsx","pdf"].map((f) => (
            <button
              key={f}
              onClick={() => setFmt(f)}
              className={cn(
                "rounded-2xl border p-4 text-center text-sm font-semibold capitalize transition",
                fmt === f ? "border-primary bg-primary/5 text-primary" : "border-border/60 hover:bg-muted",
              )}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button className="rounded-xl" onClick={() => { onExport(fmt); onOpenChange(false); }}><Download className="mr-2 h-4 w-4" /> Download</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────────────── Confirmation Dialog ──────────────
export function ConfirmDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  tone = "default",
  confirmLabel = "Confirm",
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  title: string;
  description?: string;
  onConfirm: () => void;
  tone?: "default" | "danger";
  confirmLabel?: string;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {tone === "danger" && <AlertTriangle className="h-4 w-4 text-rose-500" />} {title}
          </DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant={tone === "danger" ? "destructive" : "default"} className="rounded-xl" onClick={() => { onConfirm(); onOpenChange(false); }}>
            {confirmLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ────────────── Mini icons for re-export convenience ──────────────
export const ErpIcons = { Barcode, Boxes, Package, PackageCheck, Truck, Printer, Trash2, Download, Upload, Filter, ArrowUp, ArrowDown };
export type { ReactNode };
export { Checkbox };