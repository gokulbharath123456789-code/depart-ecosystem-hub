import type { ReactNode } from "react";
import { useEffect } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { CommandPalette } from "./CommandPalette";
import { NotificationPanel } from "./NotificationPanel";
import { useAdminStore, applyTheme } from "@/store/admin";

export function AdminShell({ children }: { children: ReactNode }) {
  const theme = useAdminStore((s) => s.theme);
  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return (
    <div className="flex min-h-screen w-full bg-muted/30">
      <AdminSidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <AdminHeader />
        <main className="flex-1 px-4 py-6 md:px-6 lg:px-8">{children}</main>
      </div>
      <CommandPalette />
      <NotificationPanel />
    </div>
  );
}

export function AuthShell({ children, side }: { children: ReactNode; side?: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-primary/20 via-emerald-200/30 to-amber-100/40 lg:block">
        <div className="absolute inset-0">
          <div className="absolute -left-12 top-20 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-amber-300/40 blur-3xl" />
        </div>
        <div className="relative flex h-full flex-col justify-between p-12">
          <div className="flex items-center gap-2">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-base font-extrabold">
              D
            </span>
            <span className="font-display text-lg font-extrabold">DEPART</span>
          </div>
          <div className="max-w-md">
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight">
              The supermarket OS your team will actually love.
            </h2>
            <p className="mt-3 text-sm text-foreground/70">
              Live inventory, instant fulfillment, and merchandising tools built for category leaders.
            </p>
            {side}
          </div>
          <p className="text-xs text-foreground/60">© DEPART Retail · Mumbai</p>
        </div>
      </div>
      <div className="flex items-center justify-center px-6 py-12 sm:px-12">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}