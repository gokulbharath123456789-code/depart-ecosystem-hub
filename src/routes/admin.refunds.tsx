import { createFileRoute } from "@tanstack/react-router";
import { IndianRupee, Wallet, CreditCard, Gift } from "lucide-react";
import { format } from "date-fns";
import { PageHeader, PanelCard, KpiCard, DataTable } from "@/features/admin/components/widgets";
import { opsReturns } from "@/features/admin/mock/ops";
import { inr } from "@/lib/format";

export const Route = createFileRoute("/admin/refunds")({ component: RefundsPage });

function RefundsPage() {
  const refunds = opsReturns.filter((r) => r.status === "refunded");
  const byMethod = refunds.reduce((acc, r) => { acc[r.refundMethod] = (acc[r.refundMethod] || 0) + r.amount; return acc; }, {} as Record<string, number>);

  return (
    <div className="mx-auto max-w-[1500px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Refunds" }]}
        title="Refunds"
        description="All issued refunds, by method and channel."
      />

      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Total refunded" value={inr(refunds.reduce((s, r) => s + r.amount, 0))} icon={IndianRupee} tint="primary" />
        <KpiCard label="Original payment" value={inr(byMethod["original"] ?? 0)} icon={CreditCard} tint="sky" />
        <KpiCard label="Wallet" value={inr(byMethod["wallet"] ?? 0)} icon={Wallet} tint="amber" />
        <KpiCard label="Store credit" value={inr(byMethod["store-credit"] ?? 0)} icon={Gift} tint="violet" />
      </section>

      <PanelCard title="Refund history" description={`${refunds.length} refunds`} className="mt-6">
        <DataTable
          rows={refunds}
          columns={[
            { key: "id", label: "Refund", render: (r) => <span className="font-mono text-xs font-semibold">{r.id}</span> },
            { key: "orderId", label: "Order", render: (r) => <span className="font-mono text-xs">{r.orderId}</span> },
            { key: "customer", label: "Customer" },
            { key: "product", label: "Product" },
            { key: "refundMethod", label: "Method", render: (r) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold capitalize">{r.refundMethod.replace("-", " ")}</span> },
            { key: "amount", label: "Amount", render: (r) => <span className="font-semibold">{inr(r.amount)}</span> },
            { key: "createdAt", label: "When", render: (r) => format(new Date(r.createdAt), "d MMM, HH:mm") },
          ]}
        />
      </PanelCard>
    </div>
  );
}
