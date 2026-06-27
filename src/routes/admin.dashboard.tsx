import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  IndianRupee,
  ShoppingCart,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  Activity,
  CheckCircle2,
  Star,
  ArrowUpRight,
  Truck,
  Calendar,
  Megaphone,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  KpiCard,
  PageHeader,
  PanelCard,
  StatusPill,
  DataTable,
} from "@/features/admin/components/widgets";
import {
  adminOrders,
  adminCustomers,
  adminActivities,
  adminProducts,
  revenueSeries,
  weeklySales,
  categoryMix,
  tasks,
  announcements,
  goals,
} from "@/features/admin/mock/data";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/dashboard")({
  component: DashboardPage,
});

const PIE_COLORS = ["#22C55E", "#FACC15", "#0EA5E9", "#A78BFA", "#F97316", "#F43F5E"];

function DashboardPage() {
  const recentOrders = adminOrders.slice(0, 6);
  const recentCustomers = adminCustomers.slice(0, 5);
  const lowStock = adminProducts.filter((p) => p.stock <= p.reorder).slice(0, 5);

  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Dashboard" }]}
        title="Good morning, Aanya 👋"
        description="Here's how DEPART Mumbai is performing today."
        actions={
          <>
            <Button variant="outline" className="rounded-xl">
              <Calendar className="mr-2 h-4 w-4" /> Last 30 days
            </Button>
            <Button className="rounded-xl">
              <Plus className="mr-2 h-4 w-4" /> New order
            </Button>
          </>
        }
      />

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Today's revenue" value={inr(184320)} delta={12.4} icon={IndianRupee} tint="primary" delay={0.02} sparkline={[12,14,11,18,21,17,24,28,26,31]} />
        <KpiCard label="Today's orders" value="312" delta={6.1} icon={ShoppingCart} tint="sky" delay={0.06} sparkline={[8,10,12,11,14,13,15,18,17,19]} />
        <KpiCard label="Today's profit" value={inr(46180)} delta={-2.1} icon={TrendingUp} tint="amber" delay={0.1} sparkline={[20,22,19,18,21,20,17,16,18,17]} />
        <KpiCard label="New customers" value="48" delta={9.8} icon={Users} tint="violet" delay={0.14} sparkline={[3,4,5,7,6,8,10,9,11,12]} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Revenue overview" description="Last 12 months" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.45} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`} />
                <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} formatter={(v: number) => inr(v)} />
                <Area type="monotone" dataKey="revenue" stroke="#22C55E" strokeWidth={2.5} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="Category mix" description="Share of sales">
          <div className="h-72">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={categoryMix} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={88} paddingAngle={2}>
                  {categoryMix.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Weekly sales" description="This week vs last">
          <div className="h-56">
            <ResponsiveContainer>
              <BarChart data={weeklySales}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="Revenue goal" description="June target">
          <div className="space-y-4">
            {goals.map((g) => {
              const pct = Math.min(100, Math.round((g.value / g.target) * 100));
              return (
                <div key={g.label}>
                  <div className="mb-1 flex items-baseline justify-between">
                    <span className="text-sm font-medium">{g.label}</span>
                    <span className="text-xs text-muted-foreground">{pct}%</span>
                  </div>
                  <Progress value={pct} className="h-2" />
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {typeof g.value === "number" && g.label.toLowerCase().includes("revenue")
                      ? `${inr(g.value)} of ${inr(g.target)}`
                      : `${g.value} of ${g.target}`}
                  </p>
                </div>
              );
            })}
          </div>
        </PanelCard>

        <PanelCard
          title="System health"
          description="All services nominal"
          action={<span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-600"><CheckCircle2 className="h-3 w-3" /> Operational</span>}
        >
          <ul className="space-y-3 text-sm">
            {[
              { name: "Storefront", uptime: 99.99 },
              { name: "Payments", uptime: 99.97 },
              { name: "Fulfillment", uptime: 99.92 },
              { name: "Search", uptime: 99.89 },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-emerald-500" />{s.name}</span>
                <span className="text-xs text-muted-foreground">{s.uptime}% uptime</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard
          title="Recent orders"
          description="Latest activity across all channels"
          action={<Link to="/admin/orders" className="text-xs font-semibold text-primary hover:underline">View all <ArrowUpRight className="ml-0.5 inline h-3 w-3" /></Link>}
          className="xl:col-span-2"
        >
          <DataTable
            rows={recentOrders}
            columns={[
              { key: "id", label: "Order", render: (r) => <span className="font-mono text-xs font-semibold">{r.id}</span> },
              { key: "customer", label: "Customer" },
              { key: "items", label: "Items", className: "text-center" },
              { key: "total", label: "Total", render: (r) => <span className="font-semibold">{inr(r.total)}</span> },
              { key: "status", label: "Status", render: (r) => <StatusPill status={r.status} /> },
            ]}
          />
        </PanelCard>

        <PanelCard title="Inventory alerts" description="At or below reorder point">
          <ul className="space-y-2">
            {lowStock.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-lg">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.sku} · {p.vendor}</p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-[11px] font-semibold text-rose-600">
                  <AlertTriangle className="h-3 w-3" /> {p.stock}
                </span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Top selling products" description="This week">
          <ul className="space-y-3">
            {adminProducts.slice(0, 5).map((p, i) => (
              <li key={p.id} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">{p.category}</p>
                </div>
                <span className="text-sm font-semibold">{inr(p.price * (32 - i * 4))}</span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Recent customers" description="New this week">
          <ul className="space-y-3">
            {recentCustomers.map((c) => (
              <li key={c.id} className="flex items-center gap-3">
                <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">
                  {c.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{c.name}</p>
                  <p className="text-[11px] text-muted-foreground">{c.city} · {c.tier}</p>
                </div>
                <span className="text-xs font-semibold text-muted-foreground">{c.orders} orders</span>
              </li>
            ))}
          </ul>
        </PanelCard>

        <PanelCard title="Latest reviews">
          <ul className="space-y-3">
            {[
              { who: "Diya P.", stars: 5, text: "Burrata arrived in 9 minutes — better than my neighbourhood store!" },
              { who: "Arjun V.", stars: 4, text: "Loved the cold brew, would love larger sizes." },
              { who: "Tara B.", stars: 5, text: "DEPART has the freshest tomatoes I've found in Bandra." },
            ].map((r, i) => (
              <li key={i} className="rounded-2xl border border-border/60 p-3">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: r.stars }).map((_, j) => <Star key={j} className="h-3.5 w-3.5 fill-current" />)}
                </div>
                <p className="mt-1 text-sm">{r.text}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{r.who}</p>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Activity" description="Across your workspace" className="xl:col-span-2">
          <ol className="relative space-y-4 border-l border-border/60 pl-5">
            {adminActivities.map((a, i) => (
              <motion.li
                key={a.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.04 }}
                className="relative"
              >
                <span className="absolute -left-[26px] top-1.5 grid h-4 w-4 place-items-center rounded-full bg-primary/15 text-primary">
                  <Activity className="h-2.5 w-2.5" />
                </span>
                <p className="text-sm"><span className="font-semibold">{a.actor}</span> {a.action} <span className="font-semibold">{a.target}</span></p>
                <p className="text-[11px] text-muted-foreground">{a.time}</p>
              </motion.li>
            ))}
          </ol>
        </PanelCard>

        <div className="space-y-4">
          <PanelCard title="Tasks" action={<Button variant="ghost" size="sm" className="h-7 text-xs">Add</Button>}>
            <ul className="space-y-2">
              {tasks.map((t) => (
                <li key={t.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-2.5">
                  <input type="checkbox" defaultChecked={t.done} className="h-4 w-4 rounded border-border accent-[color:var(--color-primary)]" />
                  <div className="min-w-0 flex-1">
                    <p className={`truncate text-sm ${t.done ? "text-muted-foreground line-through" : "font-medium"}`}>{t.title}</p>
                    <p className="text-[11px] text-muted-foreground">Due {t.due}</p>
                  </div>
                </li>
              ))}
            </ul>
          </PanelCard>

          <PanelCard title="Announcements" action={<Megaphone className="h-4 w-4 text-muted-foreground" />}>
            <ul className="space-y-3">
              {announcements.map((a) => (
                <li key={a.id} className="rounded-xl border border-border/60 p-3">
                  <p className="text-sm font-semibold">{a.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.body}</p>
                  <p className="mt-1 text-[11px] text-muted-foreground">{a.date}</p>
                </li>
              ))}
            </ul>
          </PanelCard>
        </div>
      </section>

      <section className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "Add product", icon: Package, to: "/admin/products" },
          { label: "Create order", icon: ShoppingCart, to: "/admin/orders" },
          { label: "Invite teammate", icon: Users, to: "/admin/users" },
          { label: "Add supplier", icon: Truck, to: "/admin/suppliers" },
        ].map((q) => (
          <Link
            key={q.label}
            to={q.to}
            className="group flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow transition-shadow hover:lift-shadow"
          >
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <q.icon className="h-5 w-5" />
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold">{q.label}</p>
              <p className="text-[11px] text-muted-foreground">Quick action</p>
            </div>
            <ArrowUpRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        ))}
      </section>
    </div>
  );
}