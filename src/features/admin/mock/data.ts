// Mock data for the DEPART admin ERP. All values are deterministic so the UI
// looks consistent across reloads.

export type AdminOrder = {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: "paid" | "pending" | "shipped" | "delivered" | "refunded" | "cancelled";
  channel: "web" | "app" | "pos";
  createdAt: string;
};

export type AdminProduct = {
  id: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  cost: number;
  stock: number;
  reorder: number;
  status: "active" | "draft" | "archived";
  vendor: string;
  emoji: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  orders: number;
  spend: number;
  tier: "Member" | "Silver" | "Gold" | "Platinum";
  city: string;
  lastSeen: string;
};

export type AdminSupplier = {
  id: string;
  name: string;
  contact: string;
  city: string;
  skus: number;
  onTime: number;
  status: "active" | "paused";
};

export type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: "Owner" | "Admin" | "Manager" | "Staff" | "Viewer";
  status: "active" | "invited" | "disabled";
  lastActive: string;
};

export type AdminNotification = {
  id: string;
  title: string;
  body: string;
  category: "orders" | "inventory" | "customers" | "payments" | "system" | "marketing";
  unread: boolean;
  priority: "low" | "normal" | "high";
  time: string;
};

export type AdminActivity = {
  id: string;
  actor: string;
  action: string;
  target: string;
  time: string;
  type: "order" | "product" | "customer" | "system";
};

const pad = (n: number) => String(n).padStart(4, "0");

const names = [
  "Aarav Sharma","Diya Patel","Vihaan Mehta","Anaya Iyer","Kabir Rao","Ishaan Khan",
  "Saanvi Singh","Aditya Joshi","Myra Reddy","Arjun Verma","Nisha Kapoor","Rohan Gupta",
  "Tara Bose","Kiaan Nair","Aisha Banerjee","Veer Malhotra","Riya Chawla","Yash Desai",
  "Zara Khanna","Dev Pillai","Pari Sethi","Ayaan Bhatia","Mira Kulkarni","Aryan Shetty",
];

const cities = ["Mumbai","Bengaluru","Delhi","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad"];

const productSeeds = [
  { name: "Organic Hass Avocados", emoji: "🥑", category: "Fruits & Veg", price: 189, cost: 110 },
  { name: "Farm Eggs Brown Dozen", emoji: "🥚", category: "Dairy & Eggs", price: 119, cost: 70 },
  { name: "Cold Brew Concentrate", emoji: "☕", category: "Beverages", price: 449, cost: 260 },
  { name: "Sourdough Boule", emoji: "🥖", category: "Bakery", price: 249, cost: 130 },
  { name: "Greek Yogurt", emoji: "🥛", category: "Dairy & Eggs", price: 159, cost: 95 },
  { name: "Atlantic Salmon Fillet", emoji: "🐟", category: "Meat & Seafood", price: 899, cost: 540 },
  { name: "Truffle Olive Oil", emoji: "🫒", category: "Pantry", price: 1299, cost: 760 },
  { name: "Dark Chocolate 70%", emoji: "🍫", category: "Snacks", price: 299, cost: 150 },
  { name: "Heirloom Tomatoes", emoji: "🍅", category: "Fruits & Veg", price: 129, cost: 70 },
  { name: "Single Origin Coffee", emoji: "☕", category: "Beverages", price: 699, cost: 380 },
  { name: "Stone Ground Atta", emoji: "🌾", category: "Pantry", price: 359, cost: 210 },
  { name: "Hand Pressed Tofu", emoji: "🟦", category: "Dairy & Eggs", price: 199, cost: 110 },
  { name: "Almond Butter", emoji: "🥜", category: "Pantry", price: 549, cost: 300 },
  { name: "Kombucha Ginger", emoji: "🧃", category: "Beverages", price: 199, cost: 95 },
  { name: "Free Range Chicken", emoji: "🍗", category: "Meat & Seafood", price: 459, cost: 270 },
  { name: "Quinoa Tri-color", emoji: "🌾", category: "Pantry", price: 429, cost: 230 },
  { name: "Burrata Fresh", emoji: "🧀", category: "Dairy & Eggs", price: 549, cost: 320 },
  { name: "Cherry Tomatoes Punnet", emoji: "🍒", category: "Fruits & Veg", price: 99, cost: 50 },
  { name: "Sea Salt Crisps", emoji: "🥔", category: "Snacks", price: 129, cost: 60 },
  { name: "Matcha Powder", emoji: "🍵", category: "Beverages", price: 1499, cost: 900 },
];

