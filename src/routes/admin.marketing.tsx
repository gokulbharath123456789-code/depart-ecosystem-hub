import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Megaphone, Plus, Mail, MessageSquare, Bell, Tag, Layers, Beaker, IndianRupee } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { CampaignCard } from "@/features/admin/components/ops-widgets";
import { opsCampaigns, opsCoupons } from "@/features/admin/mock/ops";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/marketing")({ component: MarketingPage });

function MarketingPage() {
  const [tab, setTab] = useState("campaigns");
  const reach = opsCampaigns.reduce((s, c) => s + c.reach, 0);
  const conv = opsCampaigns.reduce((s, c) => s + c.conversions, 0);
  const rev = opsCampaigns.reduce((s, c) => s + c.revenue, 0);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Marketing" }]}
        title="Marketing center"
        description="Coupons, flash sales, combo offers, banners, push, SMS, email and WhatsApp."
        actions={<Button className="rounded-xl" onClick={() => toast.success("New campaign draft")}><Plus className="mr-2 h-4 w-4" /> New campaign</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Active campaigns" value={opsCampaigns.filter((c) => c.status === "live").length} icon={Megaphone} tint="primary" />
        <KpiCard label="Reach" value={reach.toLocaleString()} icon={Bell} tint="sky" />
        <KpiCard label="Conversions" value={conv.toLocaleString()} icon={Layers} tint="amber" />
        <KpiCard label="Revenue" value={inr(rev)} icon={IndianRupee} tint="emerald" />
      </section>

      <Tabs value={tab} onValueChange={setTab} className="mt-6">
        <TabsList className="rounded-xl">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="ab">A/B tests</TabsTrigger>
        </TabsList>
      </Tabs>

      {tab === "campaigns" && (
        <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {opsCampaigns.map((c) => <CampaignCard key={c.id} c={c} />)}
        </div>
      )}

      {tab === "coupons" && (
        <PanelCard title="Coupon codes" description={`${opsCoupons.length} total`} className="mt-4">
          <DataTable
            rows={opsCoupons}
            columns={[
              { key: "code", label: "Code", render: (c) => <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-xs font-bold">{c.code}</span> },
              { key: "type", label: "Type" },
              { key: "value", label: "Value", render: (c) => c.type === "%" ? `${c.value}%` : c.type === "₹" ? inr(c.value) : c.type },
              { key: "minOrder", label: "Min order", render: (c) => c.minOrder ? inr(c.minOrder) : "—" },
              { key: "usage", label: "Usage", render: (c) => <span>{c.usage.toLocaleString()} / {c.cap.toLocaleString()}</span> },
              { key: "status", label: "Status", render: (c) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold capitalize">{c.status}</span> },
            ]}
          />
        </PanelCard>
      )}

      {tab === "channels" && (
        <section className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Bell, label: "Push", desc: "Mobile + web push" },
            { icon: MessageSquare, label: "SMS", desc: "Transactional & promo" },
            { icon: Mail, label: "Email", desc: "Drag-and-drop templates" },
            { icon: MessageSquare, label: "WhatsApp", desc: "Approved templates" },
          ].map((ch) => (
            <PanelCard key={ch.label} title={ch.label} description={ch.desc}>
              <p className="text-xs text-muted-foreground">Provider not connected</p>
              <Button size="sm" className="mt-3 rounded-xl">Connect</Button>
            </PanelCard>
          ))}
        </section>
      )}

      {tab === "audience" && (
        <PanelCard title="Audience segments" className="mt-4">
          <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { name: "All customers", size: "10,482" },
              { name: "VIP & Platinum", size: "812" },
              { name: "Cart abandoners (7d)", size: "1,204" },
              { name: "New users (30d)", size: "684" },
              { name: "At risk", size: "318" },
              { name: "Birthday this month", size: "112" },
            ].map((s) => (
              <li key={s.name} className="flex items-center justify-between rounded-2xl border border-border/60 bg-card p-4 soft-shadow">
                <div><p className="text-sm font-bold">{s.name}</p><p className="text-[11px] text-muted-foreground">{s.size} contacts</p></div>
                <Button size="sm" variant="outline" className="rounded-xl">Target</Button>
              </li>
            ))}
          </ul>
        </PanelCard>
      )}

      {tab === "ab" && (
        <PanelCard title="A/B tests" className="mt-4">
          <div className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-8 text-center">
            <Beaker className="mx-auto mb-2 h-8 w-8 text-primary" />
            <p className="font-bold">Run experiments on copy, design, and pricing</p>
            <p className="mt-1 text-xs text-muted-foreground">Statistical significance, traffic split and winner promotion. Placeholder UI.</p>
            <Button className="mt-3 rounded-xl">Start a test</Button>
          </div>
        </PanelCard>
      )}
    </div>
  );
}
