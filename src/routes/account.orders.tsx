import { useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Search,
  XCircle,
  RefreshCw,
  Package,
  Loader2,
} from "lucide-react";
import { useMyOrders, useUpdateOrderStatus } from "@/features/orders/hooks";
import { statusPillClass, statusLabel } from "@/features/orders/status";
import type { OrderWithRefs } from "@/features/orders/api";
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
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { PanelCard } from "@/components/dashboard/cards";
import { toast } from "sonner";

export const Route = createFileRoute("/account/orders")({
  component: OrdersPage,
});

const PAGE_SIZE = 8;
const STATUSES = [
  "pending",
  "confirmed",
  "picking",
  "packing",
  "ready_for_dispatch",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "returned",
  "refunded",
] as const;

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function OrdersPage() {
  const { data, isLoading, error } = useMyOrders();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [sort, setSort] = useState<string>("recent");
  const [page, setPage] = useState(1);
  const [active, setActive] = useState<OrderWithRefs | null>(null);

  const filtered = useMemo(() => {
    const arr = (data ?? []).filter((o) => {
      const hay = [o.order_number, ...o.items.map((i) => i.product_name)].join(" ").toLowerCase();
      if (q && !hay.includes(q.toLowerCase())) return false;
      if (status !== "all" && o.status !== status) return false;
      return true;
    });
    if (sort === "amount") arr.sort((a, b) => Number(b.total) - Number(a.total));
    else arr.sort((a, b) => +new Date(b.placed_at) - +new Date(a.placed_at));
    return arr;
  }, [data, q, status, sort]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const slice = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading your orders…
      </div>
    );
  }
  if (error) {
    return (
      <EmptyState
        icon={Package}
        title="Couldn't load orders"
        description={error instanceof Error ? error.message : "Please try again."}
      />
    );
  }

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
          <SelectTrigger className="h-10 w-44 rounded-full bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {STATUSES.map((s) => (
              <SelectItem key={s} value={s}>
                {statusLabel(s)}
              </SelectItem>
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
      </div>

      {slice.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Place your first order from the shop and it'll show up here."
          action={
            <Button asChild className="rounded-full">
              <Link to="/shop">Browse shop</Link>
            </Button>
          }
        />
      ) : (
        <ul className="space-y-3">
          {slice.map((o, i) => (
            <OrderRow key={o.id} order={o} index={i} onOpen={() => setActive(o)} />
          ))}
        </ul>
      )}

      <Pagination page={page} pages={pages} onChange={setPage} />

      <Sheet open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
          {active && <OrderDetails order={active} onClose={() => setActive(null)} />}
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

function OrderRow({ order, index, onOpen }: { order: OrderWithRefs; index: number; onOpen: () => void }) {
  const names = order.items.map((i) => i.product_name).join(", ");
  return (
    <motion.li
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="rounded-3xl border border-border/60 bg-card p-4 soft-shadow"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold">{order.order_number}</p>
            <Badge variant="secondary" className={statusPillClass(order.status)}>
              {statusLabel(order.status)}
            </Badge>
          </div>
          <p className="text-xs text-muted-foreground">
            {order.items.length} item{order.items.length > 1 ? "s" : ""} · placed {formatDate(order.placed_at)}
            {order.payment_method ? ` · ${order.payment_method.toUpperCase()}` : ""}
          </p>
          <p className="mt-1 truncate text-sm text-foreground/80">{names}</p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <p className="font-display text-lg font-bold">{inr(Number(order.total))}</p>
          <Button size="sm" variant="outline" className="rounded-full" onClick={onOpen}>
            View details
          </Button>
        </div>
      </div>
    </motion.li>
  );
}

function OrderDetails({ order, onClose }: { order: OrderWithRefs; onClose: () => void }) {
  const cancelMutation = useUpdateOrderStatus();
  const canCancel = order.status === "pending" || order.status === "confirmed";
  const history = [...order.history].sort(
    (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
  );

  async function handleCancel() {
    try {
      await cancelMutation.mutateAsync({
        orderId: order.id,
        status: "cancelled",
        note: "Cancelled by customer",
      });
      toast.success("Order cancelled");
      onClose();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not cancel order");
    }
  }

  return (
    <div className="space-y-5">
      <SheetHeader>
        <SheetTitle className="flex items-center gap-3">
          {order.order_number}
          <Badge variant="secondary" className={statusPillClass(order.status)}>
            {statusLabel(order.status)}
          </Badge>
        </SheetTitle>
      </SheetHeader>

      <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">Timeline</p>
        <ol className="mt-3 space-y-3">
          {history.length === 0 ? (
            <li className="text-sm text-muted-foreground">No status updates yet.</li>
          ) : (
            history.map((t) => (
              <li key={t.id} className="flex items-start gap-3">
                <span className="mt-1 h-3 w-3 rounded-full bg-primary" />
                <div className="flex-1">
                  <p className="text-sm font-semibold">{statusLabel(t.status)}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(t.created_at)}</p>
                  {t.note && <p className="mt-0.5 text-xs text-foreground/70">{t.note}</p>}
                </div>
              </li>
            ))
          )}
        </ol>
      </div>

      <PanelCard title="Items">
        <ul className="divide-y divide-border/60">
          {order.items.map((it) => (
            <li key={it.id} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium">{it.product_name}</p>
                <p className="text-xs text-muted-foreground">
                  Qty {it.qty}
                  {it.product_unit ? ` · ${it.product_unit}` : ""}
                </p>
              </div>
              <p className="text-sm font-semibold">{inr(Number(it.subtotal))}</p>
            </li>
          ))}
        </ul>
      </PanelCard>

      <PanelCard title="Delivery">
        <p className="text-sm font-medium">{order.ship_full_name}</p>
        <p className="text-xs text-muted-foreground">{order.ship_phone}</p>
        <p className="mt-1 text-sm text-foreground/80">
          {order.ship_line1}
          {order.ship_line2 ? `, ${order.ship_line2}` : ""}, {order.ship_city}, {order.ship_state} {order.ship_pincode}
        </p>
      </PanelCard>

      <PanelCard title="Summary">
        <Row label="Subtotal" value={inr(Number(order.subtotal))} />
        <Row label="Tax" value={inr(Number(order.tax_amount))} />
        <Row label="Delivery" value={Number(order.delivery_fee) === 0 ? "Free" : inr(Number(order.delivery_fee))} />
        {Number(order.discount_amount) > 0 && (
          <Row label="Discount" value={`− ${inr(Number(order.discount_amount))}`} />
        )}
        <div className="mt-2 border-t pt-2">
          <Row label="Total" value={inr(Number(order.total))} bold />
        </div>
      </PanelCard>

      {canCancel && (
        <Button
          variant="ghost"
          className="w-full rounded-full text-rose-600 hover:bg-rose-500/10"
          disabled={cancelMutation.isPending}
          onClick={handleCancel}
        >
          {cancelMutation.isPending ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <XCircle className="mr-2 h-4 w-4" />
          )}
          Cancel order
        </Button>
      )}
      {!canCancel && order.status === "delivered" && (
        <Button variant="outline" className="w-full rounded-full" asChild>
          <Link to="/account/tracking">
            <RefreshCw className="mr-2 h-4 w-4" /> Track another order
          </Link>
        </Button>
      )}
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