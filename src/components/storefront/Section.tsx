import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function Section({
  eyebrow,
  title,
  subtitle,
  to,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  to?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={`mx-auto mt-20 max-w-7xl px-4 lg:px-6 ${className ?? ""}`}>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-2xl">
          {eyebrow && (
            <div className="mb-2 flex items-center gap-2">
              <span className="h-px w-8 bg-primary" />
              <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-primary">
                {eyebrow}
              </span>
            </div>
          )}
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl lg:text-[2.2rem]">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-2.5 text-sm text-foreground/60 sm:text-base">{subtitle}</p>
          )}
        </div>
        {to && (
          <Link
            to={to}
            className="group inline-flex shrink-0 items-center gap-1.5 self-start rounded-full border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground transition hover:border-primary/40 hover:text-primary sm:self-auto"
          >
            View all
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}
