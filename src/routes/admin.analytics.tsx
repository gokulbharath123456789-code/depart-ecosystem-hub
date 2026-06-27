import { createFileRoute } from "@tanstack/react-router";
import {
  Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { revenueSeries, weeklySales, conversionFunnel } from "@/features/admin/mock/data";
import { Activity, TrendingUp, Users, IndianRupee } from "lucide-react";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsPage,
});

function AnalyticsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Analytics" }]}
        title="Analytics"
        description="Live performance across revenue, conversion and retention."
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="MRR" value={inr(1184000)} delta={9.6} icon={IndianRupee} tint="primary" />
        <KpiCard label="Conversion" value="5.2%" delta={0.4} icon={TrendingUp} tint="sky" />
        <KpiCard label="AOV" value={inr(842)} delta={2.1} icon={Activity} tint="amber" />
        <KpiCard label="Active users" value="18.4k" delta={3.8} icon={Users} tint="violet" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Revenue & profit" className="xl:col-span-2">
          <div className="h-72">
            <ResponsiveContainer>
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="a1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="a2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#FACC15" stopOpacity={0.4} />
                    <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v/1000).toFixed(0)}k`} />
                <Tooltip />
                <Area type="monotone" dataKey="revenue" stroke="#22C55E" fill="url(#a1)" />
                <Area type="monotone" dataKey="profit" stroke="#FACC15" fill="url(#a2)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>

        <PanelCard title="Sessions">
          <div className="h-72">
            <ResponsiveContainer>
              <LineChart data={revenueSeries}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line dataKey="orders" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-3">
        <PanelCard title="Conversion funnel" className="xl:col-span-2">
          <ul className="space-y-3">
            {conversionFunnel.map((s, i) => {
              const max = conversionFunnel[0].value;
              const pct = Math.round((s.value / max) * 100);
              return (
                <li key={s.stage}>
                  <div className="mb-1 flex items-baseline justify-between text-sm">
                    <span className="font-semibold">{s.stage}</span>
                    <span className="text-muted-foreground">{s.value.toLocaleString()} · {pct}%</span>
                  </div>
                  <div className="h-3 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-amber-400" style={{ width: `${pct}%`, opacity: 1 - i * 0.12 }} />
                  </div>
                </li>
              );
            })}
          </ul>
        </PanelCard>
        <PanelCard title="Weekly sales">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={weeklySales}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="sales" fill="#22C55E" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </section>
    </div>
  );
}