import { Link, useRouterState } from "@tanstack/react-router";
import { Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useCartCount } from "@/store/cart";
import { useUI } from "@/store/ui";

type NavItem = {
  to: "/" | "/shop" | "/wishlist" | "/cart";
  label: string;
  icon: typeof Home;
  badge?: boolean;
};

const items: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/shop", label: "Shop", icon: Search },
  { to: "/wishlist", label: "Saved", icon: Heart },
  { to: "/cart", label: "Cart", icon: ShoppingBag, badge: true },
  { to: "/", label: "Account", icon: User },
];

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = useCartCount();
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border glass-strong md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 px-2 py-2">
        {items.map(({ to, label, icon: Icon, badge }) => {
          const active = pathname === to;
          const onClick =
            label === "Shop" ? (e: React.MouseEvent) => { e.preventDefault(); setSearchOpen(true); } : undefined;
          return (
            <Link
              key={label}
              to={to}
              onClick={onClick}
              className={cn(
                "relative flex flex-col items-center gap-1 rounded-xl py-1.5 text-[10px] font-medium transition",
                active ? "text-primary" : "text-foreground/60 hover:text-foreground",
              )}
            >
              <Icon className="h-5 w-5" />
              {label}
              {badge && cartCount > 0 && (
                <span className="absolute right-3 top-0 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                  {cartCount}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}