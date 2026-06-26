import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export function StatCard({
  label,
  value,
  hint,
  icon: Icon,
  tint = "primary",
  delay = 0,
}: {
  label: string;
  value: string | number;
  hint?: string;
  icon: LucideIcon;
  tint?: "primary" | "amber" | "rose" | "sky" | "violet";
  delay?: number;
}) {
  const tints: Record<string, string> = {
    primary: "bg-primary/10 text-primary",
    amber: "bg-amber-500/10 text-amber-600",
    rose: "bg-rose-500/10 text-rose-600",
    sky: "bg-sky-500/10 text-sky-600",
    violet: "bg-violet-500/10 text-violet-600",
  };
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 soft-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-full", tints[tint])}>
          <Icon className="h-4.5 w-4.5 h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </motion.div>
  );
}

export function PanelCard({
  title,
  action,
  children,
  className,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-border/60 bg-card p-5 soft-shadow", className)}>
      <header className="mb-4 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-bold">{title}</h2>
        {action}
      </header>
      {children}
    </section>
  );
}