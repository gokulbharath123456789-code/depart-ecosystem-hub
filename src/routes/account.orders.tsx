import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Search,
  LayoutGrid,
  List,
  FileText,
  RotateCcw,
  XCircle,
  RefreshCw,
  Package,
  ChevronRight,
} from "lucide-react";
import { orders as ALL, statusColor, formatDate, type Order } from "@/mock/account";
import { inr } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ProductMedia } from "@/components/storefront/ProductMedia";
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { PanelCard } from "@/components/dashboard/cards";
import { toast } from "sonner";
import { useCart } from "@/store/cart";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

const PAGE_SIZE = 8;

function OrdersPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("recent");
  const [view, setView] = useState<"grid" | "list">("list");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<Order | null>(null);
  const add = useCart((s) => s.add);

  const filtered = useMemo(() => {
    let arr = ALL.filter((o) =>
      [o.number, o.items.map((i) => i.product.name).join(" ")]
        .join(" ")
        .toLowerCase()
        .includes(q.toLowerCase()),
    );
    if (status !== "all") arr = arr.filter((o) => o.status === status);
    if (sort === "recent") arr = [...arr].sort((a, b) => +new Date(b.placedAt) - +new Date(a.placedAt));
    if (sort === "amount") arr = [...arr].sort((a, b) => b.total - a.total);
    return arr;
  }, [q, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by order # or product"
            className="h-10 rounded-full bg-card pl-9"
          />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-10 w-40 rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {["Pending","Confirmed","Packed","Shipped","Out for Delivery","Delivered","Cancelled","Returned"].map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-10 w-36 rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="amount">Amount: high</SelectItem>
          </SelectContent>
        </Select>
        <div className="ml-auto flex rounded-full border border-border bg-card p-0.5">
          <Button
            onClick={() => setView("list")}
            size="sm"
            variant={view === "list" ? "default" : "ghost"}
            className="h-8 rounded-full"
          >
            <List className="h-4 w-4" />
          </Button>
          <Button
            onClick={() => setView("grid")}
            size="sm"
            variant={view === "grid" ? "default" : "ghost"}
            className="h-8 rounded-full"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {slice.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders found"
          description="Try clearing filters or place your first order from the shop."
          action={
            <Button asChild className="rounded-full">
              <Link to="/shop">Browse shop</Link>
            </Button>
          }
        />
      ) : view === "list" ? (
        <ul className="space-y-3">
          {slice.map((o, i) => (
            <OrderRow key={o.id} order={o} index={i} onOpen={() => setActive(o)} onReorder={() => {
              o.items.forEach((it) => add(it.product.id, it.qty));
              toast.success("Items added to cart");
            }} />
          ))}
        </ul>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {slice.map((o, i) => (
            <OrderCard key={o.id} order={o} index={i} onOpen={() => setActive(o)} />
          ))}
        </div>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />

      <Sheet open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {active && <OrderDetails order={active} />}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-2 pt-2">
      <Button variant="outline" size="sm" className="rounded-full" disabled={page === 1} onClick={() => onChange(page - 1)}>
        Prev
      </Button>
      {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
        <Button
          key={p}
          size="sm"
          variant={p === page ? "default" : "outline"}
          className="h-8 w-8 rounded-full p-0"
          onClick={() => onChange(p)}
        >
          {p}
        </Button>
      ))}
      <Button variant="outline" size="sm" className="rounded-full" disabled={page === pages} onClick={() => onChange(page + 1)}>
        Next
      </Button>
    </div>
  );
}

