import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Truck, MapPin, LifeBuoy, Clock, Loader2, Package } from "lucide-react";
import { useMyOrders } from "@/features/orders/hooks";
import { STATUS_LABEL, statusColor, formatDate, formatTime } from "@/features/orders/status";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PanelCard } from "@/components/dashboard/cards";
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/account/tracking")({
  component: TrackingPage,
});

function TrackingPage() {
  const { data, isLoading, error } = useMyOrders();
  const orders = data ?? [];
  const active = useMemo(
    () =>
      orders.find((o) => o.status === "out_for_delivery") ??
      orders.find((o) => o.status !== "delivered" && o.status !== "cancelled") ??
      orders[0],
    [orders],
  );
  const [query, setQuery] = useState("");
  const q = query.trim().toLowerCase();
  const order = q
    ? orders.find((o) => o.order_number.toLowerCase() === q) ?? active
    : active;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading order tracking…
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
  if (!order) {
    return (
      <EmptyState
        icon={Truck}
        title="Nothing to track yet"
        description="Once you place an order, live tracking will show up here."
        action={
          <Button asChild className="rounded-full">
            <Link to="/shop">Browse shop</Link>
          </Button>
        }
      />
    );
  }

  const history = [...order.history].sort(
    (a, b) => +new Date(a.created_at) - +new Date(b.created_at),
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`Order # (e.g. ${order.order_number})`}
          className="h-10 max-w-sm rounded-full"
        />
        <Button className="rounded-full">Track</Button>
        <Badge variant="secondary" className={`ml-auto ${statusColor(order.status)}`}>
          {STATUS_LABEL[order.status]}
        </Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <PanelCard title="Delivery progress">
            <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
              {history.length === 0 && (
                <li className="text-sm text-muted-foreground">No status updates yet.</li>
              )}
              {history.map((t, i) => (
                <motion.li
                  key={t.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full bg-primary" />
                  <p className="text-sm font-semibold">{STATUS_LABEL[t.status]}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(t.created_at)}</p>
                  {t.note && <p className="mt-0.5 text-xs text-foreground/70">{t.note}</p>}
                </motion.li>
              ))}
            </ol>
          </PanelCard>
        </div>

        <div className="space-y-5">
          <PanelCard title="Order details">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{order.order_number}</p>
                <p className="text-xs text-muted-foreground">{order.items.length} items</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-muted-foreground">Slot</p>
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <Clock className="h-3.5 w-3.5" /> {order.delivery_slot ?? "Standard"}
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-muted-foreground">Placed</p>
                <p className="mt-1 font-semibold">{formatDate(order.placed_at)}</p>
              </div>
            </div>
          </PanelCard>

          <PanelCard title="Deliver to">
            <div className="rounded-2xl bg-muted/30 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold">
                <MapPin className="h-3.5 w-3.5 text-primary" /> Delivery address
              </p>
              <p className="mt-2 text-sm font-medium">{order.ship_full_name}</p>
              <p className="text-xs text-muted-foreground">
                {order.ship_line1}
                {order.ship_line2 ? `, ${order.ship_line2}` : ""}, {order.ship_city}, {order.ship_state} {order.ship_pincode}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{order.ship_phone}</p>
            </div>
            {order.notes && (
              <p className="mt-3 text-xs text-muted-foreground">Notes: {order.notes}</p>
            )}
          </PanelCard>

          <PanelCard title="Need help?">
            <Button asChild className="w-full rounded-full" variant="outline">
              <Link to="/account/support">
                <LifeBuoy className="mr-2 h-4 w-4" /> Contact support
              </Link>
            </Button>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}