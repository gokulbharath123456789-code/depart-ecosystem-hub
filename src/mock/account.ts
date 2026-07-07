import type { Product } from "@/types";
import { products } from "./products";

export type OrderStatus =
  | "Pending"
  | "Confirmed"
  | "Packed"
  | "Shipped"
  | "Out for Delivery"
  | "Delivered"
  | "Cancelled"
  | "Returned";

export type OrderItem = { product: Product; qty: number };

export type Order = {
  id: string;
  number: string;
  placedAt: string;
  status: OrderStatus;
  items: OrderItem[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  paymentMethod: "UPI" | "Card" | "COD" | "Wallet";
  addressId: string;
  trackingNumber: string;
  courier: "SREE Express" | "BlueDart" | "Delhivery";
  eta: string;
  timeline: { label: string; at: string; done: boolean }[];
};

export type Address = {
  id: string;
  label: "Home" | "Office" | "Other";
  name: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
};

export type WalletTxn = {
  id: string;
  kind: "credit" | "debit";
  type: "Cashback" | "Refund" | "Top-up" | "Purchase";
  amount: number;
  at: string;
  note: string;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  description: string;
  discount: string;
  minOrder: number;
  expiresAt: string;
  category?: string;
  status: "available" | "used" | "expired";
  progress?: number;
};

export type Invoice = {
  id: string;
  number: string;
  orderId: string;
  date: string;
  amount: number;
  gst: number;
  status: "Paid" | "Refunded";
};

export type ReturnRequest = {
  id: string;
  orderId: string;
  productName: string;
  reason: string;
  status: "Requested" | "Approved" | "Picked up" | "Refunded" | "Rejected";
  createdAt: string;
  refundAmount: number;
};

export type Review = {
  id: string;
  productId: string;
  productName: string;
  rating: number;
  title: string;
  body: string;
  published: boolean;
  helpful: number;
  createdAt: string;
};

export type SupportTicket = {
  id: string;
  subject: string;
  category: "Order" | "Payment" | "Account" | "Other";
  priority: "Low" | "Medium" | "High";
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  createdAt: string;
  messages: { from: "you" | "agent"; body: string; at: string }[];
};

export type Notification = {
  id: string;
  category: "Orders" | "Offers" | "Payments" | "Returns" | "System" | "Promotions";
  title: string;
  body: string;
  at: string;
  read: boolean;
};

export const user = {
  name: "Aarav Mehta",
  email: "aarav.mehta@depart.in",
  phone: "+91 98765 43210",
  avatar: "AM",
  membership: "SREE SUPER MART Gold",
  joinedAt: "2023-08-12",
  points: 4820,
  wallet: 1265,
};

export const addresses: Address[] = [
  {
    id: "a1",
    label: "Home",
    name: "Aarav Mehta",
    phone: "+91 98765 43210",
    line1: "B-12, Sea Breeze Apartments",
    line2: "Carter Road",
    city: "Coimbatore",
    state: "MH",
    pincode: "400050",
    isDefault: true,
  },
  {
    id: "a2",
    label: "Office",
    name: "Aarav Mehta",
    phone: "+91 98765 43210",
    line1: "9th Floor, One BKC",
    line2: "Bandra Kurla Complex",
    city: "Coimbatore",
    state: "MH",
    pincode: "400051",
  },
  {
    id: "a3",
    label: "Other",
    name: "Riya Mehta",
    phone: "+91 99887 70011",
    line1: "404 Lakeview Heights",
    city: "Pune",
    state: "MH",
    pincode: "411014",
  },
];

const STATUSES: OrderStatus[] = [
  "Delivered",
  "Out for Delivery",
  "Shipped",
  "Packed",
  "Confirmed",
  "Pending",
  "Cancelled",
  "Returned",
];

const PAY: Order["paymentMethod"][] = ["UPI", "Card", "COD", "Wallet"];
const COURIERS: Order["courier"][] = ["SREE Express", "BlueDart", "Delhivery"];

function pad(n: number, w = 2) {
  return String(n).padStart(w, "0");
}
function dateOffset(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString();
}
function pseudo(i: number) {
  // deterministic pseudo random
  return ((i * 9301 + 49297) % 233280) / 233280;
}

export const orders: Order[] = Array.from({ length: 28 }, (_, i) => {
  const r = pseudo(i + 1);
  const status = STATUSES[i % STATUSES.length];
  const itemCount = 1 + Math.floor(r * 3);
  const items: OrderItem[] = Array.from({ length: itemCount }, (_, k) => ({
    product: products[(i * 3 + k) % products.length],
    qty: 1 + ((i + k) % 3),
  }));
  const subtotal = items.reduce((a, b) => a + b.product.price * b.qty, 0);
  const delivery = subtotal > 499 ? 0 : 29;
  const discount = Math.round(subtotal * 0.05);
  const total = subtotal + delivery - discount;
  const daysAgo = i * 2 + 1;
  const placedAt = dateOffset(daysAgo);
  const tlSteps = ["Order placed", "Confirmed", "Packed", "Shipped", "Out for Delivery", "Delivered"];
  const reachedIdx = Math.max(
    0,
    tlSteps.findIndex((s) => s === status),
  );
  const timeline = tlSteps.map((label, idx) => ({
    label,
    at: dateOffset(daysAgo - idx),
    done:
      status === "Cancelled" || status === "Returned"
        ? idx < 2
        : idx <= (reachedIdx === -1 ? tlSteps.length - 1 : reachedIdx),
  }));
  return {
    id: `o${pad(i + 1, 3)}`,
    number: `DPT-${10248 + i}`,
    placedAt,
    status,
    items,
    subtotal,
    delivery,
    discount,
    total,
    paymentMethod: PAY[i % PAY.length],
    addressId: addresses[i % addresses.length].id,
    trackingNumber: `TRK${1000000 + i * 137}`,
    courier: COURIERS[i % COURIERS.length],
    eta: dateOffset(-1 * (2 + (i % 3))),
    timeline,
  };
});

export const walletTxns: WalletTxn[] = Array.from({ length: 14 }, (_, i) => {
  const types: WalletTxn["type"][] = ["Cashback", "Refund", "Top-up", "Purchase"];
  const type = types[i % types.length];
  const kind: WalletTxn["kind"] = type === "Purchase" ? "debit" : "credit";
  const amount = [49, 120, 320, 89, 240, 60, 540, 199][i % 8];
  return {
    id: `t${pad(i + 1, 3)}`,
    kind,
    type,
    amount,
    at: dateOffset(i * 3),
    note:
      type === "Cashback"
        ? `Cashback on order DPT-${10248 + i}`
        : type === "Refund"
          ? `Refund for DPT-${10248 + i}`
          : type === "Top-up"
            ? "Top-up via UPI"
            : `Used towards DPT-${10248 + i}`,
  };
});

export const coupons: Coupon[] = [
  { id: "c1", code: "SREESM50", title: "Flat ₹50 off", description: "On orders above ₹499", discount: "₹50", minOrder: 499, expiresAt: dateOffset(-30), status: "available", progress: 80 },
  { id: "c2", code: "FRESH20", title: "20% off Fruits & Veg", description: "Max discount ₹120", discount: "20%", minOrder: 299, expiresAt: dateOffset(-14), status: "available", category: "Fruits & Veg" },
  { id: "c3", code: "DAIRY15", title: "15% off Dairy", description: "Premium dairy brands", discount: "15%", minOrder: 199, expiresAt: dateOffset(-7), status: "available", category: "Dairy" },
  { id: "c4", code: "WELCOME100", title: "Flat ₹100 off", description: "First-time users", discount: "₹100", minOrder: 599, expiresAt: dateOffset(10), status: "used" },
  { id: "c5", code: "WEEKEND10", title: "10% Weekend Special", description: "Saturdays & Sundays", discount: "10%", minOrder: 399, expiresAt: dateOffset(40), status: "expired" },
  { id: "c6", code: "GOLD250", title: "Gold member ₹250 off", description: "Only for Gold members", discount: "₹250", minOrder: 1499, expiresAt: dateOffset(-60), status: "available", progress: 45 },
];

export const invoices: Invoice[] = orders.slice(0, 18).map((o, i) => ({
  id: `inv${pad(i + 1, 3)}`,
  number: `INV-${20250 + i}`,
  orderId: o.id,
  date: o.placedAt,
  amount: o.total,
  gst: Math.round(o.subtotal * 0.05),
  status: o.status === "Returned" || o.status === "Cancelled" ? "Refunded" : "Paid",
}));

export const returns: ReturnRequest[] = [
  { id: "r1", orderId: orders[7].id, productName: orders[7].items[0].product.name, reason: "Product damaged", status: "Approved", createdAt: dateOffset(4), refundAmount: 320 },
  { id: "r2", orderId: orders[12].id, productName: orders[12].items[0].product.name, reason: "Wrong item delivered", status: "Picked up", createdAt: dateOffset(9), refundAmount: 540 },
  { id: "r3", orderId: orders[3].id, productName: orders[3].items[0].product.name, reason: "Quality issue", status: "Refunded", createdAt: dateOffset(20), refundAmount: 199 },
  { id: "r4", orderId: orders[18].id, productName: orders[18].items[0].product.name, reason: "Changed my mind", status: "Requested", createdAt: dateOffset(1), refundAmount: 149 },
  { id: "r5", orderId: orders[5].id, productName: orders[5].items[0].product.name, reason: "Late delivery", status: "Rejected", createdAt: dateOffset(30), refundAmount: 0 },
];

export const reviews: Review[] = [
  { id: "rv1", productId: products[0].id, productName: products[0].name, rating: 5, title: "Best avocados in the city", body: "Always ripe, always fresh. Five stars.", published: true, helpful: 42, createdAt: dateOffset(12) },
  { id: "rv2", productId: products[1].id, productName: products[1].name, rating: 4, title: "Great quality", body: "Will order again. Packaging was excellent.", published: true, helpful: 17, createdAt: dateOffset(25) },
  { id: "rv3", productId: products[2].id, productName: products[2].name, rating: 0, title: "", body: "", published: false, helpful: 0, createdAt: dateOffset(2) },
  { id: "rv4", productId: products[4].id, productName: products[4].name, rating: 0, title: "", body: "", published: false, helpful: 0, createdAt: dateOffset(1) },
  { id: "rv5", productId: products[3].id, productName: products[3].name, rating: 5, title: "Loved it!", body: "Quality is top notch. Highly recommend.", published: true, helpful: 9, createdAt: dateOffset(40) },
];

export const tickets: SupportTicket[] = [
  {
    id: "tk1",
    subject: "Refund for DPT-10251",
    category: "Payment",
    priority: "High",
    status: "In Progress",
    createdAt: dateOffset(2),
    messages: [
      { from: "you", body: "I haven't received my refund yet.", at: dateOffset(2) },
      { from: "agent", body: "We're processing it — expect it within 24 hours.", at: dateOffset(1) },
    ],
  },
  {
    id: "tk2",
    subject: "Wrong item delivered",
    category: "Order",
    priority: "Medium",
    status: "Open",
    createdAt: dateOffset(0),
    messages: [{ from: "you", body: "I received the wrong item with my last order.", at: dateOffset(0) }],
  },
  {
    id: "tk3",
    subject: "Account name update",
    category: "Account",
    priority: "Low",
    status: "Resolved",
    createdAt: dateOffset(15),
    messages: [
      { from: "you", body: "Please change my name on the account.", at: dateOffset(15) },
      { from: "agent", body: "Done — let us know if anything else is needed.", at: dateOffset(14) },
    ],
  },
];

export const notifications: Notification[] = [
  { id: "n1", category: "Orders", title: "Out for delivery", body: "Your order DPT-10248 is out for delivery.", at: dateOffset(0), read: false },
  { id: "n2", category: "Offers", title: "Flat 20% off fruits", body: "Use FRESH20 today only.", at: dateOffset(1), read: false },
  { id: "n3", category: "Payments", title: "Refund credited", body: "₹320 refunded to SREE SUPER MART Wallet.", at: dateOffset(2), read: true },
  { id: "n4", category: "Returns", title: "Return approved", body: "Pickup scheduled for tomorrow.", at: dateOffset(3), read: false },
  { id: "n5", category: "System", title: "Password updated", body: "Your password was changed successfully.", at: dateOffset(5), read: true },
  { id: "n6", category: "Promotions", title: "SREE SUPER MART Gold rewards", body: "You've earned 220 points this week.", at: dateOffset(7), read: true },
  { id: "n7", category: "Orders", title: "Order delivered", body: "DPT-10240 delivered to Home.", at: dateOffset(10), read: true },
  { id: "n8", category: "Offers", title: "Weekend deal", body: "Up to 30% off pantry essentials.", at: dateOffset(11), read: true },
];

export const recentlyViewed: Product[] = [products[2], products[5], products[8], products[11], products[14]].filter(Boolean);
export const recommended: Product[] = [products[1], products[4], products[7], products[10], products[13], products[16]].filter(Boolean);

export const stats = {
  totalOrders: orders.length,
  completed: orders.filter((o) => o.status === "Delivered").length,
  wishlist: 0, // hydrated client-side
  wallet: user.wallet,
  points: user.points,
};

export const loyalty = {
  tier: "Gold",
  nextTier: "Platinum",
  pointsToNext: 1180,
  perks: ["Free express delivery", "Early access to deals", "Birthday cashback", "Priority support"],
};

export function statusColor(status: OrderStatus): string {
  switch (status) {
    case "Delivered":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300";
    case "Out for Delivery":
    case "Shipped":
      return "bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300";
    case "Packed":
    case "Confirmed":
      return "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300";
    case "Pending":
      return "bg-muted text-foreground/70";
    case "Cancelled":
    case "Returned":
      return "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300";
  }
}

export function formatDate(s: string) {
  return new Date(s).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}
export function formatTime(s: string) {
  return new Date(s).toLocaleString("en-IN", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" });
}