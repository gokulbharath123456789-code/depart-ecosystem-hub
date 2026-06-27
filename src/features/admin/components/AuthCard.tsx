import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  footer,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div>
      <Link to="/admin/dashboard" className="mb-8 inline-flex items-center gap-2 lg:hidden">
        <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-base font-extrabold">D</span>
        <span className="font-display text-base font-extrabold">DEPART</span>
      </Link>
      {eyebrow && <p className="mb-2 text-[11px] font-semibold uppercase tracking-widest text-primary">{eyebrow}</p>}
      <h1 className="font-display text-2xl font-extrabold tracking-tight">{title}</h1>
      {description && <p className="mt-2 text-sm text-muted-foreground">{description}</p>}
      <div className="mt-8 space-y-4">{children}</div>
      {footer && <div className="mt-6 text-sm text-muted-foreground">{footer}</div>}
    </div>
  );
}