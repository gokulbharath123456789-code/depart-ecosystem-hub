import { Link } from "@tanstack/react-router";
import { Instagram, Twitter, Facebook, Youtube, MapPin, Phone, Mail, Clock } from "lucide-react";

const cols = [
  {
    title: "Shop",
    links: [
      { label: "All Products", to: "/shop" },
      { label: "Today's Deals", to: "/shop" },
      { label: "Fruits & Vegetables", to: "/category/fruits-veg" },
      { label: "Dairy & Eggs", to: "/category/dairy-eggs" },
      { label: "Bakery", to: "/category/bakery" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "My Orders", to: "/account/orders" },
      { label: "Wishlist", to: "/wishlist" },
      { label: "Wallet & Coupons", to: "/account/wallet" },
      { label: "Addresses", to: "/account/addresses" },
      { label: "Settings", to: "/account/settings" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About SREE SUPER MART", to: "/" },
      { label: "Careers", to: "/" },
      { label: "Sustainability", to: "/" },
      { label: "Partner with us", to: "/" },
      { label: "Bulk & wholesale", to: "/" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Customer Support", to: "/account/support" },
      { label: "Returns & Refunds", to: "/account/returns" },
      { label: "Delivery Information", to: "/" },
      { label: "Track your order", to: "/account/tracking" },
      { label: "FAQ", to: "/account/support" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
          {/* Brand + contact */}
          <div className="space-y-5">
            <Link to="/" className="flex items-center gap-2 font-display text-2xl font-extrabold">
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-primary text-primary-foreground">
                S
              </span>
              SREE SUPER MART
            </Link>
            <p className="max-w-xs text-sm text-background/70">
              Coimbatore's trusted neighbourhood supermarket — fresh groceries, honest prices and
              fast delivery, every single day.
            </p>
            <ul className="space-y-2.5 text-sm text-background/70">
              <li className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                42, Trichy Road, R.S. Puram, Coimbatore, Tamil Nadu 641002
              </li>
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 shrink-0 text-primary" />
                +91 422 456 7890
              </li>
              <li className="flex items-center gap-2">
                <Mail className="h-4 w-4 shrink-0 text-primary" />
                care@sreesupermart.in
              </li>
              <li className="flex items-start gap-2">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                Open daily · 6:00 AM – 11:00 PM
              </li>
            </ul>
            <div className="flex gap-2 pt-1">
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

          {/* Link columns */}
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
          <div>© {new Date().getFullYear()} SREE SUPER MART Retail Pvt. Ltd. · All rights reserved.</div>
          <div className="flex flex-wrap gap-4">
            <a href="#" className="hover:text-background">Terms of Service</a>
            <a href="#" className="hover:text-background">Privacy Policy</a>
            <a href="#" className="hover:text-background">Refund Policy</a>
            <a href="#" className="hover:text-background">Cookies</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
