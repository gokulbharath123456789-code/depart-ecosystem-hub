import { Link, useRouterState } from "@tanstack/react-router";
import { useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { signOut } from "@/features/auth/useAuth";
import {
  Bell,
  Search,
  Sun,
  Moon,
  Monitor,
  Plus,
  HelpCircle,
  Menu,
  ChevronDown,
  LogOut,
  User,
  Settings,
} from "lucide-react";
import { useAdminStore } from "@/store/admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AdminSidebar } from "./AdminSidebar";

const titles: Record<string, string> = {
  "/admin/dashboard": "Dashboard",
  "/admin/analytics": "Analytics",
  "/admin/reports": "Reports",
  "/admin/products": "Products",
  "/admin/categories": "Categories",
  "/admin/inventory": "Inventory",
  "/admin/orders": "Orders",
  "/admin/customers": "Customers",
  "/admin/suppliers": "Suppliers",
  "/admin/notifications": "Notifications",
  "/admin/users": "Team",
  "/admin/settings": "Settings",
};

export function AdminHeader() {
  const { setCommandOpen, setNotificationsOpen, theme, setTheme } = useAdminStore();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const title = titles[pathname] ?? "Admin";
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await signOut();
    toast.success("Signed out");
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl md:px-6">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] p-0">
          <div className="h-full overflow-hidden">
            <AdminSidebar />
          </div>
        </SheetContent>
      </Sheet>

      <div className="hidden flex-col md:flex">
        <nav className="flex items-center gap-1 text-[11px] uppercase tracking-widest text-muted-foreground">
          <span>SREE SUPER MART Coimbatore</span>
          <span>·</span>
          <span>{title}</span>
        </nav>
        <h1 className="font-display text-base font-bold leading-tight">{title}</h1>
      </div>

      <button
        onClick={() => setCommandOpen(true)}
        className="ml-auto flex h-10 w-full max-w-md items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-3 text-sm text-muted-foreground transition-colors hover:bg-card md:ml-6"
      >
        <Search className="h-4 w-4" />
        <span className="hidden sm:inline">Search products, orders, customers…</span>
        <span className="sm:hidden">Search</span>
        <kbd className="ml-auto hidden rounded border border-border/60 bg-muted px-1.5 py-0.5 text-[10px] font-medium sm:inline">
          ⌘K
        </kbd>
      </button>

      <div className="ml-auto flex items-center gap-1.5">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Quick actions">
              <Plus className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Create</DropdownMenuLabel>
            <DropdownMenuItem><Link to="/admin/products" className="flex-1">New product</Link></DropdownMenuItem>
            <DropdownMenuItem><Link to="/admin/orders" className="flex-1">New order</Link></DropdownMenuItem>
            <DropdownMenuItem><Link to="/admin/customers" className="flex-1">New customer</Link></DropdownMenuItem>
            <DropdownMenuItem><Link to="/admin/suppliers" className="flex-1">New supplier</Link></DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Theme">
              {theme === "dark" ? <Moon className="h-5 w-5" /> : theme === "light" ? <Sun className="h-5 w-5" /> : <Monitor className="h-5 w-5" />}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup value={theme} onValueChange={(v) => setTheme(v as never)}>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button variant="ghost" size="icon" aria-label="Help">
          <HelpCircle className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Notifications"
          onClick={() => setNotificationsOpen(true)}
          className="relative"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground">
            3
          </span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 rounded-full border border-border/60 bg-card pl-1 pr-2 py-1 text-left hover:bg-muted">
              <span className="grid h-7 w-7 place-items-center rounded-full bg-primary text-primary-foreground text-xs font-bold">AS</span>
              <span className="hidden text-xs font-semibold sm:inline">Aanya</span>
              <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="text-sm font-semibold">Aanya Sharma</span>
                <span className="text-xs text-muted-foreground">aanya@depart.in</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><User className="mr-2 h-4 w-4" /> Profile</DropdownMenuItem>
            <DropdownMenuItem><Link to="/admin/settings" className="flex flex-1 items-center"><Settings className="mr-2 h-4 w-4" /> Settings</Link></DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className="text-rose-600"><LogOut className="mr-2 h-4 w-4" /> Sign out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}