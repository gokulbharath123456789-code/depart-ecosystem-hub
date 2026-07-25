import { Star, Quote } from "lucide-react";
import { testimonials } from "@/mock/testimonials";

export function Testimonials() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {testimonials.map((t) => (
        <div
          key={t.id}
          className="flex flex-col gap-3 rounded-2xl border border-border/60 bg-card p-6 soft-shadow transition-shadow hover:lift-shadow"
        >
          <div className="flex items-center justify-between">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/30"}`}
                />
              ))}
            </div>
            <Quote className="h-5 w-5 text-primary/20" />
          </div>
          <p className="text-sm leading-relaxed text-foreground/80">"{t.quote}"</p>
          <div className="mt-auto flex items-center gap-3 pt-2">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/15 font-display font-bold text-primary">
              {t.initial}
            </div>
            <div>
              <div className="text-sm font-bold">{t.name}</div>
              <div className="text-xs text-muted-foreground">{t.role}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
