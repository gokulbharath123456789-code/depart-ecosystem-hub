import { createFileRoute } from "@tanstack/react-router";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Sparkles, TrendingUp, TrendingDown, Brain, ShoppingCart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { ForecastCard } from "@/features/admin/components/erp-widgets";
import { forecastSeries, fastMovers, slowMovers, restockSuggestions, seasonalTrends } from "@/features/admin/mock/erp";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/forecast")({ component: ForecastPage });

function ForecastPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Operations" }, { label: "Forecast" }]}
        title="Inventory forecast"
        description="AI-assisted demand planning, stockout prediction and restock suggestions."
        actions={<Button className="rounded-xl"><Brain className="mr-2 h-4 w-4" /> Re-train model</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <ForecastCard title="Predicted stockouts (14d)" value="18 SKUs" delta="+3 vs last week" positive={false} hint="Take action within 48h to avoid lost sales" />
        <ForecastCard title="Demand growth" value="+12.4%" delta="WoW" hint="Driven by Monsoon Picks campaign" />
        <ForecastCard title="Forecast accuracy" value="94.2%" delta="+1.1pp" hint="Last 30 days against actuals" />
        <ForecastCard title="Procurement suggested" value={inr(412000)} delta="−6.2% spend" hint="Optimized PO bundle ready" />
      </section>

      <PanelCard title="Demand vs forecast" description="Next 12 weeks" className="mt-6">
        <div className="h-72">
          <ResponsiveContainer>
            <AreaChart data={forecastSeries} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#22C55E" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#22C55E" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="dm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FACC15" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#FACC15" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="var(--color-muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid var(--color-border)", background: "var(--color-card)" }} />
              <Area type="monotone" dataKey="forecast" stroke="#22C55E" strokeWidth={2.5} fill="url(#fc)" />
              <Area type="monotone" dataKey="demand" stroke="#FACC15" strokeWidth={2} fill="url(#dm)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </PanelCard>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PanelCard title="Stock projection" description="Available stock vs predicted demand">
          <div className="h-64">
            <ResponsiveContainer>
              <LineChart data={forecastSeries}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="week" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="stock" stroke="#0EA5E9" strokeWidth={2.5} dot={false} />
                <Line type="monotone" dataKey="demand" stroke="#F43F5E" strokeWidth={2} strokeDasharray="4 4" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
        <PanelCard title="Seasonal trend" description="Demand by month (last 12 months)">
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={seasonalTrends}>
                <CartesianGrid stroke="var(--color-border)" strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <YAxis stroke="var(--color-muted-foreground)" fontSize={11} axisLine={false} tickLine={false} />
                <Tooltip />
                <Bar dataKey="demand" fill="#A78BFA" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PanelCard>
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 xl:grid-cols-2">
        <PanelCard title="Fast movers" description="Top velocity this week">
          <ul className="space-y-3">
            {fastMovers.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-[11px] text-muted-foreground">{p.velocity} units/day</p></div>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-600"><TrendingUp className="h-3 w-3" /> +{p.trend.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </PanelCard>
        <PanelCard title="Slow movers" description="Consider promotion or clearance">
          <ul className="space-y-3">
            {slowMovers.map((p) => (
              <li key={p.id} className="flex items-center gap-3 rounded-xl border border-border/60 p-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                <div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold">{p.name}</p><p className="text-[11px] text-muted-foreground">{p.velocity} units/day</p></div>
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-600"><TrendingDown className="h-3 w-3" /> {p.trend.toFixed(1)}%</span>
              </li>
            ))}
          </ul>
        </PanelCard>
      </section>

      <PanelCard
        title="Restock suggestions"
        description="AI-recommended POs ranked by urgency"
        action={<Button size="sm" className="rounded-xl" onClick={() => toast.success("Bundle PO created (demo)")}><Sparkles className="mr-1.5 h-3.5 w-3.5" /> Bundle into PO</Button>}
        className="mt-6"
      >
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-4">
          {restockSuggestions.map((p) => (
            <div key={p.id} className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-muted text-base">{p.emoji}</span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">Stockout in {p.daysToStockout}d</p>
                </div>
              </div>
              <div className="mt-3"><Progress value={p.confidence} className="h-1.5" /><p className="mt-1 flex justify-between text-[10px] text-muted-foreground"><span>Confidence</span><span>{p.confidence}%</span></p></div>
              <div className="mt-3 flex items-center justify-between border-t border-border/60 pt-3">
                <div><p className="text-[10px] text-muted-foreground">Order qty</p><p className="text-sm font-bold">{p.suggestQty} units</p></div>
                <Button size="sm" variant="outline" className="h-7 rounded-lg text-xs"><ShoppingCart className="mr-1 h-3 w-3" /> Add</Button>
              </div>
            </div>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}