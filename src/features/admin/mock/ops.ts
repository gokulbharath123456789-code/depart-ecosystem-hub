// Phase 5 — Fulfillment, Delivery, CRM, Loyalty, Marketing, Returns, Support
// Deterministic mock data so the UI feels alive without a backend.

const rand = (seed: number) => {
  let s = seed % 2147483647;
  return () => ((s = (s * 48271) % 2147483647) / 2147483647);
};
const pick = <T,>(arr: T[], r: () => number) => arr[Math.floor(r() * arr.length)];

export type FulfillStatus =
  | "new"
  | "payment-pending"
  | "confirmed"
  | "picking"
  | "packing"
  | "ready"
  | "assigned"
  | "out-for-delivery"
  | "delivered"
  | "cancelled"
  | "returned"
  | "refunded";

export const FULFILL_STATUSES: { key: FulfillStatus; label: string; tone: string }[] = [
  { key: "new", label: "New", tone: "bg-sky-500/10 text-sky-600 ring-sky-500/20" },
  { key: "payment-pending", label: "Payment pending", tone: "bg-amber-500/10 text-amber-600 ring-amber-500/20" },
  { key: "confirmed", label: "Confirmed", tone: "bg-primary/10 text-primary ring-primary/20" },
  { key: "picking", label: "Picking", tone: "bg-violet-500/10 text-violet-600 ring-violet-500/20" },
  { key: "packing", label: "Packing", tone: "bg-indigo-500/10 text-indigo-600 ring-indigo-500/20" },
  { key: "ready", label: "Ready", tone: "bg-emerald-500/10 text-emerald-600 ring-emerald-500/20" },
  { key: "assigned", label: "Assigned", tone: "bg-teal-500/10 text-teal-600 ring-teal-500/20" },
  { key: "out-for-delivery", label: "Out for delivery", tone: "bg-orange-500/10 text-orange-600 ring-orange-500/20" },
  { key: "delivered", label: "Delivered", tone: "bg-emerald-600/10 text-emerald-700 ring-emerald-600/20" },
  { key: "cancelled", label: "Cancelled", tone: "bg-rose-500/10 text-rose-600 ring-rose-500/20" },
  { key: "returned", label: "Returned", tone: "bg-rose-400/10 text-rose-500 ring-rose-400/20" },
  { key: "refunded", label: "Refunded", tone: "bg-fuchsia-500/10 text-fuchsia-600 ring-fuchsia-500/20" },
];

export type Priority = "standard" | "express" | "scheduled" | "vip";
export type Channel = "web" | "app" | "pos" | "phone";
export type Tier = "Silver" | "Gold" | "Platinum";

export type OpsCustomer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  joined: string;
  tier: Tier;
  points: number;
  ltv: number;
  orders: number;
  wallet: number;
  segment: "VIP" | "Loyal" | "Regular" | "New" | "At Risk";
  tags: string[];
  favoriteCategories: string[];
  marketingOptIn: { email: boolean; sms: boolean; push: boolean; whatsapp: boolean };
};

export type OpsOrder = {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  items: { name: string; qty: number; price: number; sku: string }[];
  itemsCount: number;
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
  paid: number;
  paymentMethod: "UPI" | "Card" | "COD" | "Wallet" | "NetBanking";
  status: FulfillStatus;
  priority: Priority;
  channel: Channel;
  placedAt: string;
  slot: string;
  assignedTo?: string;
  driverId?: string;
  notes?: string;
};

export type OpsDriver = {
  id: string;
  name: string;
  phone: string;
  vehicle: "Bike" | "EV Bike" | "Van" | "Cycle";
  plate: string;
  zone: string;
  rating: number;
  trips: number;
  onTime: number;
  active: boolean;
  status: "available" | "on-delivery" | "off-duty" | "break";
  cashCollected: number;
  deliveriesToday: number;
  avatar: string;
};

