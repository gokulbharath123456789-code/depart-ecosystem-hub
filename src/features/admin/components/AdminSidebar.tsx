import { Link, useRouterState } from "@tanstack/react-router";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Boxes,
  Tag,
  ShoppingCart,
  Users,
  Truck,
  BarChart3,
  LineChart,
  Settings,
  Bell,
  ShieldCheck,
  Store,
  ChevronsLeft,
  ChevronsRight,
  Star,
  Clock,
  Search,
  Plus,
  Warehouse,
  ClipboardList,
  ArrowLeftRight,
  Sliders,
  Barcode,
  CalendarClock,
  Sparkles,
  Upload,
  PackageCheck,
  Map as MapIcon,
  Route as RouteIcon,
  Heart,
  Megaphone,
  RotateCcw,
  Wallet,
  LifeBuoy,
  BookOpen,
  Workflow,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAdminStore } from "@/store/admin";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const groups = [
  {
    label: "Dashboard",
    items: [
      { to: "/admin/dashboard", icon: LayoutDashboard, label: "Overview" },
    ],
  },
  {
    label: "Sales",
    items: [
      { to: "/admin/orders", icon: ShoppingCart, label: "Orders" },
      { to: "/admin/fulfillment", icon: PackageCheck, label: "Fulfillment" },
      { to: "/admin/delivery", icon: Truck, label: "Delivery" },
      { to: "/admin/delivery-partners", icon: ShieldCheck, label: "Delivery partners" },
      { to: "/admin/routes", icon: RouteIcon, label: "Routes" },
      { to: "/admin/returns", icon: RotateCcw, label: "Returns" },
      { to: "/admin/refunds", icon: Wallet, label: "Refunds" },
    ],
  },
  {
    label: "Catalog",
    items: [
      { to: "/admin/products", icon: Package, label: "Products" },
      { to: "/admin/categories", icon: Tag, label: "Categories" },
    ],
  },
  {
    label: "Inventory",
    items: [
      { to: "/admin/inventory", icon: Boxes, label: "Inventory" },
      { to: "/admin/warehouses", icon: Warehouse, label: "Warehouses" },
      { to: "/admin/stock-movements", icon: ArrowLeftRight, label: "Stock movements" },
      { to: "/admin/stock-adjustments", icon: Sliders, label: "Stock adjustments" },
      { to: "/admin/batches", icon: CalendarClock, label: "Batches & expiry" },
      { to: "/admin/barcodes", icon: Barcode, label: "Barcode center" },
      { to: "/admin/forecast", icon: Sparkles, label: "Forecast" },
      { to: "/admin/bulk-operations", icon: Upload, label: "Bulk operations" },
    ],
  },
  {
    label: "Purchasing",
    items: [
      { to: "/admin/suppliers", icon: Truck, label: "Suppliers" },
      { to: "/admin/purchase-orders", icon: ClipboardList, label: "Purchase orders" },
    ],
  },
  {
    label: "Customers",
    items: [
      { to: "/admin/customers", icon: Users, label: "All customers" },
      { to: "/admin/crm", icon: Heart, label: "CRM" },
      { to: "/admin/loyalty", icon: Sparkles, label: "Loyalty" },
      { to: "/admin/tickets", icon: LifeBuoy, label: "Support" },
      { to: "/admin/knowledge-base", icon: BookOpen, label: "Knowledge base" },
    ],
  },
  {
    label: "Marketing",
    items: [
      { to: "/admin/marketing", icon: Megaphone, label: "Campaigns" },
      { to: "/admin/notifications", icon: Bell, label: "Notifications" },
      { to: "/admin/workflows", icon: Workflow, label: "Workflows" },
    ],
  },
  {
    label: "Reports",
    items: [
      { to: "/admin/analytics", icon: LineChart, label: "Analytics" },
      { to: "/admin/reports", icon: BarChart3, label: "Reports" },
      { to: "/admin/delivery-analytics", icon: MapIcon, label: "Delivery analytics" },
    ],
  },
  {
    label: "System",
    items: [
      { to: "/admin/users", icon: ShieldCheck, label: "Team" },
      { to: "/admin/settings", icon: Settings, label: "Settings" },
    ],
  },
] as const;

const labelByPath = new Map(groups.flatMap((g) => g.items.map((i) => [i.to as string, i.label])));

