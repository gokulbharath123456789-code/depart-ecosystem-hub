import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Search, Heart, ShoppingBag, User, MapPin, ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartCount } from "@/store/cart";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { categories } from "@/mock/categories";
import { useAuth } from "@/features/auth/useAuth";

export function Navbar() {
  const cartCount = useCartCount();
  const wishCount = useWishlist((s) => s.ids.length);
  const setSearchOpen = useUI((s) => s.setSearchOpen);
  const setCartOpen = useUI((s) => s.setCartOpen);
  const { user, loading } = useAuth();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/60 glass-strong">
      {/* Promo strip */}
      <div className="hidden bg-foreground py-1.5 text-center text-[11px] font-medium tracking-wide text-background sm:block">
        Free delivery on orders over ₹499 across Coimbatore · Use code <span className="font-bold text-accent">SREESM50</span> for ₹50 off
      </div>

      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:gap-6 lg:px-6">
        <Link to="/" className="flex items-center gap-2 font-display text-xl font-extrabold tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
            S
          </span>
          <span className="hidden sm:inline">SREE SUPER MART</span>
        </Link>

        <button className="hidden items-center gap-1.5 rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-foreground/80 transition hover:bg-muted/70 md:flex">
          <MapPin className="h-3.5 w-3.5 text-primary" />
          Deliver to <span className="font-semibold">Coimbatore 641001</span>
          <ChevronDown className="h-3.5 w-3.5" />
        </button>

        <button
          onClick={() => setSearchOpen(true)}
          className="group flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-left text-sm text-muted-foreground transition hover:border-primary/60 hover:soft-shadow"
        >
          <Search className="h-4 w-4" />
          <span className="truncate">Search milk, bread, eggs, organic fruit…</span>
          <kbd className="ml-auto hidden rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground md:inline">
            ⌘K
          </kbd>
        </button>

        <div className="flex items-center gap-1">
          <Link
            to="/wishlist"
            className="relative grid h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-muted"
            aria-label="Wishlist"
          >
            <Heart className="h-5 w-5" />
            {wishCount > 0 && (
              <span className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white">
                {wishCount}
              </span>
            )}
          </Link>
          <button
            onClick={() => setCartOpen(true)}
            className="relative hidden h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-muted sm:grid"
            aria-label="Cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {cartCount > 0 && (
              <motion.span
                key={cartCount}
                initial={{ scale: 0.6, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="absolute right-1 top-1 grid h-4 min-w-4 place-items-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground"
              >
                {cartCount}
              </motion.span>
            )}
          </button>
          {user ? (
            <Link
              to="/account"
              aria-label="Account"
              className="hidden h-10 w-10 place-items-center rounded-full text-foreground/80 transition hover:bg-muted md:grid"
            >
              <User className="h-5 w-5" />
            </Link>
          ) : (
            <Link
              to="/auth"
              className="hidden h-10 items-center rounded-full px-3 text-xs font-semibold text-foreground/80 transition hover:bg-muted md:inline-flex"
            >
              {loading ? "…" : "Sign in"}
            </Link>
          )}
          <Button variant="ghost" size="icon" className="rounded-full md:hidden" aria-label="Menu">
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {/* Category strip */}
      <nav className="border-t border-border/60 bg-background/50">
        <div className="mx-auto flex max-w-7xl gap-1 overflow-x-auto px-4 py-2 text-xs font-medium text-foreground/70 lg:px-6 [&::-webkit-scrollbar]:hidden">
          <Link
            to="/shop"
            className="shrink-0 rounded-full px-3 py-1.5 transition hover:bg-muted hover:text-foreground"
          >
            All
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              to="/category/$slug"
              params={{ slug: c.slug }}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 transition hover:bg-muted hover:text-foreground"
            >
              <c.icon className="h-3.5 w-3.5 text-primary" strokeWidth={2.2} />
              {c.name}
            </Link>
          ))}
        </div>
      </nav>
    </header>
  );
}