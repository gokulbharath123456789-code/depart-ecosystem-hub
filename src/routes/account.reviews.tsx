import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Star, ThumbsUp, Pencil, Trash2, Upload, Video } from "lucide-react";
import { reviews as initial, formatDate, type Review } from "@/mock/account";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { PanelCard } from "@/components/dashboard/cards";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export const Route = createFileRoute("/account/reviews")({
  component: ReviewsPage,
});

function Stars({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="flex gap-0.5">
      {[1,2,3,4,5].map((n) => (
        <button key={n} disabled={!onChange} onClick={() => onChange?.(n)} className="text-amber-500">
          <Star className={`h-4 w-4 ${n <= value ? "fill-current" : ""}`} />
        </button>
      ))}
    </div>
  );
}

function ReviewsPage() {
  const [list, setList] = useState<Review[]>(initial);
  const published = list.filter((r) => r.published);
  const pending = list.filter((r) => !r.published);

  function publish(id: string, rating: number, title: string, body: string) {
    setList((l) => l.map((r) => (r.id === id ? { ...r, rating, title, body, published: true } : r)));
    toast.success("Review published");
  }
  function remove(id: string) {
    setList((l) => l.filter((r) => r.id !== id));
    toast.success("Review deleted");
  }

  return (
    <PanelCard title="Your reviews">
      <Tabs defaultValue="pending">
        <TabsList className="rounded-full">
          <TabsTrigger value="pending" className="rounded-full">Pending ({pending.length})</TabsTrigger>
          <TabsTrigger value="published" className="rounded-full">Published ({published.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="pending" className="mt-5 space-y-3">
          {pending.length === 0 && <p className="py-10 text-center text-sm text-muted-foreground">All caught up!</p>}
          {pending.map((r) => <PendingItem key={r.id} review={r} onPublish={publish} />)}
        </TabsContent>

        <TabsContent value="published" className="mt-5 space-y-3">
          {published.map((r) => (
            <div key={r.id} className="rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold">{r.productName}</p>
                  <Stars value={r.rating} />
                  <p className="mt-2 text-sm font-medium">{r.title}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{r.body}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <Badge variant="secondary" className="rounded-full text-[10px]">{formatDate(r.createdAt)}</Badge>
                  <span className="flex items-center gap-1 text-xs text-muted-foreground"><ThumbsUp className="h-3 w-3" /> {r.helpful} helpful</span>
                </div>
              </div>
              <div className="mt-3 flex gap-2">
                <Button size="sm" variant="outline" className="rounded-full" onClick={() => toast.success("Editor opened (demo)")}><Pencil className="mr-1 h-3.5 w-3.5" /> Edit</Button>
                <Button size="sm" variant="ghost" className="rounded-full text-rose-600" onClick={() => remove(r.id)}><Trash2 className="mr-1 h-3.5 w-3.5" /> Delete</Button>
              </div>
            </div>
          ))}
        </TabsContent>
      </Tabs>
    </PanelCard>
  );
}

function PendingItem({ review, onPublish }: { review: Review; onPublish: (id: string, rating: number, title: string, body: string) => void }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl border border-border/60 bg-card p-4 soft-shadow">
      <div>
        <p className="text-sm font-semibold">{review.productName}</p>
        <p className="text-xs text-muted-foreground">Purchased {formatDate(review.createdAt)}</p>
      </div>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button size="sm" className="rounded-full">Write a review</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Review {review.productName}</DialogTitle></DialogHeader>
          <div className="space-y-3">
            <div>
              <Label className="text-xs">Rating</Label>
              <div className="mt-1"><Stars value={rating} onChange={setRating} /></div>
            </div>
            <div>
              <Label className="text-xs">Title</Label>
              <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 rounded-xl" />
            </div>
            <div>
              <Label className="text-xs">Review</Label>
              <Textarea value={body} onChange={(e) => setBody(e.target.value)} className="mt-1 rounded-xl" rows={4} />
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
              <div className="flex items-center justify-center rounded-2xl border border-dashed py-4"><Upload className="mr-2 h-4 w-4" /> Add photos</div>
              <div className="flex items-center justify-center rounded-2xl border border-dashed py-4"><Video className="mr-2 h-4 w-4" /> Add video</div>
            </div>
          </div>
          <DialogFooter>
            <Button className="rounded-full" onClick={() => { onPublish(review.id, rating || 5, title || "Great", body || "Loved it"); setOpen(false); }}>Publish</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}