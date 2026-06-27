import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { Download, FileBarChart2, FileSpreadsheet, FileText } from "lucide-react";

export const Route = createFileRoute("/admin/reports")({
  component: ReportsPage,
});

const reports = [
  { id: "r1", title: "Sales by category", desc: "Gross revenue, returns and net by category.", icon: FileBarChart2 },
  { id: "r2", title: "Inventory snapshot", desc: "Stock value across warehouses, by SKU.", icon: FileSpreadsheet },
  { id: "r3", title: "Customer cohorts", desc: "Repeat rate and revenue by acquisition month.", icon: FileText },
  { id: "r4", title: "GST summary (B2C)", desc: "Filed-ready GST output for the current period.", icon: FileText },
  { id: "r5", title: "Payouts ledger", desc: "Settlements and bank reconciliation.", icon: FileSpreadsheet },
  { id: "r6", title: "Marketing attribution", desc: "Channel-level ROAS and assisted revenue.", icon: FileBarChart2 },
];

function ReportsPage() {
  return (
    <div className="mx-auto max-w-[1400px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Reports" }]}
        title="Reports"
        description="Generate, schedule and export business reports."
        actions={<Button className="rounded-xl"><Download className="mr-2 h-4 w-4" /> Custom report</Button>}
      />
      <PanelCard title="Saved reports">
        <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {reports.map((r) => (
            <li key={r.id} className="flex items-start gap-3 rounded-2xl border border-border/60 bg-card p-4 soft-shadow transition-shadow hover:lift-shadow">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary"><r.icon className="h-5 w-5" /></span>
              <div className="flex-1">
                <p className="text-sm font-semibold">{r.title}</p>
                <p className="text-xs text-muted-foreground">{r.desc}</p>
                <div className="mt-2 flex gap-2">
                  <Button variant="outline" size="sm" className="h-8 rounded-lg text-xs">Open</Button>
                  <Button variant="ghost" size="sm" className="h-8 rounded-lg text-xs"><Download className="mr-1 h-3 w-3" /> CSV</Button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}