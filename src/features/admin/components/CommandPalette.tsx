import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { signOut } from "@/features/auth/useAuth";
import { toast } from "sonner";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { useAdminStore } from "@/store/admin";
import { useEffect } from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Truck,
  Tag,
  Boxes,
  Bell,
  Settings,
  ShieldCheck,
  LineChart,
  BarChart3,
  Plus,
  LogOut,
  Warehouse,
  ClipboardList,
  ArrowLeftRight,
  Sliders,
  Barcode,
  CalendarClock,
  Sparkles,
  Upload,
  PackageCheck,
  Route as RouteIcon,
  Map as MapIcon,
  Heart,
  Megaphone,
  RotateCcw,
  Wallet,
  LifeBuoy,
  BookOpen,
  Workflow,
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/warehouses", label: "Warehouses", icon: Warehouse },
  { to: "/admin/stock-movements", label: "Stock Movements", icon: ArrowLeftRight },
  { to: "/admin/stock-adjustments", label: "Adjustments", icon: Sliders },
  { to: "/admin/purchase-orders", label: "Purchase Orders", icon: ClipboardList },
  { to: "/admin/batches", label: "Batches & Expiry", icon: CalendarClock },
  { to: "/admin/barcodes", label: "Barcode Center", icon: Barcode },
  { to: "/admin/forecast", label: "Forecast", icon: Sparkles },
  { to: "/admin/bulk-operations", label: "Bulk Operations", icon: Upload },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/fulfillment", label: "Fulfillment", icon: PackageCheck },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { to: "/admin/delivery", label: "Delivery", icon: Truck },
  { to: "/admin/delivery-partners", label: "Delivery partners", icon: ShieldCheck },
  { to: "/admin/routes", label: "Route planner", icon: RouteIcon },
  { to: "/admin/delivery-analytics", label: "Delivery analytics", icon: MapIcon },
  { to: "/admin/crm", label: "Customer CRM", icon: Heart },
  { to: "/admin/loyalty", label: "Loyalty", icon: Sparkles },
  { to: "/admin/marketing", label: "Marketing", icon: Megaphone },
  { to: "/admin/returns", label: "Returns", icon: RotateCcw },
  { to: "/admin/refunds", label: "Refunds", icon: Wallet },
  { to: "/admin/tickets", label: "Support tickets", icon: LifeBuoy },
  { to: "/admin/knowledge-base", label: "Knowledge base", icon: BookOpen },
  { to: "/admin/workflows", label: "Workflows", icon: Workflow },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/users", label: "Team", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function CommandPalette() {
  const { commandOpen, setCommandOpen, pushRecent } = useAdminStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleSignOut = async () => {
    setCommandOpen(false);
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setCommandOpen(!commandOpen);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commandOpen, setCommandOpen]);

  const go = (to: string) => {
    pushRecent(to);
    setCommandOpen(false);
    navigate({ to });
  };

  return (
    <CommandDialog open={commandOpen} onOpenChange={setCommandOpen}>
      <CommandInput placeholder="Search pages, products, orders…" />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Pages">
          {navItems.map((i) => (
            <CommandItem key={i.to} onSelect={() => go(i.to)}>
              <i.icon className="mr-2 h-4 w-4" />
              {i.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/admin/products/new")}>
            <Plus className="mr-2 h-4 w-4" /> New product
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/purchase-orders")}>
            <Plus className="mr-2 h-4 w-4" /> New purchase order
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/stock-adjustments")}>
            <Plus className="mr-2 h-4 w-4" /> New stock adjustment
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/orders")}>
            <Plus className="mr-2 h-4 w-4" /> New order
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/customers")}>
            <Plus className="mr-2 h-4 w-4" /> New customer
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/marketing")}>
            <Plus className="mr-2 h-4 w-4" /> New campaign
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/workflows")}>
            <Plus className="mr-2 h-4 w-4" /> New workflow
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/tickets")}>
            <Plus className="mr-2 h-4 w-4" /> New support ticket
          </CommandItem>
          <CommandItem onSelect={handleSignOut}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}