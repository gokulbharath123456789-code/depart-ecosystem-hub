import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { ArrowDownRight, ArrowUpRight, ChevronRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { cn } from "@/lib/utils";

export function PageHeader({
  title,
  description,
  crumbs,
  actions,
}: {
  title: string;
  description?: string;
  crumbs?: { label: string; to?: string }[];
  actions?: ReactNode;
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div>
        {crumbs && crumbs.length > 0 && (
          <nav className="mb-2 flex items-center gap-1 text-xs text-muted-foreground">
            {crumbs.map((c, i) => (
              <span key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3" />}
                {c.to ? (
                  <Link to={c.to} className="hover:text-foreground">{c.label}</Link>
                ) : (
                  <span>{c.label}</span>
                )}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-2xl font-extrabold tracking-tight md:text-3xl">{title}</h1>
        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </header>
  );
}

const tints: Record<string, string> = {
  primary: "bg-primary/10 text-primary",
  amber: "bg-amber-500/10 text-amber-600",
  rose: "bg-rose-500/10 text-rose-600",
  sky: "bg-sky-500/10 text-sky-600",
  violet: "bg-violet-500/10 text-violet-600",
  emerald: "bg-emerald-500/10 text-emerald-600",
};

export function KpiCard({
  label,
  value,
  delta,
  icon: Icon,
  tint = "primary",
  delay = 0,
  sparkline,
}: {
  label: string;
  value: string | number;
  delta?: number;
  icon: LucideIcon;
  tint?: keyof typeof tints;
  delay?: number;
  sparkline?: number[];
}) {
  const up = (delta ?? 0) >= 0;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.35 }}
      className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card p-5 soft-shadow transition-shadow hover:lift-shadow"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</p>
        <span className={cn("grid h-9 w-9 place-items-center rounded-full", tints[tint])}>
          <Icon className="h-[18px] w-[18px]" />
        </span>
      </div>
      <p className="mt-3 font-display text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      <div className="mt-1 flex items-center justify-between">
        {typeof delta === "number" ? (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 text-xs font-semibold",
              up ? "text-emerald-600" : "text-rose-600",
            )}
          >
            {up ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {Math.abs(delta)}% vs last week
          </span>
        ) : <span />}
        {sparkline && <MiniSpark values={sparkline} positive={up} />}
      </div>
    </motion.div>
  );
}

function MiniSpark({ values, positive }: { values: number[]; positive: boolean }) {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const w = 70, h = 24;
  const pts = values
    .map((v, i) => {
      const x = (i / (values.length - 1)) * w;
      const y = h - ((v - min) / Math.max(1, max - min)) * h;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg width={w} height={h} className="overflow-visible">
      <polyline
        points={pts}
        fill="none"
        stroke={positive ? "var(--color-primary)" : "var(--color-destructive)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PanelCard({
  title,
  description,
  action,
  children,
  className,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-3xl border border-border/60 bg-card p-5 soft-shadow", className)}>
      <header className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h2 className="font-display text-base font-bold">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/70 bg-muted/30 px-6 py-12 text-center">
      <div className="mb-3 grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <p className="font-display text-base font-bold">{title}</p>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    paid: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    pending: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    shipped: "bg-sky-500/10 text-sky-600 ring-sky-500/20",
    delivered: "bg-primary/10 text-primary ring-primary/20",
    refunded: "bg-violet-500/10 text-violet-600 ring-violet-500/20",
    cancelled: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
    active: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20",
    draft: "bg-muted text-muted-foreground ring-border",
    archived: "bg-muted text-muted-foreground ring-border",
    invited: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
    disabled: "bg-rose-500/10 text-rose-600 ring-rose-500/20",
    paused: "bg-amber-500/10 text-amber-600 ring-amber-500/20",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-semibold capitalize ring-1 ring-inset",
        map[status] ?? "bg-muted text-muted-foreground ring-border",
      )}
    >
      {status}
    </span>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("shimmer rounded-xl", className)} />;
}

export function DataTable<T extends { id: string }>({
  columns,
  rows,
  empty,
}: {
  columns: { key: keyof T | string; label: string; render?: (row: T) => ReactNode; className?: string }[];
  rows: T[];
  empty?: ReactNode;
}) {
  if (rows.length === 0) return <div>{empty}</div>;
  return (
    <div className="overflow-hidden rounded-2xl border border-border/60">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/40">
            <tr>
              {columns.map((c) => (
                <th
                  key={String(c.key)}
                  className={cn(
                    "px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground",
                    c.className,
                  )}
                >
                  {c.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 bg-card">
            {rows.map((row) => (
              <tr key={row.id} className="transition-colors hover:bg-muted/30">
                {columns.map((c) => (
                  <td key={String(c.key)} className={cn("px-4 py-3 align-middle", c.className)}>
                    {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key as string] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}