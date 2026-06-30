import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  MapPinned,
  Heart,
  MapPin,
  Wallet,
  Ticket,
  FileText,
  RotateCcw,
  Star,
  LifeBuoy,
  Bell,
  Settings,
  LogOut,
  Menu,
  ChevronRight,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { user, notifications as mockNotifs } from "@/mock/account";
import { toast } from "sonner";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/features/auth/useAuth";

function useSignOutHandler() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  return async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };
}

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  exact?: boolean;
};

export const NAV: NavItem[] = [
  { to: "/account", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/account/orders", label: "Orders", icon: Package },
  { to: "/account/tracking", label: "Order Tracking", icon: MapPinned },
  { to: "/account/wishlist", label: "Wishlist", icon: Heart },
  { to: "/account/addresses", label: "Addresses", icon: MapPin },
  { to: "/account/wallet", label: "Wallet", icon: Wallet },
  { to: "/account/coupons", label: "Coupons", icon: Ticket },
  { to: "/account/invoices", label: "Invoices", icon: FileText },
  { to: "/account/returns", label: "Returns", icon: RotateCcw },
  { to: "/account/reviews", label: "Reviews", icon: Star },
  { to: "/account/support", label: "Support", icon: LifeBuoy },
  { to: "/account/notifications", label: "Notifications", icon: Bell },
  { to: "/account/settings", label: "Settings", icon: Settings },
];

function NavItems({ pathname, onNav }: { pathname: string; onNav?: () => void }) {
  return (
    <nav className="flex flex-col gap-1 px-2">
      {NAV.map((item) => {
        const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to as "/account"}
            onClick={onNav}
            className={cn(
              "group relative flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium transition",
              active
                ? "bg-primary/10 text-primary"
                : "text-foreground/70 hover:bg-muted hover:text-foreground",
            )}
          >
            {active && (
              <motion.span
                layoutId="nav-active"
                className="absolute inset-y-1.5 left-0 w-1 rounded-full bg-primary"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <Icon className="h-[18px] w-[18px] shrink-0" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
      <button
        onClick={() => toast.success("Logged out (demo)")}
        className="mt-2 flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-500/10"
      >
        <LogOut className="h-[18px] w-[18px]" />
        Logout
      </button>
    </nav>
  );
}

function Crumbs({ pathname }: { pathname: string }) {
  const parts = pathname.split("/").filter(Boolean);
  return (
    <nav className="hidden items-center gap-1.5 text-xs text-muted-foreground md:flex">
      <Link to="/" className="hover:text-foreground">
        DEPART
      </Link>
      {parts.map((p, i) => (
        <span key={i} className="flex items-center gap-1.5">
          <ChevronRight className="h-3 w-3" />
          <span className={cn(i === parts.length - 1 && "font-medium text-foreground")}>
            {p.charAt(0).toUpperCase() + p.slice(1)}
          </span>
        </span>
      ))}
    </nav>
  );
}

export function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const unread = mockNotifs.filter((n) => !n.read).length;

  const title =
    NAV.find((n) => (n.exact ? pathname === n.to : pathname.startsWith(n.to)))?.label ?? "Account";

  return (
    <div className="mx-auto flex w-full max-w-7xl gap-6 px-4 py-6 lg:px-6">
      {/* Sidebar — desktop */}
      <aside className="sticky top-24 hidden h-[calc(100vh-7rem)] w-60 shrink-0 flex-col rounded-3xl border border-border/60 bg-card/70 py-4 soft-shadow lg:flex">
        <div className="px-5 pb-3">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
              {user.avatar}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold">{user.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{user.membership}</p>
            </div>
          </div>
        </div>
        <ScrollArea className="flex-1">
          <NavItems pathname={pathname} />
        </ScrollArea>
      </aside>

      <div className="min-w-0 flex-1">
        {/* Header */}
        <div className="sticky top-20 z-20 mb-5 rounded-3xl border border-border/60 bg-card/80 px-4 py-3 backdrop-blur-xl soft-shadow">
          <div className="flex items-center gap-3">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-72 p-0">
                <div className="px-5 pb-3 pt-6">
                  <div className="flex items-center gap-3">
                    <div className="grid h-10 w-10 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{user.name}</p>
                      <p className="text-[11px] text-muted-foreground">{user.membership}</p>
                    </div>
                  </div>
                </div>
                <ScrollArea className="h-[calc(100vh-6rem)]">
                  <NavItems pathname={pathname} onNav={() => setOpen(false)} />
                </ScrollArea>
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <Crumbs pathname={pathname} />
              <h1 className="truncate font-display text-lg font-bold leading-tight sm:text-xl">
                {title}
              </h1>
            </div>

            <div className="relative hidden md:block">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search account…"
                className="h-9 w-56 rounded-full bg-background pl-9 pr-3"
              />
            </div>

            <NotifBell unread={unread} />

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                  {user.avatar}
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="font-semibold">{user.name}</div>
                  <div className="text-xs font-normal text-muted-foreground">{user.email}</div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/account/settings">Profile settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/orders">My orders</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/account/wallet">Wallet</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => toast.success("Logged out (demo)")}
                  className="text-rose-600"
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function NotifBell({ unread }: { unread: number }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="relative grid h-9 w-9 place-items-center rounded-full text-foreground/80 transition hover:bg-muted">
          <Bell className="h-5 w-5" />
          {unread > 0 && (
            <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
              {unread}
            </span>
          )}
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
          <div>
            <p className="text-sm font-semibold">Notifications</p>
            <p className="text-[11px] text-muted-foreground">{unread} unread</p>
          </div>
          <Link to="/account/notifications" className="text-xs font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <ScrollArea className="h-80">
          <ul className="divide-y divide-border/60">
            {mockNotifs.slice(0, 6).map((n) => (
              <li key={n.id} className="flex items-start gap-3 px-4 py-3 hover:bg-muted/50">
                <span
                  className={cn(
                    "mt-1.5 h-2 w-2 shrink-0 rounded-full",
                    n.read ? "bg-muted-foreground/40" : "bg-primary",
                  )}
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium">{n.title}</p>
                    <Badge variant="secondary" className="rounded-full px-1.5 py-0 text-[9px]">
                      {n.category}
                    </Badge>
                  </div>
                  <p className="line-clamp-2 text-xs text-muted-foreground">{n.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="grid place-items-center rounded-3xl border border-dashed border-border bg-card/50 py-20 text-center">
      <div className="grid h-20 w-20 place-items-center rounded-full bg-muted">
        <Icon className="h-9 w-9 text-muted-foreground" />
      </div>
      <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-muted-foreground">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export { X };