import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader, PanelCard, EmptyState } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { adminNotifications } from "@/features/admin/mock/data";
import { Archive, Bell, Check, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/notifications")({
  component: NotificationsPage,
});

const cats = ["all","orders","inventory","customers","payments","system","marketing"] as const;

function NotificationsPage() {
  const [items, setItems] = useState(adminNotifications);
  const [q, setQ] = useState("");

  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })));

  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Notifications" }]}
        title="Notification center"
        description="A single inbox for orders, inventory, payments and more."
        actions={<Button variant="outline" className="rounded-xl" onClick={markAll}><Check className="mr-2 h-4 w-4" /> Mark all read</Button>}
      />
      <PanelCard title="Inbox">
        <div className="mb-4 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search notifications…" className="h-10 rounded-xl pl-9" />
          </div>
        </div>
        <Tabs defaultValue="all">
          <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/40 p-1">
            {cats.map((c) => <TabsTrigger key={c} value={c} className="text-xs capitalize">{c}</TabsTrigger>)}
          </TabsList>
          {cats.map((c) => {
            const list = items
              .filter((n) => (c === "all" ? true : n.category === c))
              .filter((n) => !q || n.title.toLowerCase().includes(q.toLowerCase()) || n.body.toLowerCase().includes(q.toLowerCase()));
            return (
              <TabsContent key={c} value={c} className="mt-4">
                {list.length === 0 ? (
                  <EmptyState icon={Bell} title="All caught up" description="No notifications in this category." />
                ) : (
                  <ul className="space-y-2">
                    {list.map((n) => (
                      <li key={n.id} className={cn("flex items-start gap-3 rounded-2xl border border-border/60 p-4", n.unread && "bg-primary/5")}>
                        <span className={cn("mt-1 h-2.5 w-2.5 shrink-0 rounded-full", n.unread ? "bg-primary" : "bg-muted")} />
                        <div className="flex-1">
                          <div className="flex items-baseline justify-between gap-2">
                            <p className="text-sm font-semibold">{n.title}</p>
                            <span className="text-[11px] text-muted-foreground">{n.time}</span>
                          </div>
                          <p className="text-sm text-muted-foreground">{n.body}</p>
                          <div className="mt-2 flex gap-2">
                            <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs"><Check className="mr-1 h-3 w-3" /> Mark read</Button>
                            <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs"><Archive className="mr-1 h-3 w-3" /> Archive</Button>
                            <Button size="sm" variant="ghost" className="h-7 rounded-lg text-xs text-rose-600"><Trash2 className="mr-1 h-3 w-3" /> Delete</Button>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </PanelCard>
    </div>
  );
}