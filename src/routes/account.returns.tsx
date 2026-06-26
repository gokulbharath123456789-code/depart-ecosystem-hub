import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Upload, LifeBuoy, Plus } from "lucide-react";
import { returns as initial, orders, formatDate, type ReturnRequest } from "@/mock/account";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PanelCard } from "@/components/dashboard/cards";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import { motion } from "framer-motion";

export const Route = createFileRoute("/account/returns")({
  component: ReturnsPage,
});

const STAGES: ReturnRequest["status"][] = ["Requested", "Approved", "Picked up", "Refunded"];

function statusBadge(s: ReturnRequest["status"]) {
  if (s === "Rejected") return "bg-rose-100 text-rose-700";
  if (s === "Refunded") return "bg-emerald-100 text-emerald-700";
  if (s === "Picked up" || s === "Approved") return "bg-blue-100 text-blue-700";
  return "bg-amber-100 text-amber-700";
}

function ReturnsPage() {
  const [list, setList] = useState<ReturnRequest[]>(initial);
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("Product damaged");
  const [orderId, setOrderId] = useState(orders[0].id);
  const [note, setNote] = useState("");

  function submit() {
    const o = orders.find((x) => x.id === orderId)!;
    const next: ReturnRequest = {
      id: `r${list.length + 1}`,
      orderId: o.id,
      productName: o.items[0].product.name,
      reason,
      status: "Requested",
      createdAt: new Date().toISOString(),
      refundAmount: o.items[0].product.price,
    };
    setList([next, ...list]);
    setOpen(false);
    setNote("");
    toast.success("Return request submitted");
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">{list.length} return requests</p>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New return</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader><DialogTitle>Request a return</DialogTitle></DialogHeader>
            <div className="space-y-3">
              <div>
                <Label className="text-xs">Order</Label>
                <Select value={orderId} onValueChange={setOrderId}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {orders.slice(0, 10).map((o) => (
                      <SelectItem key={o.id} value={o.id}>{o.number}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Reason</Label>
                <Select value={reason} onValueChange={setReason}>
                  <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["Product damaged","Wrong item delivered","Quality issue","Changed my mind","Late delivery"].map(r => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-xs">Additional notes</Label>
                <Textarea value={note} onChange={(e) => setNote(e.target.value)} className="mt-1 rounded-xl" rows={3} />
              </div>
              <div className="flex items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 py-6 text-xs text-muted-foreground">
                <Upload className="mr-2 h-4 w-4" /> Upload product images (demo)
              </div>
            </div>
            <DialogFooter>
              <Button className="rounded-full" onClick={submit}>Submit request</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {list.map((r, i) => {
          const order = orders.find((o) => o.id === r.orderId);
          const stageIdx = STAGES.indexOf(r.status);
          return (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="rounded-3xl border border-border/60 bg-card p-5 soft-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <p className="font-semibold">{r.productName}</p>
                    <Badge variant="secondary" className={`rounded-full ${statusBadge(r.status)}`}>{r.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Order {order?.number} | {r.reason} | {formatDate(r.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Refund</p>
                  <p className="font-display text-base font-bold">{inr(r.refundAmount)}</p>
                </div>
              </div>

              {r.status !== "Rejected" && (
                <div className="mt-4 flex items-center gap-2">
                  {STAGES.map((s, idx) => (
                    <div key={s} className="flex flex-1 items-center gap-2">
                      <span className={`h-2.5 w-2.5 rounded-full ${idx <= stageIdx ? "bg-primary" : "bg-muted-foreground/30"}`} />
                      <span className={`text-[11px] ${idx <= stageIdx ? "font-semibold" : "text-muted-foreground"}`}>{s}</span>
                      {idx < STAGES.length - 1 && <span className={`h-px flex-1 ${idx < stageIdx ? "bg-primary" : "bg-border"}`} />}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>

      <PanelCard title="Need help with a return?">
        <p className="text-sm text-muted-foreground">Our support team is available 24x7 to help with returns and refunds.</p>
        <Button className="mt-3 rounded-full" variant="outline"><LifeBuoy className="mr-2 h-4 w-4" /> Contact support</Button>
      </PanelCard>
    </div>
  );
}