const vendors = ["Farm Fresh", "Blue Tokai", "Country Hen", "Artisan Co.", "Pure Origin", "DEPART Select"];

export const adminProducts: AdminProduct[] = productSeeds.map((p, i) => ({
  id: `P-${pad(1001 + i)}`,
  sku: `SKU-${pad(2001 + i)}`,
  name: p.name,
  emoji: p.emoji,
  category: p.category,
  price: p.price,
  cost: p.cost,
  stock: [120, 4, 0, 56, 230, 12, 87, 18, 9, 145, 220, 32, 67, 41, 6, 95, 23, 312, 178, 14][i],
  reorder: 20,
  status: i % 9 === 0 ? "draft" : "active",
  vendor: vendors[i % vendors.length],
}));

const statuses: AdminOrder["status"][] = ["paid","pending","shipped","delivered","refunded","cancelled"];
const channels: AdminOrder["channel"][] = ["web","app","pos"];

export const adminOrders: AdminOrder[] = Array.from({ length: 32 }, (_, i) => {
  const items = 1 + ((i * 3) % 6);
  const total = 199 + ((i * 173) % 3800);
  const days = i % 14;
  const d = new Date();
  d.setDate(d.getDate() - days);
  return {
    id: `#DPT-${pad(50231 - i)}`,
    customer: names[i % names.length],
    email: `${names[i % names.length].split(" ")[0].toLowerCase()}@example.com`,
    total,
    items,
    status: statuses[i % statuses.length],
    channel: channels[i % channels.length],
    createdAt: d.toISOString(),
  };
});

export const adminCustomers: AdminCustomer[] = names.map((n, i) => ({
  id: `C-${pad(3001 + i)}`,
  name: n,
  email: `${n.split(" ")[0].toLowerCase()}@example.com`,
  orders: 1 + ((i * 7) % 38),
  spend: 1290 + ((i * 731) % 84000),
  tier: (["Member","Silver","Gold","Platinum"] as const)[i % 4],
  city: cities[i % cities.length],
  lastSeen: `${1 + (i % 28)}d ago`,
}));

export const adminSuppliers: AdminSupplier[] = vendors.map((v, i) => ({
  id: `S-${pad(4001 + i)}`,
  name: v,
  contact: `partners@${v.toLowerCase().replace(/[^a-z]+/g, "")}.in`,
  city: cities[i % cities.length],
  skus: 12 + i * 9,
  onTime: 88 + ((i * 3) % 11),
  status: i === 3 ? "paused" : "active",
}));

export const adminUsers: AdminUser[] = [
  { id: "U-001", name: "Aanya Sharma", email: "aanya@depart.in", role: "Owner", status: "active", lastActive: "Just now" },
  { id: "U-002", name: "Rahul Mehta", email: "rahul@depart.in", role: "Admin", status: "active", lastActive: "5m ago" },
  { id: "U-003", name: "Priya Kapoor", email: "priya@depart.in", role: "Manager", status: "active", lastActive: "1h ago" },
  { id: "U-004", name: "Vikram Singh", email: "vikram@depart.in", role: "Staff", status: "active", lastActive: "Yesterday" },
  { id: "U-005", name: "Neha Iyer", email: "neha@depart.in", role: "Staff", status: "invited", lastActive: "—" },
  { id: "U-006", name: "Arjun Rao", email: "arjun@depart.in", role: "Viewer", status: "disabled", lastActive: "30d ago" },
];

export const adminNotifications: AdminNotification[] = [
  { id: "n1", title: "12 new orders in the last hour", body: "Spike in Mumbai zone — fulfillment is on track.", category: "orders", unread: true, priority: "high", time: "2m" },
  { id: "n2", title: "Low stock alert", body: "Burrata Fresh dropped below the reorder threshold.", category: "inventory", unread: true, priority: "high", time: "18m" },
  { id: "n3", title: "Payout settled", body: "₹3,42,910 deposited to HDFC ••4421.", category: "payments", unread: true, priority: "normal", time: "1h" },
  { id: "n4", title: "Diya Patel reached Platinum", body: "Lifetime spend crossed ₹1,00,000.", category: "customers", unread: false, priority: "normal", time: "3h" },
  { id: "n5", title: "Campaign live: Monsoon Picks", body: "Sent to 18,420 subscribers. CTR tracking on.", category: "marketing", unread: false, priority: "low", time: "Yesterday" },
  { id: "n6", title: "Backup completed", body: "Nightly snapshot stored in Mumbai region.", category: "system", unread: false, priority: "low", time: "Yesterday" },
];

