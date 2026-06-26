import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Wallet, ArrowDown, ArrowUp, Download, Search, Plus } from "lucide-react";
import { walletTxns, formatTime, user } from "@/mock/account";
import { inr } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelCard } from "@/components/dashboard/cards";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/account/wallet")({
  component: WalletPage,
});

function WalletPage() {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all");
  const txns = useMemo(() => {
    return walletTxns
      .filter((t) => t.note.toLowerCase().includes(q.toLowerCase()))
      .filter((t) => (filter === "all" ? true : t.type === filter));
  }, [q, filter]);

  const cashback = walletTxns.filter((t) => t.type === "Cashback").reduce((a, b) => a + b.amount, 0);
  const refunds = walletTxns.filter((t) => t.type === "Refund").reduce((a, b) => a + b.amount, 0);

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary to-emerald-600 p-6 text-primary-foreground soft-shadow md:col-span-2">
          <div className="flex items-center gap-2 text-xs uppercase tracking-wider opacity-80">
            <Wallet className="h-4 w-4" /> DEPART Wallet
          </div>
          <p className="mt-3 font-display text-4xl font-extrabold tracking-tight">{inr(user.wallet)}</p>
          <p className="mt-1 text-sm opacity-80">Use at checkout for instant savings</p>
          <div className="mt-5 flex gap-2">
            <Button size="sm" variant="secondary" className="rounded-full" onClick={() => toast.success("Top-up flow (demo)")}>
              <Plus className="mr-1 h-4 w-4" /> Top-up
            </Button>
            <Button size="sm" variant="ghost" className="rounded-full text-primary-foreground hover:bg-white/10" onClick={() => toast.success("Statement downloaded (demo)")}>
              <Download className="mr-1 h-4 w-4" /> Statement
            </Button>
          </div>
          <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-1">
          <div className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Cashback</p>
            <p className="mt-2 font-display text-2xl font-bold">{inr(cashback)}</p>
          </div>
          <div className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Refunds</p>
            <p className="mt-2 font-display text-2xl font-bold">{inr(refunds)}</p>
          </div>
        </div>
      </div>

      <PanelCard
        title="Transaction history"
        action={
          <Button size="sm" variant="ghost" className="rounded-full" onClick={() => toast.success("Exported CSV (demo)")}>
            <Download className="mr-1 h-4 w-4" /> Export
          </Button>
        }
      >
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-56">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search transactions" className="h-9 rounded-full pl-9" />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="h-9 w-36 rounded-full"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All types</SelectItem>
              {["Cashback","Refund","Top-up","Purchase"].map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>

        <ul className="divide-y divide-border/60">
          {txns.map((t) => (
            <li key={t.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <span className={`grid h-10 w-10 place-items-center rounded-full ${t.kind === "credit" ? "bg-emerald-500/10 text-emerald-600" : "bg-rose-500/10 text-rose-600"}`}>
                {t.kind === "credit" ? <ArrowDown className="h-4 w-4" /> : <ArrowUp className="h-4 w-4" />}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-semibold">{t.note}</p>
                  <Badge variant="secondary" className="rounded-full text-[10px]">{t.type}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">{formatTime(t.at)}</p>
              </div>
              <p className={`text-sm font-bold ${t.kind === "credit" ? "text-emerald-600" : "text-rose-600"}`}>
                {t.kind === "credit" ? "+" : "-"} {inr(t.amount)}
              </p>
            </li>
          ))}
        </ul>
      </PanelCard>
    </div>
  );
}