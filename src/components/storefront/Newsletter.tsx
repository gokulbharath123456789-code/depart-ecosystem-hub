import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { useState } from "react";
import { Mail } from "lucide-react";

export function Newsletter() {
  const [email, setEmail] = useState("");
  return (
    <div className="relative overflow-hidden rounded-[28px] bg-foreground px-6 py-12 text-background sm:px-12">
      <div className="pointer-events-none absolute -right-10 -top-10 h-60 w-60 rounded-full bg-primary/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-10 -left-10 h-60 w-60 rounded-full bg-accent/30 blur-3xl" />
      <div className="relative grid items-center gap-6 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
            Newsletter
          </div>
          <h3 className="mt-2 font-display text-3xl font-extrabold sm:text-4xl">
            Weekly savings, straight to your inbox.
          </h3>
          <p className="mt-2 max-w-md text-sm text-background/70">
            Get flash deals, new arrivals and exclusive Coimbatore-only offers from SREE SUPER MART.
          </p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            toast.success("Subscribed!", { description: `We'll send updates to ${email}` });
            setEmail("");
          }}
          className="flex w-full flex-col gap-2 sm:flex-row"
        >
          <div className="relative flex-1">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-background/60" />
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="h-12 rounded-full border-background/15 bg-background/10 pl-10 text-background placeholder:text-background/50 focus-visible:ring-primary"
            />
          </div>
          <Button type="submit" size="lg" className="h-12 rounded-full px-6 font-bold">
            Subscribe
          </Button>
        </form>
      </div>
    </div>
  );
}