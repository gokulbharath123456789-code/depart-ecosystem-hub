import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { FileText, Download, Printer, Search, QrCode } from "lucide-react";
import { invoices, orders, formatDate, type Invoice } from "@/mock/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PanelCard } from "@/components/dashboard/cards";
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

function InvoicesPage() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("all");
  const [sort, setSort] = useState("recent");
  const [active, setActive] = useState<Invoice | null>(null);

  const list = useMemo(() => {
    let arr = invoices.filter((i) => i.number.toLowerCase().includes(q.toLowerCase()));
    if (status !== "all") arr = arr.filter((i) => i.status === status);
    if (sort === "recent") arr = [...arr].sort((a, b) => +new Date(b.date) - +new Date(a.date));
    if (sort === "amount") arr = [...arr].sort((a, b) => b.amount - a.amount);
    return arr;
  }, [q, status, sort]);

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

      <div className="grid gap-3 sm:grid-cols-2">
        {list.map((inv) => (
          <div key={inv.id} className="flex items-center gap-4 rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary"><FileText className="h-5 w-5" /></span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="truncate text-sm font-semibold">{inv.number}</p>
                <Badge variant="secondary" className={`rounded-full text-[10px] ${inv.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{inv.status}</Badge>
              </div>
              <p className="text-xs text-muted-foreground">{formatDate(inv.date)} | GST {inr(inv.gst)}</p>
            </div>
            <div className="text-right">
              <p className="font-display text-base font-bold">{inr(inv.amount)}</p>
              <div className="mt-1 flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => setActive(inv)}><FileText className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => toast.success("Downloading PDF")}><Download className="h-4 w-4" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full" onClick={() => window.print()}><Printer className="h-4 w-4" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!active} onOpenChange={(v) => !v && setActive(null)}>
        <DialogContent className="sm:max-w-md">
          {active && <InvoiceDetail inv={active} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function InvoiceDetail({ inv }: { inv: Invoice }) {
  const order = orders.find((o) => o.id === inv.orderId);
  return (
    <div>
      <DialogHeader>
        <DialogTitle>{inv.number}</DialogTitle>
      </DialogHeader>
      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Order</p>
            <p className="text-sm font-semibold">{order?.number}</p>
          </div>
          <Badge variant="secondary" className={`rounded-full ${inv.status === "Paid" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>{inv.status}</Badge>
        </div>
        <div className="rounded-2xl bg-muted/40 p-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{inr(inv.amount - inv.gst)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">GST (5%)</span>
            <span>{inr(inv.gst)}</span>
          </div>
          <div className="mt-2 flex items-center justify-between border-t pt-2 text-base font-bold">
            <span>Total</span><span>{inr(inv.amount)}</span>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border p-3">
          <div className="grid h-16 w-16 place-items-center rounded-xl bg-foreground/90 text-background">
            <QrCode className="h-8 w-8" />
          </div>
          <p className="text-xs text-muted-foreground">Scan to verify invoice authenticity</p>
        </div>
        <div className="flex gap-2">
          <Button className="flex-1 rounded-full" onClick={() => toast.success("Downloaded PDF")}><Download className="mr-2 h-4 w-4" /> PDF</Button>
          <Button variant="outline" className="flex-1 rounded-full" onClick={() => window.print()}><Printer className="mr-2 h-4 w-4" /> Print</Button>
        </div>
      </div>
    </div>
  );
}