function OrderRow({ order, index, onOpen, onReorder }: { order: Order; index: number; onOpen: () => void; onReorder: () => void }) {
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-3xl border border-border/60 bg-card p-4 soft-shadow"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex -space-x-2">
          {order.items.slice(0, 3).map((it, idx) => (
            <ProductMedia
              key={idx}
              emoji={it.product.emoji}
              gradient={it.product.gradient}
              size="sm"
              className="h-12 w-12 rounded-2xl ring-2 ring-card"
            />
          ))}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{order.number}</p>
            <Badge variant="secondary" className={statusColor(order.status)}>
              {order.status}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · placed {formatDate(order.placedAt)} · {order.paymentMethod}
          </p>
          <p className="mt-1 truncate text-sm text-foreground/80">
            {order.items.map((i) => i.product.name).join(", ")}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-display text-lg font-bold">{inr(order.total)}</p>
          <div className="flex gap-2">
            <Button size="sm" variant="outline" className="rounded-full" onClick={onOpen}>
              View
            </Button>
            <Button size="sm" className="rounded-full" onClick={onReorder}>
              <RefreshCw className="mr-1 h-3.5 w-3.5" /> Reorder
            </Button>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

function OrderCard({ order, index, onOpen }: { order: Order; index: number; onOpen: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="flex flex-col rounded-3xl border border-border/60 bg-card p-5 soft-shadow"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="font-semibold">{order.number}</p>
          <p className="text-xs text-muted-foreground">{formatDate(order.placedAt)}</p>
        </div>
        <Badge variant="secondary" className={statusColor(order.status)}>
          {order.status}
        </Badge>
      </div>
      <div className="my-4 flex -space-x-2">
        {order.items.slice(0, 4).map((it, idx) => (
          <ProductMedia
            key={idx}
            emoji={it.product.emoji}
            gradient={it.product.gradient}
            size="sm"
            className="h-12 w-12 rounded-2xl ring-2 ring-card"
          />
        ))}
      </div>
      <p className="line-clamp-2 text-sm text-foreground/80">
        {order.items.map((i) => i.product.name).join(", ")}
      </p>
      <div className="mt-auto flex items-center justify-between pt-4">
        <p className="font-display text-lg font-bold">{inr(order.total)}</p>
        <Button size="sm" variant="outline" className="rounded-full" onClick={onOpen}>
          Details <ChevronRight className="ml-1 h-3.5 w-3.5" />
        </Button>
      </div>
    </motion.div>
  );
}

function OrderDetails({ order }: { order: Order }) {
  const add = useCart((s) => s.add);
  return (
    <div className="space-y-5">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          {order.number}
          <Badge variant="secondary" className={statusColor(order.status)}>{order.status}</Badge>
        </SheetTitle>
      </SheetHeader>

      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Timeline</p>
        <ol className="mt-3 space-y-3">
          {order.timeline.map((t, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className={`mt-1 h-3 w-3 rounded-full ${t.done ? "bg-primary" : "bg-muted-foreground/30"}`} />
              <div className="flex-1">
                <p className={`text-sm ${t.done ? "font-semibold" : "text-muted-foreground"}`}>{t.label}</p>
                {t.done && <p className="text-xs text-muted-foreground">{formatDate(t.at)}</p>}
              </div>
            </li>
          ))}
        </ol>
      </div>

      <PanelCard title="Items">
        <ul className="divide-y divide-border/60">
          {order.items.map((it, i) => (
            <li key={i} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <ProductMedia emoji={it.product.emoji} gradient={it.product.gradient} size="sm" className="h-12 w-12 rounded-xl" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{it.product.name}</p>
                <p className="text-xs text-muted-foreground">Qty {it.qty} · {it.product.unit}</p>
              </div>
              <p className="text-sm font-semibold">{inr(it.product.price * it.qty)}</p>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title="Summary">
        <Row label="Subtotal" value={inr(order.subtotal)} />
        <Row label="Delivery" value={order.delivery === 0 ? "Free" : inr(order.delivery)} />
        <Row label="Discount" value={`− ${inr(order.discount)}`} />
        <div className="mt-2 border-t pt-2">
          <Row label="Total" value={inr(order.total)} bold />
        </div>
      </PanelCard>

      <div className="flex flex-wrap gap-2">
        <Button className="rounded-full" onClick={() => toast.success("Invoice downloaded (demo)")}>
          <FileText className="mr-2 h-4 w-4" /> Invoice
        </Button>
        <Button variant="outline" className="rounded-full" onClick={() => { order.items.forEach((it) => add(it.product.id, it.qty)); toast.success("Added to cart"); }}>
          <RefreshCw className="mr-2 h-4 w-4" /> Buy again
        </Button>
        <Button variant="outline" className="rounded-full" onClick={() => toast.success("Return request created (demo)")}>
          <RotateCcw className="mr-2 h-4 w-4" /> Return
        </Button>
        {order.status !== "Delivered" && order.status !== "Cancelled" && (
          <Button variant="ghost" className="rounded-full text-rose-600 hover:bg-rose-500/10" onClick={() => toast.success("Order cancelled (demo)")}>
            <XCircle className="mr-2 h-4 w-4" /> Cancel
          </Button>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className={`flex items-center justify-between py-1 text-sm ${bold ? "font-bold" : ""}`}>
      <span className={bold ? "" : "text-muted-foreground"}>{label}</span>
      <span>{value}</span>
    </div>
  );
}