export function AdminSidebar() {
  const { sidebarCollapsed, toggleSidebar, favorites, recents, toggleFavorite, setCommandOpen } =
    useAdminStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <aside
      className={cn(
        "sticky top-0 hidden h-screen shrink-0 flex-col border-r border-border/60 bg-sidebar text-sidebar-foreground lg:flex",
        sidebarCollapsed ? "w-[76px]" : "w-[260px]",
      )}
    >
      <div className="flex h-16 items-center justify-between px-4">
        <Link to="/admin/dashboard" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-2xl bg-primary text-primary-foreground font-display text-sm font-extrabold">
            D
          </span>
          {!sidebarCollapsed && (
            <span className="font-display text-base font-extrabold tracking-tight">SREE SUPER MART</span>
          )}
        </Link>
        <button
          onClick={toggleSidebar}
          className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Collapse sidebar"
        >
          {sidebarCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
        </button>
      </div>

      <div className="px-3">
        <button
          onClick={() => setCommandOpen(true)}
          className={cn(
            "group flex w-full items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 py-2 text-left text-sm text-muted-foreground hover:bg-card",
            sidebarCollapsed && "justify-center px-2",
          )}
        >
          <Search className="h-4 w-4" />
          {!sidebarCollapsed && (
            <>
              <span>Search</span>
              <kbd className="ml-auto rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium">
                ⌘K
              </kbd>
            </>
          )}
        </button>
      </div>

      <nav className="mt-4 flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {!sidebarCollapsed && favorites.length > 0 && (
          <Group label="Favorites" icon={Star}>
            {favorites.map((p) => (
              <NavItem
                key={p}
                to={p}
                label={labelByPath.get(p) ?? p.replace("/admin/", "")}
                icon={Star}
                active={pathname === p}
                onStar={() => toggleFavorite(p)}
                starred
              />
            ))}
          </Group>
        )}
        {!sidebarCollapsed && recents.length > 0 && (
          <Group label="Recent" icon={Clock}>
            {recents.map((p) => (
              <NavItem
                key={p}
                to={p}
                label={labelByPath.get(p) ?? p.replace("/admin/", "")}
                icon={Clock}
                active={pathname === p}
              />
            ))}
          </Group>
        )}

        {groups.map((g) => (
          <Group key={g.label} label={g.label} collapsed={sidebarCollapsed}>
            {g.items.map((it) => (
              <NavItem
                key={it.to}
                to={it.to}
                label={it.label}
                icon={it.icon}
                active={pathname === it.to}
                collapsed={sidebarCollapsed}
                onStar={() => toggleFavorite(it.to)}
                starred={favorites.includes(it.to)}
              />
            ))}
          </Group>
        ))}
      </nav>

      <div className="border-t border-border/60 p-3">
        <div
          className={cn(
            "flex items-center gap-3 rounded-2xl bg-card/80 p-3 soft-shadow",
            sidebarCollapsed && "justify-center p-2",
          )}
        >
          <div className="grid h-8 w-8 place-items-center rounded-full bg-primary/15 text-primary">
            <Store className="h-4 w-4" />
          </div>
          {!sidebarCollapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold">SREE SUPER MART Coimbatore</p>
              <p className="truncate text-[11px] text-muted-foreground">3 stores · Plan Pro</p>
            </div>
          )}
          {!sidebarCollapsed && (
            <button className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground">
              <Plus className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
}

function Group({
  label,
  icon: Icon,
  collapsed,
  children,
}: {
  label: string;
  icon?: typeof Star;
  collapsed?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div>
      {!collapsed && (
        <p className="mb-1 flex items-center gap-1.5 px-2 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {Icon && <Icon className="h-3 w-3" />}
          {label}
        </p>
      )}
      <ul className="space-y-0.5">{children}</ul>
    </div>
  );
}

function NavItem({
  to,
  label,
  icon: Icon,
  active,
  collapsed,
  onStar,
  starred,
}: {
  to: string;
  label: string;
  icon: typeof Star;
  active?: boolean;
  collapsed?: boolean;
  onStar?: () => void;
  starred?: boolean;
}) {
  const content = (
    <Link
      to={to}
      className={cn(
        "group/nav relative flex items-center gap-2.5 rounded-xl px-3 py-2 text-sm transition-colors",
        active
          ? "bg-primary/10 text-foreground"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
        collapsed && "justify-center px-2",
      )}
    >
      {active && (
        <motion.span
          layoutId="admin-nav-pill"
          className="absolute left-0 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-primary"
        />
      )}
      <Icon className={cn("h-4 w-4", active && "text-primary")} />
      {!collapsed && <span className="flex-1 truncate font-medium">{label}</span>}
      {!collapsed && onStar && (
        <span
          role="button"
          tabIndex={0}
          onClick={(e) => {
            e.preventDefault();
            onStar();
          }}
          className={cn(
            "rounded p-0.5 opacity-0 transition-opacity hover:bg-background group-hover/nav:opacity-100",
            starred && "opacity-100",
          )}
        >
          <Star
            className={cn("h-3.5 w-3.5", starred ? "fill-amber-400 text-amber-500" : "text-muted-foreground")}
          />
        </span>
      )}
    </Link>
  );
  if (collapsed) {
    return (
      <li>
        <TooltipProvider delayDuration={120}>
          <Tooltip>
            <TooltipTrigger asChild>{content}</TooltipTrigger>
            <TooltipContent side="right">{label}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </li>
    );
  }
  return <li>{content}</li>;
}