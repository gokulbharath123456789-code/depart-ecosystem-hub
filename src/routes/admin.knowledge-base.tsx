import { createFileRoute } from "@tanstack/react-router";
import { BookOpen, Plus, Search, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { kbArticles } from "@/features/admin/mock/ops";

export const Route = createFileRoute("/admin/knowledge-base")({ component: KbPage });

function KbPage() {
  const categories = Array.from(new Set(kbArticles.map((a) => a.category)));
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Support", to: "/admin/tickets" }, { label: "Knowledge base" }]}
        title="Knowledge base"
        description="Help your customers (and your team) find answers fast."
        actions={<Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> New article</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Articles" value={kbArticles.length} icon={BookOpen} tint="primary" />
        <KpiCard label="Categories" value={categories.length} icon={BookOpen} tint="sky" />
        <KpiCard label="Total reads" value={kbArticles.reduce((s, a) => s + a.reads, 0).toLocaleString()} icon={BookOpen} tint="amber" />
        <KpiCard label="Helpful %" value="92%" icon={BookOpen} tint="emerald" />
      </section>

      <div className="mt-6 relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Search articles…" className="h-12 rounded-2xl pl-10 text-base" />
      </div>

      <section className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <PanelCard key={cat} title={cat} description={`${kbArticles.filter((a) => a.category === cat).length} articles`}>
            <ul className="space-y-2">
              {kbArticles.filter((a) => a.category === cat).map((a) => (
                <li key={a.id} className="group flex items-center justify-between rounded-xl border border-border/40 bg-muted/20 p-3 transition-colors hover:bg-muted/40">
                  <div><p className="text-sm font-semibold">{a.title}</p><p className="text-[11px] text-muted-foreground">{a.reads.toLocaleString()} reads</p></div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-1" />
                </li>
              ))}
            </ul>
          </PanelCard>
        ))}
      </section>

      <PanelCard title="FAQ" description="Most asked" className="mt-6">
        <ul className="space-y-2">
          {["What are your delivery hours?", "How do I cancel an order?", "Where is my refund?", "How do loyalty points work?"].map((q) => (
            <li key={q} className="flex items-center justify-between rounded-xl bg-muted/40 p-3 text-sm">{q}<Button size="sm" variant="ghost" className="rounded-lg">Edit</Button></li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}
