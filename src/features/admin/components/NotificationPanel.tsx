import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAdminStore } from "@/store/admin";
import { adminNotifications } from "@/features/admin/mock/data";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Bell, Check } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

const cats = ["all","orders","inventory","customers","payments","system","marketing"] as const;

export function NotificationPanel() {
  const { notificationsOpen, setNotificationsOpen } = useAdminStore();
  const [items, setItems] = useState(adminNotifications);
  const markAll = () => setItems((arr) => arr.map((n) => ({ ...n, unread: false })));
  return (
    <Sheet open={notificationsOpen} onOpenChange={setNotificationsOpen}>
      <SheetContent side="right" className="w-full p-0 sm:max-w-md">
        <SheetHeader className="border-b border-border/60 px-5 py-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="font-display text-lg font-bold">Notifications</SheetTitle>
            <Button variant="ghost" size="sm" onClick={markAll} className="text-xs">
              <Check className="mr-1 h-3.5 w-3.5" /> Mark all read
            </Button>
          </div>
        </SheetHeader>
        <Tabs defaultValue="all" className="flex h-[calc(100%-65px)] flex-col">
          <TabsList className="m-3 flex h-auto flex-wrap justify-start gap-1 bg-muted/50 p-1">
            {cats.map((c) => (
              <TabsTrigger key={c} value={c} className="text-[11px] capitalize">{c}</TabsTrigger>
            ))}
          </TabsList>
          {cats.map((c) => {
            const list = c === "all" ? items : items.filter((n) => n.category === c);
            return (
              <TabsContent key={c} value={c} className="flex-1 overflow-y-auto px-3 pb-6">
                {list.length === 0 && (
                  <div className="grid place-items-center py-16 text-center text-sm text-muted-foreground">
                    <Bell className="mb-2 h-6 w-6" /> Nothing here yet.
                  </div>
                )}
                <ul className="space-y-2">
                  {list.map((n) => (
                    <li
                      key={n.id}
                      className={cn(
                        "rounded-2xl border border-border/60 p-3 transition-colors hover:bg-muted/40",
                        n.unread && "bg-primary/5",
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={cn(
                            "mt-1 h-2 w-2 shrink-0 rounded-full",
                            n.unread ? "bg-primary" : "bg-transparent",
                          )}
                        />
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-semibold">{n.title}</p>
                          <p className="text-xs text-muted-foreground">{n.body}</p>
                          <p className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground">
                            {n.category} · {n.time}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </TabsContent>
            );
          })}
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}