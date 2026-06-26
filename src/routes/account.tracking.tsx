import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Truck, MapPin, Phone, LifeBuoy, Clock } from "lucide-react";
import { orders, formatDate, formatTime, statusColor, addresses } from "@/mock/account";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PanelCard } from "@/components/dashboard/cards";
import { useState } from "react";

export const Route = createFileRoute("/account/tracking")({
  component: TrackingPage,
});

function TrackingPage() {
  const active = orders.find((o) => o.status === "Out for Delivery") ?? orders[0];
  const [query, setQuery] = useState(active.number);
  const order = orders.find((o) => o.number.toLowerCase() === query.toLowerCase()) ?? active;
  const addr = addresses.find((a) => a.id === order.addressId)!;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3 rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Tracking # or order number"
          className="h-10 max-w-sm rounded-full"
        />
        <Button className="rounded-full">Track</Button>
        <Badge variant="secondary" className={`ml-auto ${statusColor(order.status)}`}>{order.status}</Badge>
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <PanelCard title="Delivery progress">
            <ol className="relative space-y-6 border-l-2 border-dashed border-border pl-6">
              {order.timeline.map((t, i) => (
                <motion.li
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span
                    className={`absolute -left-[9px] grid h-4 w-4 place-items-center rounded-full ${
                      t.done ? "bg-primary" : "bg-muted"
                    }`}
                  />
                  <p className={`text-sm ${t.done ? "font-semibold" : "text-muted-foreground"}`}>{t.label}</p>
                  {t.done && <p className="text-xs text-muted-foreground">{formatTime(t.at)}</p>}
                </motion.li>
              ))}
            </ol>
          </PanelCard>

          <PanelCard title="Live location">
            <div className="relative h-64 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-100 via-sky-100 to-violet-100 dark:from-emerald-900/20 dark:via-sky-900/20 dark:to-violet-900/20">
              <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(var(--color-border)_1px,transparent_1px),linear-gradient(90deg,var(--color-border)_1px,transparent_1px)] [background-size:24px_24px]" />
              <motion.div
                animate={{ x: [0, 30, 60, 90, 60, 30, 0], y: [0, -10, 0, 15, 0, -10, 0] }}
                transition={{ duration: 12, repeat: Infinity }}
                className="absolute left-1/3 top-1/2 grid h-10 w-10 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg"
              >
                <Truck className="h-5 w-5" />
              </motion.div>
              <div className="absolute bottom-3 left-3 rounded-full bg-background/90 px-3 py-1 text-xs font-medium shadow-sm">
                Approx. 2.4 km away · Driver on the way
              </div>
            </div>
          </PanelCard>
        </div>

        <div className="space-y-5">
          <PanelCard title="Delivery partner">
            <div className="flex items-center gap-3">
              <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
                <Truck className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold">{order.courier}</p>
                <p className="text-xs text-muted-foreground">TRK · {order.trackingNumber}</p>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-muted-foreground">ETA</p>
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <Clock className="h-3.5 w-3.5" /> Today, 7:30 PM
                </p>
              </div>
              <div className="rounded-xl bg-muted/40 p-3">
                <p className="text-muted-foreground">Placed</p>
                <p className="mt-1 font-semibold">{formatDate(order.placedAt)}</p>
              </div>
            </div>
            <Button className="mt-3 w-full rounded-full" variant="outline">
              <Phone className="mr-2 h-4 w-4" /> Call driver
            </Button>
          </PanelCard>

          <PanelCard title="Deliver to">
            <div className="rounded-2xl bg-muted/30 p-3">
              <p className="flex items-center gap-2 text-xs font-semibold">
                <MapPin className="h-3.5 w-3.5 text-primary" /> {addr.label}
              </p>
              <p className="mt-2 text-sm font-medium">{addr.name}</p>
              <p className="text-xs text-muted-foreground">
                {addr.line1}, {addr.line2 ? addr.line2 + ", " : ""} {addr.city} {addr.pincode}
              </p>
            </div>
            <p className="mt-3 text-xs text-muted-foreground">
              Delivery instructions: Leave at the door, ring the bell twice.
            </p>
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