export const adminActivities: AdminActivity[] = [
  { id: "a1", actor: "Rahul", action: "fulfilled", target: "#DPT-50231", time: "Just now", type: "order" },
  { id: "a2", actor: "Priya", action: "updated price for", target: "Cold Brew Concentrate", time: "12m ago", type: "product" },
  { id: "a3", actor: "System", action: "auto-archived", target: "9 expired coupons", time: "1h ago", type: "system" },
  { id: "a4", actor: "Vikram", action: "approved refund for", target: "#DPT-50189", time: "2h ago", type: "order" },
  { id: "a5", actor: "Aanya", action: "invited", target: "neha@depart.in", time: "Yesterday", type: "customer" },
  { id: "a6", actor: "Priya", action: "imported", target: "42 SKUs from Pure Origin", time: "Yesterday", type: "product" },
];

// Revenue series — last 12 months
export const revenueSeries = [
  { month: "Jul", revenue: 412000, orders: 1840, profit: 92000 },
  { month: "Aug", revenue: 489000, orders: 2120, profit: 108000 },
  { month: "Sep", revenue: 521000, orders: 2280, profit: 121000 },
  { month: "Oct", revenue: 612000, orders: 2640, profit: 148000 },
  { month: "Nov", revenue: 738000, orders: 3010, profit: 182000 },
  { month: "Dec", revenue: 894000, orders: 3640, profit: 224000 },
  { month: "Jan", revenue: 712000, orders: 2960, profit: 168000 },
  { month: "Feb", revenue: 689000, orders: 2840, profit: 159000 },
  { month: "Mar", revenue: 802000, orders: 3220, profit: 198000 },
  { month: "Apr", revenue: 921000, orders: 3680, profit: 232000 },
  { month: "May", revenue: 1042000, orders: 4120, profit: 268000 },
  { month: "Jun", revenue: 1184000, orders: 4520, profit: 308000 },
];

export const weeklySales = [
  { day: "Mon", sales: 142 },
  { day: "Tue", sales: 168 },
  { day: "Wed", sales: 191 },
  { day: "Thu", sales: 174 },
  { day: "Fri", sales: 223 },
  { day: "Sat", sales: 312 },
  { day: "Sun", sales: 284 },
];

export const categoryMix = [
  { name: "Fruits & Veg", value: 32 },
  { name: "Dairy & Eggs", value: 21 },
  { name: "Pantry", value: 18 },
  { name: "Beverages", value: 14 },
  { name: "Snacks", value: 9 },
  { name: "Meat & Seafood", value: 6 },
];

export const conversionFunnel = [
  { stage: "Sessions", value: 124820 },
  { stage: "Product views", value: 68210 },
  { stage: "Add to cart", value: 21940 },
  { stage: "Checkout", value: 9120 },
  { stage: "Purchases", value: 6480 },
];

export const tasks = [
  { id: "t1", title: "Review September P&L", done: false, due: "Today" },
  { id: "t2", title: "Approve Pure Origin PO #88", done: false, due: "Today" },
  { id: "t3", title: "Publish 'Monsoon Picks' bundle", done: true, due: "Yesterday" },
  { id: "t4", title: "Audit low-stock SKUs", done: false, due: "Tomorrow" },
];

export const announcements = [
  { id: "an1", title: "Q3 OKRs published", body: "Revenue 4.2 Cr · NPS 62 · Retention 38%", date: "Jun 24" },
  { id: "an2", title: "New dark warehouse online", body: "Andheri W. fulfillment goes live next Monday.", date: "Jun 22" },
];

export const goals = [
  { label: "Monthly revenue", value: 1184000, target: 1500000 },
  { label: "New customers", value: 2310, target: 3000 },
  { label: "Repeat rate", value: 38, target: 45 },
];
