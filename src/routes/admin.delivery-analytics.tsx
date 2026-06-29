import { createFileRoute } from "@tanstack/react-router";
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, CartesianGrid } from "recharts";
import { Clock, CheckCircle2, AlertTriangle, Truck, IndianRupee, Star, Map } from "lucide-react";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { opsKpis, deliveriesTrend, opsDrivers } from "@/features/admin/mock/ops";

export const Route = createFileRoute("/admin/delivery-analytics")({ component: DeliveryAnalyticsPage });

function DeliveryAnalyticsPage() {
  const perDriver = opsDrivers.slice(0, 10).map((d) => ({ name: d.name.split(" ")[0], deliveries: d.deliveriesToday + 8, onTime: d.onTime }));
  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Delivery", to: "/admin/delivery" }, { label: "Analytics" }]}
        title="Delivery analytics"
        description="Operational performance, on-time delivery, costs and driver leaderboard."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Avg delivery" value={`${opsKpis.avgDeliveryMins} min`} icon={Clock} tint="primary" delta={-3.2} />
        <KpiCard label="On-time %" value={`${opsKpis.onTimePct}%`} icon={CheckCircle2} tint="emerald" delta={1.4} />
        <KpiCard label="Failed" value={`${opsKpis.failedPct}%`} icon={AlertTriangle} tint="rose" />
        <KpiCard label="Orders/driver" value={opsKpis.ordersPerDriver} icon={Truck} tint="violet" delta={8.1} />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        <PanelCard title="Deliveries — last 14 days" description="Daily delivered vs failed">
          <div className="h-64">
            <ResponsiveContainer>
              <AreaChart data={deliveriesTrend}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="day" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Area type="monotone" dataKey="delivered" stroke="#22c55e" fill="#22c55e" fillOpacity={0.2} />
                <Area type="monotone" dataKey="failed" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
        <PanelCard title="Deliveries per driver" description="Today">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={perDriver}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="name" fontSize={11} />
                <YAxis fontSize={11} />
                <Tooltip />
                <Bar dataKey="deliveries" fill="#22c55e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PanelCard title="Cost & revenue" description="Per delivery">
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><IndianRupee className="h-4 w-4 text-primary" /> Cost</span><span className="font-display text-base font-extrabold">₹{opsKpis.deliveryCost}</span></div>
            <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><IndianRupee className="h-4 w-4 text-emerald-600" /> Revenue/route</span><span className="font-display text-base font-extrabold">₹{opsKpis.revenuePerRoute.toLocaleString("en-IN")}</span></div>
            <div className="flex items-center justify-between"><span className="inline-flex items-center gap-2"><Star className="h-4 w-4 text-amber-500" /> CSAT</span><span className="font-display text-base font-extrabold">{opsKpis.customerCsat}</span></div>
          </div>
        </PanelCard>
        <PanelCard title="Heatmap" description="Order density by hour × zone">
          <div className="grid grid-cols-12 gap-0.5">
            {Array.from({ length: 96 }).map((_, i) => {
              const intensity = Math.abs(Math.sin(i / 4)) * 0.9 + 0.1;
              return <div key={i} className="aspect-square rounded-sm" style={{ background: `rgba(34,197,94,${intensity})` }} />;
            })}
          </div>
          <p className="mt-3 text-[11px] text-muted-foreground">Map placeholder · integrate Mapbox for live geo data</p>
        </PanelCard>
        <PanelCard title="Zone performance" description="Top 5 by volume">
          <ul className="space-y-2 text-sm">
            {["Bandra West","Andheri East","Powai","Worli","Lower Parel"].map((z, i) => (
              <li key={z} className="flex items-center justify-between rounded-xl bg-muted/40 p-2">
                <span className="inline-flex items-center gap-2"><Map className="h-3.5 w-3.5 text-primary" /> {z}</span>
                <span className="font-semibold">{(420 - i * 38).toLocaleString()} orders</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>
    </div>
  );
}
