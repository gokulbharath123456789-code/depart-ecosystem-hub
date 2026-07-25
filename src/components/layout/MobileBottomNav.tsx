import { Link, useRouterState } from "@tanstack/react-router";
import { Hop as Home, Search, Heart, ShoppingBag, User } from "lucide-react";
import { useCartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { cn } from "@/lib/utils";

type NavItem = {
  to: "/" | "/shop" | "/wishlist" | "/cart" | "/account";
  label: string;
  icon: typeof Home;
  badge?: boolean;
  action?: () => void;
};

export function MobileBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const cartCount = useCartCount();
  const wishCount = useWishlist((s) => s.ids.length);
  const setSearchOpen = useUI((s) => s.setSearchOpen);

  const items: NavItem[] = [
    { to: "/", label: "Home", icon: Home },
    { to: "/shop", label: "Shop", icon: Search },
    { to: "/wishlist", label: "Saved", icon: Heart },
    { to: "/cart", label: "Cart", icon: ShoppingBag, badge: true },
    { to: "/account", label: "Account", icon: User },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur-xl lg:hidden">
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2 py-1.5">
        {items.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
          const count = item.badge ? cartCount : item.label === "Saved" ? wishCount : 0;
          const Icon = item.icon;

          return (
            <Link
              key={item.to}
              to={item.to}
              onClick={item.action}
              className="relative flex flex-1 flex-col items-center gap-1 rounded-xl px-2 py-1.5 transition"
            >
              <span
                className={cn(
                  "relative grid h-7 w-7 place-items-center transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.5 : 2} />
                {count > 0 && (
                  <span className="absolute -right-1.5 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[9px] font-bold text-primary-foreground">
                    {count}
                  </span>
                )}
              </span>
              <span
                className={cn(
                  "text-[10px] font-semibold transition",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                {item.label}
              </span>
              {active && (
                <span className="absolute -top-1 h-0.5 w-8 rounded-full bg-primary" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
