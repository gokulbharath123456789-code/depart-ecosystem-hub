import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  CheckCircle2,
  Heart,
  Wallet,
  Sparkles,
  Ticket,
  MapPin,
  Bell,
  ArrowRight,
  Crown,
  Plus,
  RotateCcw,
  LifeBuoy,
  Package,
} from "lucide-react";
import { StatCard, PanelCard } from "@/components/dashboard/cards";
import {
  orders,
  user,
  loyalty,
  recentlyViewed,
  recommended,
  addresses,
  coupons,
  notifications,
  statusColor,
  formatDate,
} from "@/mock/account";
import { useWishlist } from "@/store/wishlist";
import { inr } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ProductRail } from "@/components/storefront/ProductRail";
import { ProductMedia } from "@/components/storefront/ProductMedia";

export const Route = createFileRoute("/account/")({
  component: AccountHome,
});

function AccountHome() {
  const wish = useWishlist((s) => s.ids.length);
  const completed = orders.filter((o) => o.status === "Delivered").length;
  const recent = orders.slice(0, 4);
  const availableCoupons = coupons.filter((c) => c.status === "available").slice(0, 3);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-primary/15 via-card to-accent/10 p-6 soft-shadow"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-primary">Welcome back</p>
            <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">
              Hi, {user.name.split(" ")[0]} 👋
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              You've saved <span className="font-semibold text-foreground">{inr(2340)}</span> this month
              with SREE SUPER MART.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild className="rounded-full">
              <Link to="/shop">
                <ShoppingBag className="mr-2 h-4 w-4" /> Continue shopping
              </Link>
            </Button>
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/account/orders">Track orders</Link>
            </Button>
          </div>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} delay={0.02} />
        <StatCard label="Completed" value={completed} icon={CheckCircle2} tint="primary" delay={0.05} />
        <StatCard label="Wishlist" value={wish} icon={Heart} tint="rose" delay={0.08} />
        <StatCard label="Wallet" value={inr(user.wallet)} icon={Wallet} tint="sky" delay={0.11} />
        <StatCard label="Points" value={user.points.toLocaleString()} icon={Sparkles} tint="amber" delay={0.14} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile / Membership */}
        <div className="space-y-6">
          <PanelCard title="Profile">
            <div className="flex items-center gap-3">
              <div className="grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                {user.avatar}
              </div>
              <div className="min-w-0">
                <p className="font-semibold">{user.name}</p>
                <p className="truncate text-xs text-muted-foreground">{user.email}</p>
                <p className="text-xs text-muted-foreground">{user.phone}</p>
              </div>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-4 w-full rounded-full">
              <Link to="/account/settings">Edit profile</Link>
            </Button>
          </PanelCard>

          <PanelCard title="Membership">
            <div className="rounded-2xl bg-gradient-to-br from-amber-400/20 via-amber-200/30 to-amber-100 p-4 dark:from-amber-500/20 dark:via-amber-700/20 dark:to-amber-900/20">
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-amber-600" />
                <span className="font-display text-lg font-bold">SREE SUPER MART {loyalty.tier}</span>
              </div>
              <p className="mt-1 text-xs text-foreground/70">
                {loyalty.pointsToNext} pts to {loyalty.nextTier}
              </p>
              <Progress
                value={((user.points % 6000) / 6000) * 100}
                className="mt-3 h-2"
              />
              <ul className="mt-3 space-y-1 text-xs text-foreground/80">
                {loyalty.perks.slice(0, 3).map((p) => (
                  <li key={p}>· {p}</li>
                ))}
              </ul>
            </div>
          </PanelCard>

          <PanelCard
            title="Default Address"
            action={
              <Link to="/account/addresses" className="text-xs font-medium text-primary hover:underline">
                Manage
              </Link>
            }
          >
            {addresses
              .filter((a) => a.isDefault)
              .map((a) => (
                <div key={a.id} className="rounded-2xl bg-muted/40 p-3">
                  <div className="flex items-center gap-2 text-xs font-semibold">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    {a.label}
                  </div>
                  <p className="mt-1 text-sm">{a.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {a.line1}, {a.line2 ? a.line2 + ", " : ""}
                    {a.city} {a.pincode}
                  </p>
                </div>
              ))}
          </PanelCard>
        </div>

        {/* Middle / Right */}
        <div className="space-y-6 lg:col-span-2">
          <PanelCard
            title="Recent Orders"
            action={
              <Link
                to="/account/orders"
                className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            }
          >
            <ul className="divide-y divide-border/60">
              {recent.map((o) => (
                <li key={o.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                  <div className="flex -space-x-2">
                    {o.items.slice(0, 3).map((it, idx) => (
                      <div
                        key={idx}
                        className="ring-2 ring-card"
                      >
                        <ProductMedia
                          emoji={it.product.emoji}
                          gradient={it.product.gradient}
                          size="sm"
                          className="h-10 w-10 rounded-full"
                        />
                      </div>
                    ))}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="truncate text-sm font-semibold">{o.number}</p>
                      <Badge className={statusColor(o.status)} variant="secondary">
                        {o.status}
                      </Badge>
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {o.items.length} item{o.items.length > 1 ? "s" : ""} · {formatDate(o.placedAt)}
                    </p>
                  </div>
                  <p className="hidden text-sm font-semibold sm:block">{inr(o.total)}</p>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Quick Actions">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { to: "/account/orders", label: "Reorder", icon: Package },
                { to: "/account/returns", label: "Return", icon: RotateCcw },
                { to: "/account/wallet", label: "Top-up", icon: Plus },
                { to: "/account/support", label: "Support", icon: LifeBuoy },
              ].map((q) => (
                <Link
                  key={q.label}
                  to={q.to as "/account/orders"}
                  className="group flex flex-col items-start gap-3 rounded-2xl border border-border/60 bg-muted/30 p-4 transition hover:border-primary/60 hover:bg-primary/5"
                >
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                    <q.icon className="h-4 w-4" />
                  </span>
                  <span className="text-sm font-semibold">{q.label}</span>
                </Link>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Coupons for you"
            action={
              <Link to="/account/coupons" className="text-xs font-medium text-primary hover:underline">
                See all
              </Link>
            }
          >
            <div className="grid gap-3 sm:grid-cols-3">
              {availableCoupons.map((c) => (
                <div
                  key={c.id}
                  className="relative overflow-hidden rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-4"
                >
                  <Ticket className="absolute -right-3 -top-3 h-12 w-12 text-primary/15" />
                  <p className="text-xs font-bold text-primary">{c.discount}</p>
                  <p className="mt-1 text-sm font-semibold">{c.title}</p>
                  <p className="text-[11px] text-muted-foreground">{c.description}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <code className="rounded bg-background px-2 py-0.5 text-[11px] font-bold">{c.code}</code>
                    <Button size="sm" variant="ghost" className="h-7 rounded-full px-2 text-xs">
                      Apply
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </PanelCard>

          <PanelCard
            title="Recent Notifications"
            action={
              <Link to="/account/notifications" className="text-xs font-medium text-primary hover:underline">
                Open inbox
              </Link>
            }
          >
            <ul className="divide-y divide-border/60">
              {notifications.slice(0, 4).map((n) => (
                <li key={n.id} className="flex items-start gap-3 py-2.5 first:pt-0 last:pb-0">
                  <Bell className="mt-0.5 h-4 w-4 text-muted-foreground" />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <p className="line-clamp-1 text-xs text-muted-foreground">{n.body}</p>
                  </div>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </div>

      {recentlyViewed.length > 0 && (
        <PanelCard title="Recently viewed">
          <ProductRail products={recentlyViewed} />
        </PanelCard>
      )}
      <PanelCard title="Recommended for you">
        <ProductRail products={recommended} />
      </PanelCard>
    </div>
  );
}