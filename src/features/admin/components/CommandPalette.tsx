import { useNavigate } from "@tanstack/react-router";
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
} from "lucide-react";

const navItems = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/admin/analytics", label: "Analytics", icon: LineChart },
  { to: "/admin/reports", label: "Reports", icon: BarChart3 },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/categories", label: "Categories", icon: Tag },
  { to: "/admin/inventory", label: "Inventory", icon: Boxes },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/customers", label: "Customers", icon: Users },
  { to: "/admin/suppliers", label: "Suppliers", icon: Truck },
  { to: "/admin/notifications", label: "Notifications", icon: Bell },
  { to: "/admin/users", label: "Team", icon: ShieldCheck },
  { to: "/admin/settings", label: "Settings", icon: Settings },
] as const;

export function CommandPalette() {
  const { commandOpen, setCommandOpen, pushRecent } = useAdminStore();
  const navigate = useNavigate();

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
          <CommandItem onSelect={() => go("/admin/products")}>
            <Plus className="mr-2 h-4 w-4" /> New product
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/orders")}>
            <Plus className="mr-2 h-4 w-4" /> New order
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/customers")}>
            <Plus className="mr-2 h-4 w-4" /> New customer
          </CommandItem>
          <CommandItem onSelect={() => go("/admin/login")}>
            <LogOut className="mr-2 h-4 w-4" /> Sign out
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}