export type OpsReturn = {
  id: string;
  orderId: string;
  customer: string;
  product: string;
  qty: number;
  reason: string;
  status: "requested" | "inspection" | "approved" | "rejected" | "pickup" | "refunded" | "replaced" | "exchanged";
  refundMethod: "store-credit" | "original" | "wallet";
  amount: number;
  createdAt: string;
  images?: string[];
};

export type OpsTicket = {
  id: string;
  subject: string;
  customer: string;
  category: "Order" | "Refund" | "Delivery" | "Account" | "Product" | "Other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "pending" | "resolved" | "closed" | "escalated";
  assignee: string;
  createdAt: string;
  updatedAt: string;
  satisfaction?: number;
  messages: { from: "customer" | "agent" | "system"; text: string; at: string }[];
};

export type OpsCampaign = {
  id: string;
  name: string;
  type: "Coupon" | "Flash Sale" | "Combo" | "Banner" | "Push" | "Email" | "SMS" | "WhatsApp";
  status: "draft" | "scheduled" | "live" | "paused" | "ended";
  audience: string;
  reach: number;
  conversions: number;
  revenue: number;
  startAt: string;
  endAt: string;
};

export type OpsCoupon = {
  id: string;
  code: string;
  type: "%" | "₹" | "BOGO" | "Free Ship";
  value: number;
  minOrder: number;
  usage: number;
  cap: number;
  expires: string;
  status: "active" | "scheduled" | "paused" | "expired";
};

export type OpsRoute = {
  id: string;
  zone: string;
  driverId: string;
  stops: number;
  distanceKm: number;
  etaMins: number;
  orders: number;
  status: "planned" | "in-progress" | "completed";
};

export type OpsComm = {
  id: string;
  customerId: string;
  channel: "email" | "sms" | "whatsapp" | "push" | "call";
  direction: "out" | "in";
  subject: string;
  at: string;
  status: "sent" | "delivered" | "read" | "failed";
};

export type WorkflowStep = {
  id: string;
  type: "trigger" | "condition" | "action";
  label: string;
  icon: string;
};
export type Workflow = {
  id: string;
  name: string;
  description: string;
  status: "active" | "paused" | "draft";
  runs: number;
  lastRun: string;
  steps: WorkflowStep[];
};

// ───────────────── Generators ─────────────────

