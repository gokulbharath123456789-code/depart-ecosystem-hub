import { createFileRoute } from "@tanstack/react-router";
import { Sparkles, Gift, Cake, Heart, Share2, IndianRupee, CheckCircle2, Users } from "lucide-react";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { LoyaltyCard } from "@/features/admin/components/ops-widgets";
import { opsCustomers, loyaltyTiers } from "@/features/admin/mock/ops";
import { cn } from "@/lib/utils";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/loyalty")({ component: LoyaltyPage });

function LoyaltyPage() {
  const counts = { Silver: 0, Gold: 0, Platinum: 0 } as Record<string, number>;
  opsCustomers.forEach((c) => (counts[c.tier] += 1));
  const totalPoints = opsCustomers.reduce((s, c) => s + c.points, 0);
  const top = [...opsCustomers].sort((a, b) => b.ltv - a.ltv).slice(0, 8);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Loyalty" }]}
        title="Loyalty program"
        description="Silver, Gold, Platinum — rewards, birthdays, referrals and cashback."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Members" value={opsCustomers.length} icon={Users} tint="primary" />
        <KpiCard label="Points earned" value={totalPoints.toLocaleString()} icon={Sparkles} tint="amber" />
        <KpiCard label="Redemptions" value="12,481" icon={Gift} tint="emerald" />
        <KpiCard label="Cashback paid" value={inr(284000)} icon={IndianRupee} tint="violet" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {loyaltyTiers.map((t) => (
          <div key={t.name} className={cn("relative overflow-hidden rounded-3xl bg-gradient-to-br p-5 text-white soft-shadow", t.color)}>
            <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/15 blur-2xl" />
            <p className="relative text-xs uppercase tracking-widest opacity-90">{t.name}</p>
            <p className="relative font-display text-3xl font-extrabold tracking-tight">{counts[t.name]}</p>
            <p className="relative text-xs opacity-90">members · {t.min === 0 ? "Entry tier" : `min spend ${inr(t.min)}`}</p>
            <ul className="relative mt-4 space-y-1 text-xs">
              {t.perks.map((p) => <li key={p} className="flex items-center gap-2"><CheckCircle2 className="h-3.5 w-3.5" /> {p}</li>)}
            </ul>
          </div>
        ))}
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-4">
        <Benefit icon={Sparkles} label="Reward points" desc="Earn on every purchase" />
        <Benefit icon={Cake} label="Birthday offers" desc="₹500 voucher on birthday month" />
        <Benefit icon={Heart} label="Anniversary" desc="2× points on member day" />
        <Benefit icon={Share2} label="Referral bonus" desc="₹200 each side" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-3">
        {top.slice(0, 3).map((c) => <LoyaltyCard key={c.id} c={c} />)}
      </section>

      <PanelCard title="Top members" description="Ranked by lifetime value" className="mt-6">
        <DataTable
          rows={top}
          columns={[
            { key: "name", label: "Member" },
            { key: "tier", label: "Tier", render: (c) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">{c.tier}</span> },
            { key: "points", label: "Points", render: (c) => c.points.toLocaleString() },
            { key: "ltv", label: "LTV", render: (c) => <span className="font-semibold">{inr(c.ltv)}</span> },
            { key: "orders", label: "Orders", className: "text-center" },
          ]}
        />
      </PanelCard>
    </div>
  );
}

function Benefit({ icon: Icon, label, desc }: { icon: typeof Sparkles; label: string; desc: string }) {
  return (
    <div className="rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
      <p className="mt-3 text-sm font-bold">{label}</p>
      <p className="text-xs text-muted-foreground">{desc}</p>
    </div>
  );
}
