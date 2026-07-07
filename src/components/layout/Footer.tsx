import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Youtube } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "Flash Sale", to: "/shop" },
      { label: "Today's Deals", to: "/shop" },
      { label: "Brands", to: "/shop" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Orders", to: "/" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Wallet & Coupons", to: "/" },
      { label: "Addresses", to: "/" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SREE SUPER MART", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Press", to: "/" },
      { label: "Sustainability", to: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Customer Support", to: "/" },
      { label: "Returns & Refunds", to: "/" },
      { label: "Delivery Info", to: "/" },
      { label: "Privacy Policy", to: "/" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">D</span>
              SREE SUPER MART
            </Link>
            <p className="max-w-xs text-sm text-background/70">
              India's most thoughtful supermarket. Fresh produce, premium pantry, delivered in minutes.
            </p>
            <div className="flex gap-2 pt-2">
              {[Instagram, Twitter, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="grid h-9 w-9 place-items-center rounded-full bg-background/10 text-background transition hover:bg-primary"
                  aria-label="Social link"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>
          {cols.map((col) => (
            <div key={col.title}>
              <h3 className="mb-4 font-display text-sm font-bold uppercase tracking-wider text-background/90">
                {col.title}
              </h3>
              <ul className="space-y-2.5">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <Link
                      to={l.to}
                      className="text-sm text-background/65 transition hover:text-primary"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-background/10 pt-6 text-xs text-background/50 sm:flex-row sm:items-center">
          <div>© {new Date().getFullYear()} SREE SUPER MART Retail Pvt. Ltd. All rights reserved.</div>
          <div className="flex gap-4">
            <a href="#" className="hover:text-background">Terms</a>
            <a href="#" className="hover:text-background">Privacy</a>
            <a href="#" className="hover:text-background">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}