const FIRST = ["Aarav", "Vihaan", "Aditya", "Vivaan", "Arjun", "Reyansh", "Ayaan", "Atharv", "Krishna", "Ishaan", "Rohan", "Kabir", "Aanya", "Diya", "Saanvi", "Myra", "Aadhya", "Anika", "Pari", "Nisha", "Riya", "Tara", "Ira", "Zoya"];
const LAST = ["Sharma", "Verma", "Patel", "Iyer", "Reddy", "Khan", "Singh", "Nair", "Mehta", "Kapoor", "Shah", "Joshi", "Gupta", "Rao", "Pillai", "Das", "Sen", "Bose"];
const CITIES = ["Coimbatore", "Bengaluru", "Delhi", "Pune", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Jaipur", "Surat"];
const ZONES = ["Bandra West", "Andheri East", "Powai", "Worli", "Lower Parel", "Juhu", "Goregaon", "Malad", "Vile Parle"];
const PRODUCTS = ["Tomato 1kg", "Onion 1kg", "Amul Butter 500g", "Tata Salt 1kg", "Aashirvaad Atta 5kg", "Maggi 8-pack", "Coca-Cola 1L", "Britannia Bread", "Mother Dairy Milk 1L", "Eggs (12)", "Basmati Rice 5kg", "Olive Oil 1L", "Lays Magic Masala", "Cadbury Dairy Milk", "Bananas 1 dz", "Apples 1kg", "Curd 1kg", "Paneer 200g", "Chicken 1kg", "Coffee 200g"];
const CATS = ["Dairy & Eggs", "Fruits & Vegetables", "Snacks", "Beverages", "Bakery", "Staples", "Meat & Fish", "Personal Care"];
const TAGS = ["VIP", "Bulk Buyer", "Wholesale", "Family", "Health Conscious", "Frequent Returner", "Premium", "Subscriber"];

function makeName(r: () => number) {
  return `${pick(FIRST, r)} ${pick(LAST, r)}`;
}
function pad(n: number, l: number) {
  return n.toString().padStart(l, "0");
}
function daysAgo(d: number) {
  return new Date(Date.now() - d * 86_400_000).toISOString();
}
function hoursAgo(h: number) {
  return new Date(Date.now() - h * 3_600_000).toISOString();
}

// Customers — 100
const customerRand = rand(20260629);
export const opsCustomers: OpsCustomer[] = Array.from({ length: 100 }).map((_, i) => {
  const r = customerRand;
  const name = makeName(r);
  const orders = Math.floor(r() * 60) + 1;
  const ltv = Math.floor(orders * (800 + r() * 3200));
  const tier: Tier = ltv > 80000 ? "Platinum" : ltv > 30000 ? "Gold" : "Silver";
  const segment: OpsCustomer["segment"] = ltv > 100000 ? "VIP" : orders > 15 ? "Loyal" : orders > 5 ? "Regular" : i % 7 === 0 ? "At Risk" : "New";
  return {
    id: `CUS-${pad(1000 + i, 4)}`,
    name,
    email: name.toLowerCase().replace(" ", ".") + "@example.com",
    phone: `+91 9${pad(Math.floor(r() * 1e9), 9).slice(0, 9)}`,
    city: pick(CITIES, r),
    joined: daysAgo(Math.floor(r() * 720)),
    tier,
    points: Math.floor(ltv / 10),
    ltv,
    orders,
    wallet: Math.floor(r() * 4000),
    segment,
    tags: Array.from({ length: 1 + Math.floor(r() * 3) }, () => pick(TAGS, r)),
    favoriteCategories: Array.from({ length: 2 + Math.floor(r() * 3) }, () => pick(CATS, r)),
    marketingOptIn: { email: r() > 0.2, sms: r() > 0.3, push: r() > 0.25, whatsapp: r() > 0.4 },
  };
});

// Drivers — 25
const driverRand = rand(77013);
const VEH = ["Bike", "EV Bike", "Van", "Cycle"] as const;
const DRIVER_STATUS = ["available", "on-delivery", "off-duty", "break"] as const;
export const opsDrivers: OpsDriver[] = Array.from({ length: 25 }).map((_, i) => {
  const r = driverRand;
  const name = makeName(r);
  return {
    id: `DRV-${pad(100 + i, 3)}`,
    name,
    phone: `+91 9${pad(Math.floor(r() * 1e9), 9).slice(0, 9)}`,
    vehicle: pick([...VEH], r),
    plate: `MH-${1 + Math.floor(r() * 99)} ${String.fromCharCode(65 + Math.floor(r() * 26))}${String.fromCharCode(65 + Math.floor(r() * 26))} ${1000 + Math.floor(r() * 8999)}`,
    zone: pick(ZONES, r),
    rating: +(4 + r()).toFixed(1),
    trips: 200 + Math.floor(r() * 1800),
    onTime: Math.floor(85 + r() * 14),
    active: r() > 0.15,
    status: pick([...DRIVER_STATUS], r),
    cashCollected: Math.floor(r() * 12000),
    deliveriesToday: Math.floor(r() * 18),
    avatar: name.split(" ").map((n) => n[0]).join(""),
  };
});

// Orders — 500
const orderRand = rand(31415);
const PAYMENTS = ["UPI", "Card", "COD", "Wallet", "NetBanking"] as const;
const CHANNELS = ["web", "app", "pos", "phone"] as const;
const PRIORITIES = ["standard", "express", "scheduled", "vip"] as const;
const STATUSES: FulfillStatus[] = ["new", "payment-pending", "confirmed", "picking", "packing", "ready", "assigned", "out-for-delivery", "delivered", "delivered", "delivered", "cancelled", "returned", "refunded"];
const SLOTS = ["10–11 AM", "11 AM–12 PM", "12–1 PM", "2–3 PM", "4–5 PM", "6–7 PM", "8–9 PM"];

export const opsOrders: OpsOrder[] = Array.from({ length: 500 }).map((_, i) => {
  const r = orderRand;
  const customer = opsCustomers[Math.floor(r() * opsCustomers.length)];
  const itemsCount = 1 + Math.floor(r() * 8);
  const items = Array.from({ length: itemsCount }).map(() => ({
    name: pick(PRODUCTS, r),
    qty: 1 + Math.floor(r() * 4),
    price: Math.floor(40 + r() * 600),
    sku: `SKU-${pad(Math.floor(r() * 9999), 4)}`,
  }));
  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const shipping = r() > 0.6 ? 0 : 29;
  const tax = Math.round(subtotal * 0.05);
  const total = subtotal + shipping + tax;
  const status = pick(STATUSES, r);
  const driver = status === "out-for-delivery" || status === "delivered" || status === "assigned" ? opsDrivers[Math.floor(r() * opsDrivers.length)] : undefined;
  return {
    id: `ORD-${pad(20250 + i, 5)}`,
    customerId: customer.id,
    customer: customer.name,
    email: customer.email,
    phone: customer.phone,
    address: `${1 + Math.floor(r() * 80)}, ${pick(ZONES, r)} Block ${String.fromCharCode(65 + Math.floor(r() * 8))}`,
    city: customer.city,
    pincode: `${400000 + Math.floor(r() * 99999)}`,
    items,
    itemsCount,
    subtotal,
    shipping,
    tax,
    total,
    paid: status === "payment-pending" || status === "cancelled" ? 0 : total,
    paymentMethod: pick([...PAYMENTS], r),
    status,
    priority: pick([...PRIORITIES], r),
    channel: pick([...CHANNELS], r),
    placedAt: hoursAgo(Math.floor(r() * 480)),
    slot: pick(SLOTS, r),
    assignedTo: r() > 0.4 ? makeName(r) : undefined,
    driverId: driver?.id,
    notes: r() > 0.7 ? "Ring doorbell twice. Leave at door if no answer." : undefined,
  };
});

// Returns — 120
const returnRand = rand(98765);
const REASONS = ["Damaged on arrival", "Wrong item", "Expired", "Quality issue", "Not as described", "Changed mind", "Late delivery"];
const R_STATUS = ["requested", "inspection", "approved", "rejected", "pickup", "refunded", "replaced", "exchanged"] as const;
const R_METHOD = ["store-credit", "original", "wallet"] as const;
export const opsReturns: OpsReturn[] = Array.from({ length: 120 }).map((_, i) => {
  const r = returnRand;
  const order = opsOrders[Math.floor(r() * opsOrders.length)];
  return {
    id: `RET-${pad(7000 + i, 4)}`,
    orderId: order.id,
    customer: order.customer,
    product: pick(PRODUCTS, r),
    qty: 1 + Math.floor(r() * 3),
    reason: pick(REASONS, r),
    status: pick([...R_STATUS], r),
    refundMethod: pick([...R_METHOD], r),
    amount: Math.floor(120 + r() * 3200),
    createdAt: hoursAgo(Math.floor(r() * 720)),
  };
});

// Tickets — 60
const ticketRand = rand(54321);
const T_CAT = ["Order", "Refund", "Delivery", "Account", "Product", "Other"] as const;
const T_PRIO = ["low", "medium", "high", "urgent"] as const;
const T_STATUS = ["open", "pending", "resolved", "closed", "escalated"] as const;
const T_SUBJ = ["Order missing items", "Wrong product delivered", "Refund not received", "Driver was late", "Damaged packaging", "Need to update address", "Payment failed but money debited", "Cancel my subscription", "Coupon not applied", "Quality below expectation"];
export const opsTickets: OpsTicket[] = Array.from({ length: 60 }).map((_, i) => {
  const r = ticketRand;
  const c = opsCustomers[Math.floor(r() * opsCustomers.length)];
  const status = pick([...T_STATUS], r);
  return {
    id: `TKT-${pad(3000 + i, 4)}`,
    subject: pick(T_SUBJ, r),
    customer: c.name,
    category: pick([...T_CAT], r),
    priority: pick([...T_PRIO], r),
    status,
    assignee: makeName(r),
    createdAt: hoursAgo(Math.floor(r() * 240)),
    updatedAt: hoursAgo(Math.floor(r() * 24)),
    satisfaction: status === "resolved" || status === "closed" ? Math.floor(3 + r() * 3) : undefined,
    messages: [
      { from: "customer", text: "Hi team, I need help with my order. Please look into this asap.", at: hoursAgo(48) },
      { from: "agent", text: "Thanks for reaching out. We're checking with our fulfillment team and will revert in 2 hours.", at: hoursAgo(46) },
      { from: "system", text: "Ticket auto-assigned to " + makeName(r), at: hoursAgo(45) },
      { from: "agent", text: "Update — we've initiated a refund of ₹" + Math.floor(200 + r() * 1800) + " to your original payment method.", at: hoursAgo(12) },
    ],
  };
});

// Campaigns
export const opsCampaigns: OpsCampaign[] = [
  { id: "CAM-001", name: "Monsoon Mega Sale", type: "Flash Sale", status: "live", audience: "All shoppers", reach: 42180, conversions: 3812, revenue: 1820000, startAt: daysAgo(2), endAt: daysAgo(-3) },
  { id: "CAM-002", name: "Welcome 100", type: "Coupon", status: "live", audience: "New users", reach: 18420, conversions: 2310, revenue: 615000, startAt: daysAgo(30), endAt: daysAgo(-30) },
  { id: "CAM-003", name: "Weekend Combo Pack", type: "Combo", status: "scheduled", audience: "Loyal", reach: 0, conversions: 0, revenue: 0, startAt: daysAgo(-3), endAt: daysAgo(-10) },
  { id: "CAM-004", name: "Festive Banner", type: "Banner", status: "paused", audience: "Homepage", reach: 91200, conversions: 1180, revenue: 320000, startAt: daysAgo(14), endAt: daysAgo(-7) },
  { id: "CAM-005", name: "WhatsApp Re-engagement", type: "WhatsApp", status: "draft", audience: "At Risk", reach: 0, conversions: 0, revenue: 0, startAt: daysAgo(-7), endAt: daysAgo(-14) },
  { id: "CAM-006", name: "Push: Flash Drop", type: "Push", status: "ended", audience: "App users", reach: 28140, conversions: 1620, revenue: 410000, startAt: daysAgo(40), endAt: daysAgo(35) },
  { id: "CAM-007", name: "Newsletter — June Picks", type: "Email", status: "live", audience: "Subscribers", reach: 24800, conversions: 980, revenue: 245000, startAt: daysAgo(7), endAt: daysAgo(-7) },
  { id: "CAM-008", name: "SMS — Cart Recovery", type: "SMS", status: "live", audience: "Cart abandoners", reach: 6210, conversions: 612, revenue: 158000, startAt: daysAgo(10), endAt: daysAgo(-10) },
];

// Coupons
export const opsCoupons: OpsCoupon[] = [
  { id: "CPN-1", code: "WELCOME100", type: "₹", value: 100, minOrder: 499, usage: 2310, cap: 5000, expires: daysAgo(-30), status: "active" },
  { id: "CPN-2", code: "MONSOON20", type: "%", value: 20, minOrder: 999, usage: 1842, cap: 4000, expires: daysAgo(-7), status: "active" },
  { id: "CPN-3", code: "FREESHIP", type: "Free Ship", value: 0, minOrder: 299, usage: 5421, cap: 10000, expires: daysAgo(-60), status: "active" },
  { id: "CPN-4", code: "BOGOSNACK", type: "BOGO", value: 1, minOrder: 199, usage: 920, cap: 2000, expires: daysAgo(-14), status: "active" },
  { id: "CPN-5", code: "VIP500", type: "₹", value: 500, minOrder: 2999, usage: 120, cap: 500, expires: daysAgo(-21), status: "scheduled" },
  { id: "CPN-6", code: "DIWALI25", type: "%", value: 25, minOrder: 1499, usage: 0, cap: 5000, expires: daysAgo(-120), status: "scheduled" },
  { id: "CPN-7", code: "FRESH10", type: "%", value: 10, minOrder: 0, usage: 9810, cap: 10000, expires: daysAgo(15), status: "expired" },
];

// Routes
const routeRand = rand(11221);
export const opsRoutes: OpsRoute[] = Array.from({ length: 12 }).map((_, i) => {
  const r = routeRand;
  const driver = opsDrivers[i % opsDrivers.length];
  return {
    id: `RT-${pad(500 + i, 3)}`,
    zone: pick(ZONES, r),
    driverId: driver.id,
    stops: 6 + Math.floor(r() * 14),
    distanceKm: +(8 + r() * 30).toFixed(1),
    etaMins: 60 + Math.floor(r() * 180),
    orders: 4 + Math.floor(r() * 16),
    status: pick(["planned", "in-progress", "completed"] as const, r),
  };
});

// Communication logs
const commRand = rand(8821);
const CHANS = ["email", "sms", "whatsapp", "push", "call"] as const;
const SUBJ = ["Order confirmation", "Out for delivery", "Delivery confirmed", "Refund initiated", "Reorder reminder", "Welcome aboard", "Cart abandoned — 10% off"];
export const opsComms: OpsComm[] = Array.from({ length: 80 }).map((_, i) => {
  const r = commRand;
  const c = opsCustomers[Math.floor(r() * opsCustomers.length)];
  return {
    id: `COM-${pad(i + 1, 4)}`,
    customerId: c.id,
    channel: pick([...CHANS], r),
    direction: r() > 0.85 ? "in" : "out",
    subject: pick(SUBJ, r),
    at: hoursAgo(Math.floor(r() * 480)),
    status: pick(["sent", "delivered", "read", "failed"] as const, r),
  };
});

// Workflows
export const opsWorkflows: Workflow[] = [
  {
    id: "WF-001",
    name: "Order paid → Move to picking",
    description: "Auto-move new paid orders into the picking queue.",
    status: "active",
    runs: 4812,
    lastRun: hoursAgo(0.2),
    steps: [
      { id: "s1", type: "trigger", label: "Order payment captured", icon: "CreditCard" },
      { id: "s2", type: "condition", label: "Stock available in all items", icon: "Boxes" },
      { id: "s3", type: "action", label: "Move to Picking queue", icon: "PackageCheck" },
      { id: "s4", type: "action", label: "Notify warehouse team", icon: "Bell" },
    ],
  },
  {
    id: "WF-002",
    name: "Low stock → Create purchase order",
    description: "Auto-draft a PO to the preferred supplier when stock falls below reorder level.",
    status: "active",
    runs: 184,
    lastRun: hoursAgo(3),
    steps: [
      { id: "s1", type: "trigger", label: "Stock < reorder level", icon: "AlertTriangle" },
      { id: "s2", type: "condition", label: "No open PO for SKU", icon: "ClipboardList" },
      { id: "s3", type: "action", label: "Create PO draft", icon: "FileText" },
      { id: "s4", type: "action", label: "Notify procurement", icon: "Mail" },
    ],
  },
  {
    id: "WF-003",
    name: "Packing complete → Assign delivery",
    description: "Assign the closest available driver in the order's zone.",
    status: "active",
    runs: 3217,
    lastRun: hoursAgo(0.5),
    steps: [
      { id: "s1", type: "trigger", label: "Order marked packed", icon: "Package" },
      { id: "s2", type: "condition", label: "Driver available in zone", icon: "MapPin" },
      { id: "s3", type: "action", label: "Assign driver", icon: "Truck" },
      { id: "s4", type: "action", label: "SMS driver + customer", icon: "MessageSquare" },
    ],
  },
  {
    id: "WF-004",
    name: "Delivered → Send thank you",
    description: "Trigger a thank-you note and loyalty points after delivery.",
    status: "active",
    runs: 12810,
    lastRun: hoursAgo(0.1),
    steps: [
      { id: "s1", type: "trigger", label: "Order delivered", icon: "PackageCheck" },
      { id: "s2", type: "action", label: "Credit loyalty points", icon: "Sparkles" },
      { id: "s3", type: "action", label: "Send WhatsApp thank you", icon: "MessageSquare" },
      { id: "s4", type: "action", label: "Request review (24h delay)", icon: "Star" },
    ],
  },
  {
    id: "WF-005",
    name: "Return requested → Start refund",
    description: "Move return through inspection, then refund automatically when approved.",
    status: "paused",
    runs: 412,
    lastRun: hoursAgo(22),
    steps: [
      { id: "s1", type: "trigger", label: "Return marked approved", icon: "RotateCcw" },
      { id: "s2", type: "action", label: "Refund original payment", icon: "IndianRupee" },
      { id: "s3", type: "action", label: "Notify customer", icon: "Bell" },
    ],
  },
];

// Loyalty tiers
export type LoyaltyTier = { name: Tier; min: number; color: string; perks: string[] };
export const loyaltyTiers: LoyaltyTier[] = [
  { name: "Silver", min: 0, color: "from-slate-300 to-slate-500", perks: ["1× points", "Free shipping over ₹499", "Birthday offer"] },
  { name: "Gold", min: 30000, color: "from-amber-300 to-amber-500", perks: ["1.5× points", "Free shipping always", "Early access", "Anniversary bonus"] },
  { name: "Platinum", min: 80000, color: "from-violet-400 to-fuchsia-500", perks: ["2× points", "Priority delivery slots", "Concierge support", "Exclusive launches", "5% cashback"] },
];

// KB articles
export const kbArticles = [
  { id: "KB1", category: "Orders", title: "How to cancel or modify an order", reads: 8421 },
  { id: "KB2", category: "Delivery", title: "Delivery slots and how scheduling works", reads: 6810 },
  { id: "KB3", category: "Returns", title: "How to start a return or exchange", reads: 5412 },
  { id: "KB4", category: "Wallet", title: "Adding money to SREE SUPER MART Wallet", reads: 3920 },
  { id: "KB5", category: "Loyalty", title: "Earning and redeeming points", reads: 2104 },
  { id: "KB6", category: "Account", title: "Update address & phone number", reads: 1840 },
  { id: "KB7", category: "Payments", title: "Accepted payment methods", reads: 1521 },
  { id: "KB8", category: "Orders", title: "Where is my order?", reads: 9810 },
];

// KPIs / aggregates
export const opsKpis = {
  todayOrders: opsOrders.filter((o) => Date.now() - new Date(o.placedAt).getTime() < 86_400_000).length,
  inProgress: opsOrders.filter((o) => ["picking", "packing", "ready", "assigned", "out-for-delivery"].includes(o.status)).length,
  delivered: opsOrders.filter((o) => o.status === "delivered").length,
  cancelled: opsOrders.filter((o) => o.status === "cancelled").length,
  avgDeliveryMins: 38,
  onTimePct: 94,
  latePct: 5,
  failedPct: 1,
  ordersPerDriver: 14,
  revenuePerRoute: 28_400,
  customerCsat: 4.7,
  deliveryCost: 42,
};

export const deliveriesTrend = Array.from({ length: 14 }).map((_, i) => ({
  day: `${i + 1}`,
  delivered: 80 + Math.floor(Math.sin(i / 2) * 20 + Math.random() * 40),
  failed: 2 + Math.floor(Math.random() * 5),
}));
