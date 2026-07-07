import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, Plus, Paperclip } from "lucide-react";
import { tickets as initial, formatTime, type SupportTicket } from "@/mock/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { PanelCard } from "@/components/dashboard/cards";
import { toast } from "sonner";

export const Route = createFileRoute("/account/support")({
  component: SupportPage,
});

const FAQ = [
  { q: "How do I cancel an order?", a: "Open the order from My Orders then tap Cancel. Cancellations are allowed before shipment." },
  { q: "When will I get my refund?", a: "Refunds are processed within 3-5 business days to your original payment method or SREE SUPER MART Wallet." },
  { q: "Can I change my delivery address?", a: "You can change the address from Order Tracking before the order is packed." },
  { q: "Do you deliver in 10 minutes everywhere?", a: "Express delivery is available in select pincodes. Standard delivery is 60-120 minutes." },
];

function priorityColor(p: SupportTicket["priority"]) {
  return p === "High" ? "bg-rose-100 text-rose-700" : p === "Medium" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700";
}
function statusColor(s: SupportTicket["status"]) {
  return s === "Resolved" || s === "Closed" ? "bg-emerald-100 text-emerald-700" : s === "In Progress" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";
}

function SupportPage() {
  const [list, setList] = useState<SupportTicket[]>(initial);
  const [open, setOpen] = useState(false);
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState<SupportTicket["category"]>("Order");
  const [priority, setPriority] = useState<SupportTicket["priority"]>("Medium");
  const [body, setBody] = useState("");

  function create() {
    const t: SupportTicket = {
      id: `tk${list.length + 1}`,
      subject,
      category,
      priority,
      status: "Open",
      createdAt: new Date().toISOString(),
      messages: [{ from: "you", body, at: new Date().toISOString() }],
    };
    setList([t, ...list]);
    setOpen(false);
    setSubject(""); setBody("");
    toast.success("Ticket created");
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-5">
          <PanelCard
            title="My tickets"
            action={
              <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                  <Button size="sm" className="rounded-full"><Plus className="mr-1 h-4 w-4" /> New ticket</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader><DialogTitle>Create support ticket</DialogTitle></DialogHeader>
                  <div className="space-y-3">
                    <div><Label className="text-xs">Subject</Label><Input className="mt-1 rounded-xl" value={subject} onChange={(e) => setSubject(e.target.value)} /></div>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <Label className="text-xs">Category</Label>
                        <Select value={category} onValueChange={(v) => setCategory(v as SupportTicket["category"])}>
                          <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{["Order","Payment","Account","Other"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label className="text-xs">Priority</Label>
                        <Select value={priority} onValueChange={(v) => setPriority(v as SupportTicket["priority"])}>
                          <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
                          <SelectContent>{["Low","Medium","High"].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div><Label className="text-xs">Describe your issue</Label><Textarea className="mt-1 rounded-xl" rows={4} value={body} onChange={(e) => setBody(e.target.value)} /></div>
                    <div className="flex items-center justify-center rounded-2xl border border-dashed py-4 text-xs text-muted-foreground"><Paperclip className="mr-2 h-4 w-4" /> Attach files (demo)</div>
                  </div>
                  <DialogFooter>
                    <Button className="rounded-full" onClick={create} disabled={!subject || !body}>Create ticket</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          >
            <Accordion type="single" collapsible className="space-y-3">
              {list.map((t) => (
                <AccordionItem key={t.id} value={t.id} className="rounded-2xl border border-border/60 bg-muted/30 px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex flex-1 flex-wrap items-center justify-between gap-2 pr-3 text-left">
                      <div>
                        <p className="text-sm font-semibold">{t.subject}</p>
                        <p className="text-xs text-muted-foreground">#{t.id} | {formatTime(t.createdAt)}</p>
                      </div>
                      <div className="flex gap-1.5">
                        <Badge variant="secondary" className={`rounded-full text-[10px] ${priorityColor(t.priority)}`}>{t.priority}</Badge>
                        <Badge variant="secondary" className={`rounded-full text-[10px] ${statusColor(t.status)}`}>{t.status}</Badge>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ol className="space-y-3 py-2">
                      {t.messages.map((m, i) => (
                        <li key={i} className={`flex ${m.from === "you" ? "justify-end" : "justify-start"}`}>
                          <div className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${m.from === "you" ? "bg-primary text-primary-foreground" : "bg-card border border-border/60"}`}>
                            <p>{m.body}</p>
                            <p className={`mt-1 text-[10px] ${m.from === "you" ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{formatTime(m.at)}</p>
                          </div>
                        </li>
                      ))}
                    </ol>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PanelCard>
        </div>

        <div className="space-y-5">
          <PanelCard title="Live chat">
            <div className="rounded-2xl bg-gradient-to-br from-primary/10 to-emerald-100 p-4 dark:from-primary/20 dark:to-emerald-900/20">
              <MessageCircle className="h-6 w-6 text-primary" />
              <p className="mt-2 text-sm font-semibold">Average wait: 1 min</p>
              <p className="text-xs text-muted-foreground">Chat with a SREE SUPER MART agent now.</p>
              <Button size="sm" className="mt-3 w-full rounded-full" onClick={() => toast.success("Connecting to agent (demo)")}>Start chat</Button>
            </div>
          </PanelCard>
          <PanelCard title="FAQ">
            <Accordion type="single" collapsible className="space-y-2">
              {FAQ.map((f, i) => (
                <AccordionItem key={i} value={`f${i}`} className="border-b border-border/60 last:border-b-0">
                  <AccordionTrigger className="text-left text-sm hover:no-underline">{f.q}</AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">{f.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </PanelCard>
        </div>
      </div>
    </div>
  );
}