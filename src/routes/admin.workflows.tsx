import { createFileRoute } from "@tanstack/react-router";
import { Plus, Workflow as WorkflowIcon, Zap, Play, Pause } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader, PanelCard, KpiCard } from "@/features/admin/components/widgets";
import { WorkflowBuilder } from "@/features/admin/components/ops-widgets";
import { opsWorkflows } from "@/features/admin/mock/ops";
import { useOpsStore } from "@/store/ops";

export const Route = createFileRoute("/admin/workflows")({ component: WorkflowsPage });

function WorkflowsPage() {
  const enabled = useOpsStore((s) => s.workflowEnabled);
  const toggle = useOpsStore((s) => s.toggleWorkflow);
  const active = Object.values(enabled).filter(Boolean).length;

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Workflows" }]}
        title="Workflow automation"
        description="No-code triggers, conditions and actions across orders, inventory, delivery and CRM."
        actions={<Button className="rounded-xl" onClick={() => toast.success("Workflow draft created")}><Plus className="mr-2 h-4 w-4" /> New workflow</Button>}
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Workflows" value={opsWorkflows.length} icon={WorkflowIcon} tint="primary" />
        <KpiCard label="Active" value={active} icon={Play} tint="emerald" />
        <KpiCard label="Paused" value={opsWorkflows.length - active} icon={Pause} tint="amber" />
        <KpiCard label="Runs (30d)" value={opsWorkflows.reduce((s, w) => s + w.runs, 0).toLocaleString()} icon={Zap} tint="violet" />
      </section>

      <section className="mt-6 grid grid-cols-1 gap-4">
        {opsWorkflows.map((w) => (
          <div key={w.id} className="relative">
            <div className="absolute right-5 top-5 z-10 flex items-center gap-2">
              <span className="text-xs text-muted-foreground">{enabled[w.id] ? "On" : "Off"}</span>
              <Switch checked={enabled[w.id]} onCheckedChange={() => toggle(w.id)} />
            </div>
            <WorkflowBuilder workflow={w} />
          </div>
        ))}
      </section>

      <PanelCard title="Library" description="Pre-built recipes" className="mt-6">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[
            "Out of stock → Pause campaigns",
            "Order placed → WhatsApp confirmation",
            "Cart abandoned > 1h → Send 10% coupon",
            "VIP customer order → Notify ops",
            "Refund issued → Update accounting",
            "Driver late > 15m → Alert dispatcher",
          ].map((label) => (
            <button key={label} className="rounded-2xl border border-dashed border-border/60 bg-muted/30 p-4 text-left text-sm font-semibold hover:bg-muted/50" onClick={() => toast.success(`Added "${label}" workflow`)}>
              <Plus className="mb-2 h-4 w-4 text-primary" /> {label}
            </button>
          ))}
        </div>
      </PanelCard>
    </div>
  );
}
