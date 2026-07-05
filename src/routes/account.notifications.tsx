import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Search, Loader2 } from "lucide-react";
import {
  useMyNotifications,
  useMarkAllRead,
  useMarkNotificationRead,
} from "@/features/notifications/hooks";
import { formatTime } from "@/features/orders/status";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PanelCard } from "@/components/dashboard/cards";
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/account/notifications")({
  component: NotificationsPage,
});

const CATS = ["All", "order", "payment", "delivery", "promotion", "system", "account"] as const;
const CAT_LABEL: Record<(typeof CATS)[number], string> = {
  All: "All",
  order: "Orders",
  payment: "Payments",
  delivery: "Delivery",
  promotion: "Offers",
  system: "System",
  account: "Account",
};

function NotificationsPage() {
  const { data, isLoading, error } = useMyNotifications();
  const markOne = useMarkNotificationRead();
  const markAll = useMarkAllRead();
  const [cat, setCat] = useState<(typeof CATS)[number]>("All");
  const [q, setQ] = useState("");
  const [tab, setTab] = useState<"all" | "unread">("all");

  const filtered = useMemo(() => {
    const list = data ?? [];
    return list
      .filter((n) => (cat === "All" ? true : n.category === cat))
      .filter(
        (n) =>
          n.title.toLowerCase().includes(q.toLowerCase()) ||
          (n.body ?? "").toLowerCase().includes(q.toLowerCase()),
      )
      .filter((n) => (tab === "all" ? true : !n.is_read));
  }, [data, cat, q, tab]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2">
        {CATS.map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-medium transition",
              cat === c ? "bg-primary text-primary-foreground" : "bg-card border border-border hover:bg-muted",
            )}
          >
            {CAT_LABEL[c]}
          </button>
        ))}
      </div>

      <PanelCard
        title="Inbox"
        action={
          <Button size="sm" variant="ghost" className="rounded-full" disabled={markAll.isPending} onClick={() => markAll.mutate()}>
            <CheckCheck className="mr-1 h-4 w-4" /> Mark all read
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
            <TabsList className="rounded-full">
              <TabsTrigger value="all" className="rounded-full">All</TabsTrigger>
              <TabsTrigger value="unread" className="rounded-full">Unread</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="relative ml-auto flex-1 min-w-48 max-w-xs">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="h-9 rounded-full pl-9" />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading notifications…
          </div>
        ) : error ? (
          <EmptyState icon={Bell} title="Couldn't load notifications" description={error instanceof Error ? error.message : "Please try again."} />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Bell} title="Nothing here" description="You're all caught up." />
        ) : (
          <ul className="divide-y divide-border/60">
            <AnimatePresence>
              {filtered.map((n) => (
                <motion.li
                  key={n.id}
                  layout
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-start gap-3 py-3 first:pt-0 last:pb-0"
                >
                  <span className={cn("mt-2 h-2 w-2 shrink-0 rounded-full", n.is_read ? "bg-muted-foreground/30" : "bg-primary")} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{n.title}</p>
                      <Badge variant="secondary" className="rounded-full text-[10px] capitalize">{n.category}</Badge>
                      <span className="ml-auto text-[11px] text-muted-foreground">{formatTime(n.created_at)}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{n.body}</p>
                  </div>
                  {!n.is_read && (
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" disabled={markOne.isPending} onClick={() => markOne.mutate(n.id)}>
                      <CheckCheck className="h-4 w-4" />
                    </Button>
                  )}
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
        )}
      </PanelCard>
    </div>
  );
}