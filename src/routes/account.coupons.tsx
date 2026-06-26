import { createFileRoute } from "@tanstack/react-router";
import { Ticket, Copy, Sparkles } from "lucide-react";
import { coupons, formatDate, type Coupon } from "@/mock/account";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PanelCard } from "@/components/dashboard/cards";
import { toast } from "sonner";

export const Route = createFileRoute("/account/coupons")({
  component: CouponsPage,
});

function CouponCard({ c }: { c: Coupon }) {
  return (
    <div className="relative flex flex-col overflow-hidden rounded-3xl border-2 border-dashed border-primary/40 bg-card p-5 soft-shadow">
      <div className="absolute -left-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
      <div className="absolute -right-3 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full bg-background" />
      <div className="flex items-start justify-between">
        <div>
          <p className="font-display text-2xl font-extrabold text-primary">{c.discount}</p>
          <p className="mt-1 text-sm font-semibold">{c.title}</p>
          <p className="text-xs text-muted-foreground">{c.description}</p>
        </div>
        <Ticket className="h-10 w-10 text-primary/15" />
      </div>
      {c.category && (
        <Badge variant="secondary" className="mt-3 w-fit rounded-full text-[10px]">{c.category}</Badge>
      )}
      {c.progress !== undefined && (
        <div className="mt-3">
          <div className="flex items-center justify-between text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Sparkles className="h-3 w-3 text-amber-500" /> Unlock progress</span>
            <span>{c.progress}%</span>
          </div>
          <Progress value={c.progress} className="mt-1 h-1.5" />
        </div>
      )}
      <div className="mt-4 flex items-center justify-between gap-2">
        <code className="flex-1 truncate rounded-xl border border-dashed border-border bg-muted/40 px-3 py-2 text-sm font-bold tracking-wider">{c.code}</code>
        <Button size="sm" variant="ghost" className="rounded-full" onClick={() => { navigator.clipboard?.writeText(c.code); toast.success("Code copied"); }}>
          <Copy className="h-4 w-4" />
        </Button>
      </div>
      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>Min. order ₹{c.minOrder}</span>
        <span>Exp {formatDate(c.expiresAt)}</span>
      </div>
      {c.status === "available" && (
        <Button size="sm" className="mt-3 w-full rounded-full" onClick={() => toast.success("Coupon applied")}>Apply now</Button>
      )}
    </div>
  );
}

function CouponsPage() {
  const groups = {
    available: coupons.filter((c) => c.status === "available"),
    used: coupons.filter((c) => c.status === "used"),
    expired: coupons.filter((c) => c.status === "expired"),
    category: coupons.filter((c) => !!c.category),
  };

  return (
    <PanelCard title="Coupon center">
      <Tabs defaultValue="available">
        <TabsList className="rounded-full">
          <TabsTrigger value="available" className="rounded-full">Available ({groups.available.length})</TabsTrigger>
          <TabsTrigger value="category" className="rounded-full">Category</TabsTrigger>
          <TabsTrigger value="used" className="rounded-full">Used</TabsTrigger>
          <TabsTrigger value="expired" className="rounded-full">Expired</TabsTrigger>
        </TabsList>
        {(["available","category","used","expired"] as const).map((k) => (
          <TabsContent key={k} value={k} className="mt-5">
            {groups[k].length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">No coupons in this section.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {groups[k].map((c) => <CouponCard key={c.id} c={c} />)}
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </PanelCard>
  );
}