import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Printer, Search, QrCode, Loader2 } from "lucide-react";
import { useMyInvoices } from "@/features/orders/hooks";
import { formatDate } from "@/features/orders/status";
import type { InvoiceWithOrder } from "@/features/orders/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/dashboard/DashboardLayout";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { inr } from "@/lib/format";
import { toast } from "sonner";

export const Route = createFileRoute("/account/invoices")({
  component: InvoicesPage,
});

function isRefunded(inv: InvoiceWithOrder) {
  const s = inv.order?.status;
  return s === "returned" || s === "refunded" || s === "cancelled";
}

function InvoicesPage() {
  const { data, isLoading, error } = useMyInvoices();
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [active, setActive] = useState<InvoiceWithOrder | null>(null);

  const list = useMemo(() => {
    let arr = (data ?? []).filter((i) =>
      i.invoice_number.toLowerCase().includes(q.toLowerCase()),
    );
    if (status === "Paid") arr = arr.filter((i) => !isRefunded(i));
    if (status === "Refunded") arr = arr.filter((i) => isRefunded(i));
    if (sort === "amount") arr = [...arr].sort((a, b) => Number(b.amount) - Number(a.amount));
    else arr = [...arr].sort((a, b) => +new Date(b.issued_at) - +new Date(a.issued_at));
    return arr;
  }, [data, q, status, sort]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading invoices…
      </div>
    );
  }
  if (error) {
    return (
      <EmptyState
        icon={FileText}
        title="Couldn't load invoices"
        description={error instanceof Error ? error.message : "Please try again."}
      />
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-border/60 bg-card p-3 soft-shadow">
        <div className="relative flex-1 min-w-56">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search invoice #" className="h-9 rounded-full pl-9" />
        </div>
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="h-9 w-36 rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Paid">Paid</SelectItem>
            <SelectItem value="Refunded">Refunded</SelectItem>
          </SelectContent>
        </Select>
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="h-9 w-36 rounded-full"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="recent">Most recent</SelectItem>
            <SelectItem value="amount">Amount</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {list.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No invoices yet"
          description="Invoices for your orders will appear here after checkout."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {list.map((inv) => {
            const refunded = isRefunded(inv);
            return (
              <div key={inv.id} className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
                <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-semibold">{inv.invoice_number}</p>
                    <Badge variant="secondary" className={`rounded-full text-[10px] ${refunded ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                      {refunded ? "Refunded" : "Paid"}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {formatDate(inv.issued_at)} · Tax {inr(Number(inv.tax_amount))}
                    {inv.order?.order_number ? ` · ${inv.order.order_number}` : ""}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-display text-base font-bold">{inr(Number(inv.amount))}</p>
                  <div className="mt-1 flex gap-1">
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setActive(inv)}><FileText className="h-4 w-4" /></Button>
                    {inv.pdf_url ? (
                      <a href={inv.pdf_url} target="_blank" rel="noreferrer" className="inline-flex h-8 w-8 items-center justify-center rounded-full hover:bg-muted">
                        <Download className="h-4 w-4" />
                      </a>
                    ) : (
                      <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => toast.info("PDF not available yet")}>
                        <Download className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="sm:max-w-md">
          {active && <InvoiceDetail inv={active} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceDetail({ inv }: { inv: InvoiceWithOrder }) {
  const refunded = isRefunded(inv);
  const subtotal = Number(inv.amount) - Number(inv.tax_amount);
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{inv.invoice_number}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
            <p className="text-sm font-semibold">{inv.order?.order_number ?? "—"}</p>
          </div>
          <Badge variant="secondary" className={`rounded-full ${refunded ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
            {refunded ? "Refunded" : "Paid"}
          </Badge>
        </div>
        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{inr(subtotal)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Tax</span>
            <span>{inr(Number(inv.tax_amount))}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2 text-base font-bold">
            <span>Total</span><span>{inr(Number(inv.amount))}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-3">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-foreground/90 text-background">
            <QrCode className="h-8 w-8" />
          </div>
          <p className="text-xs text-muted-foreground">Scan to verify invoice authenticity</p>
        </div>
        <div className="flex gap-2">
          {inv.pdf_url ? (
            <Button asChild className="flex-1 rounded-full">
              <a href={inv.pdf_url} target="_blank" rel="noreferrer">
                <Download className="mr-2 h-4 w-4" /> PDF
              </a>
            </Button>
          ) : (
            <Button className="flex-1 rounded-full" onClick={() => toast.info("PDF not available yet")}>
              <Download className="mr-2 h-4 w-4" /> PDF
            </Button>
          )}
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>
      </div>
    </div>
  );
}