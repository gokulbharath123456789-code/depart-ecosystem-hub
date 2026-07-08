import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function Section({
  eyebrow,
  title,
  subtitle,
  to,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  to?: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto mt-14 max-w-7xl px-4 sm:mt-20 lg:px-6">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          {eyebrow && (
            <div className="mb-1.5 text-[11px] font-bold uppercase tracking-[0.18em] text-primary">
              {eyebrow}
            </div>
          )}
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {title}
          </h2>
          {subtitle && (
            <p className="mt-1 text-sm text-muted-foreground sm:text-base">{subtitle}</p>
          )}
        </div>
        {to && (
          <Link
            to={to}
            className="hidden shrink-0 items-center gap-1 text-sm font-semibold text-primary hover:underline sm:inline-flex"
          >
            View all <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}