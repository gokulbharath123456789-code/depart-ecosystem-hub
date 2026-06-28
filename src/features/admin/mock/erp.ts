// DEPART V2 — ERP mock dataset. Deterministic, frontend-only.

export type Warehouse = {
  id: string;
  code: string;
  name: string;
  city: string;
  address: string;
  manager: string;
  capacity: number; // pallets
  used: number;
  type: "dark-store" | "fulfillment" | "cold-storage" | "hub";
};

export type ErpProduct = {
  id: string;
  name: string;
  emoji: string;
  sku: string;
  barcode: string;
  brand: string;
  category: string;
  supplier: string;
  unit: string;
  weightKg: number;
  cost: number;
  price: number;
  mrp: number;
  tax: number;
  stock: number;
  reserved: number;
  reorder: number;
  status: "active" | "draft" | "archived";
  updatedAt: string;
  variants: number;
  warehouse: string;
  expiryDays: number;
};

export type MovementType =
  | "purchase"
  | "sale"
  | "return"
  | "damage"
  | "expiry"
  | "adjustment"
  | "transfer";

export type StockMovement = {
  id: string;
  date: string;
  type: MovementType;
  productId: string;
  productName: string;
  emoji: string;
  qty: number;
  warehouse: string;
  reference: string;
  user: string;
  reason: string;
  notes?: string;
};

export type PurchaseOrder = {
  id: string;
  supplier: string;
  status: "draft" | "approved" | "ordered" | "received" | "partial" | "cancelled";
  createdAt: string;
  expectedAt: string;
  warehouse: string;
  items: { productId: string; name: string; emoji: string; qty: number; received: number; cost: number; tax: number }[];
  shipping: number;
  discount: number;
  notes?: string;
  approver?: string;
};

export type Batch = {
  id: string;
  productId: string;
  productName: string;
  emoji: string;
  batchNo: string;
  lotNo: string;
  qty: number;
  mfg: string;
  expiry: string;
  warehouse: string;
};

export type Transfer = {
  id: string;
  from: string;
  to: string;
  status: "pending" | "in-transit" | "received" | "cancelled";
  createdAt: string;
  items: number;
  qty: number;
};

export type AuditEntry = {
  id: string;
  at: string;
  user: string;
  action: string;
  entity: string;
  entityId: string;
  diff?: string;
};

// ──────────── seed helpers ────────────
const pad = (n: number, w = 4) => String(n).padStart(w, "0");
const pick = <T>(arr: readonly T[], i: number) => arr[i % arr.length];

const categories = ["Fruits & Veg","Dairy & Eggs","Pantry","Beverages","Snacks","Meat & Seafood","Bakery","Frozen","Personal Care","Household"];
const brands = ["DEPART Select","Farm Fresh","Blue Tokai","Country Hen","Artisan Co.","Pure Origin","Heritage","Daily Harvest","Mother Dairy","Tata Sampann"];
const supplierNames = ["Farm Fresh Distributors","Blue Tokai Roasters","Country Hen Co.","Artisan Bread Co.","Pure Origin Naturals","Heritage Foods","Daily Harvest Pvt Ltd","Mother Dairy India","Tata Consumer Products","ITC Foods","Britannia Industries","Nestlé India","HUL FMCG","Amul Cooperative","Patanjali Ayurved","Marico Wellness","Dabur India","Adani Wilmar","Cargill Foods","McCain Frozen"];
const cities = ["Mumbai","Bengaluru","Delhi","Pune","Hyderabad","Chennai","Kolkata","Ahmedabad"];
const units = ["pcs","kg","g","L","ml","pack","bottle","box"];
const emojis = ["🥑","🥚","☕","🥖","🥛","🐟","🫒","🍫","🍅","🍵","🌾","🟦","🥜","🧃","🍗","🧀","🍒","🥔","🍵","🍞","🥩","🍎","🍌","🥦","🥕","🥒","🌽","🍇","🍑","🍓","🍋","🥥","🍊","🍐","🍉","🍍","🍆","🌶️","🥬","🍄"];

export const warehouses: Warehouse[] = [
  { id: "W-01", code: "BOM-DK1", name: "Andheri Dark Store", city: "Mumbai", address: "Plot 14, MIDC, Andheri W", manager: "Rahul Mehta", capacity: 1200, used: 894, type: "dark-store" },
  { id: "W-02", code: "BOM-FH1", name: "Bhiwandi Fulfillment Hub", city: "Mumbai", address: "Sonale, Bhiwandi", manager: "Priya Kapoor", capacity: 5400, used: 3290, type: "fulfillment" },
  { id: "W-03", code: "BLR-DK1", name: "Indiranagar Dark Store", city: "Bengaluru", address: "100ft Rd, Indiranagar", manager: "Vikram Singh", capacity: 980, used: 612, type: "dark-store" },
  { id: "W-04", code: "DEL-CS1", name: "Okhla Cold Storage", city: "Delhi", address: "Okhla Phase II", manager: "Neha Iyer", capacity: 2200, used: 1640, type: "cold-storage" },
  { id: "W-05", code: "PNQ-HB1", name: "Hinjewadi Hub", city: "Pune", address: "Phase III, Hinjewadi", manager: "Arjun Rao", capacity: 1800, used: 920, type: "hub" },
];

// 100 ERP products
const PRODUCT_NAMES = [
  "Organic Hass Avocados","Farm Eggs Brown Dozen","Cold Brew Concentrate","Sourdough Boule","Greek Yogurt",
  "Atlantic Salmon Fillet","Truffle Olive Oil","Dark Chocolate 70%","Heirloom Tomatoes","Single Origin Coffee",
  "Stone Ground Atta","Hand Pressed Tofu","Almond Butter","Kombucha Ginger","Free Range Chicken",
  "Quinoa Tri-color","Burrata Fresh","Cherry Tomatoes Punnet","Sea Salt Crisps","Matcha Powder",
  "Himalayan Pink Salt","Extra Virgin Olive Oil","Whole Wheat Pasta","Basmati Rice Premium","Raw Honey 500g",
  "Cashew Milk","Oat Milk Barista","Coconut Water Tender","Cold Pressed Juice","Sparkling Water Lime",
  "Whole Grain Crackers","Hummus Classic","Pesto Genovese","Tomato Passata","Tahini Paste",
  "Maple Syrup Pure","Vanilla Pods Madagascar","Saffron Kashmir 1g","Black Pepper Tellicherry","Cardamom Green",
  "Cinnamon Sticks","Cloves Whole","Cumin Seeds","Coriander Seeds","Mustard Yellow",
  "Turmeric Lakadong","Ginger Fresh","Garlic Peeled","Onion Red","Potato Baby",
  "Bell Peppers Mix","Broccoli Crown","Cauliflower Whole","Spinach Baby","Kale Curly",
  "Romaine Lettuce","Arugula Wild","Mushroom Button","Mushroom Shiitake","Asparagus Green",
  "Zucchini Green","Eggplant Slim","Sweet Corn","Green Beans","Carrot Baby",
  "Apple Royal Gala","Banana Robusta","Pomegranate Bhagwa","Strawberry Punnet","Blueberry Imported",
  "Mango Alphonso","Pineapple Sweet","Watermelon Seedless","Papaya Red","Kiwi Green",
  "Orange Nagpur","Lemon Yellow","Coconut Tender","Dragon Fruit","Avocado Pack of 4",
  "Mozzarella Buffalo","Cheddar Aged","Parmesan Reggiano","Feta Greek","Camembert",
  "Butter Cultured","Ghee A2 Cow","Paneer Fresh","Curd Set 500g","Lassi Sweet",
  "Bread Multigrain","Croissant Butter","Bagel Sesame","Pita Whole Wheat","Tortilla Corn",
  "Pasta Penne","Pasta Spaghetti","Noodles Hakka","Couscous Pearl","Polenta Italian",
];

export const erpProducts: ErpProduct[] = PRODUCT_NAMES.map((name, i) => {
  const cost = 40 + ((i * 37) % 1200);
  const price = Math.round(cost * (1.25 + ((i * 7) % 60) / 100));
  const mrp = Math.round(price * 1.18);
  const stock = [120, 4, 0, 56, 230, 12, 87, 18, 9, 145][i % 10] + ((i * 13) % 80);
  return {
    id: `P-${pad(1001 + i)}`,
    name,
    emoji: pick(emojis, i),
    sku: `SKU-${pad(20001 + i, 5)}`,
    barcode: `890${pad(2300000 + i * 7, 10)}`.slice(0, 13),
    brand: pick(brands, i),
    category: pick(categories, i),
    supplier: pick(supplierNames, i),
    unit: pick(units, i),
    weightKg: Number(((((i * 41) % 280) + 20) / 100).toFixed(2)),
    cost,
    price,
    mrp,
    tax: [0, 5, 12, 18][i % 4],
    stock,
    reserved: Math.min(stock, (i * 3) % 18),
    reorder: 20,
    status: i % 13 === 0 ? "draft" : i % 41 === 0 ? "archived" : "active",
    updatedAt: new Date(Date.now() - i * 3.6e6).toISOString(),
    variants: (i % 5),
    warehouse: warehouses[i % warehouses.length].code,
    expiryDays: [3, 7, 14, 30, 60, 90, 180, 365][i % 8],
  };
});

// Inventory KPI summary
export const inventoryKpis = {
  current: erpProducts.reduce((s, p) => s + p.stock, 0),
  reserved: erpProducts.reduce((s, p) => s + p.reserved, 0),
  incoming: 1840,
  outgoing: 1290,
  damaged: 48,
  expired: 22,
  transferred: 312,
  lowStock: erpProducts.filter((p) => p.stock > 0 && p.stock <= p.reorder).length,
  outOfStock: erpProducts.filter((p) => p.stock === 0).length,
};

// Stock movements
const moveTypes: MovementType[] = ["purchase","sale","return","damage","expiry","adjustment","transfer"];
const moveUsers = ["Aanya Sharma","Rahul Mehta","Priya Kapoor","Vikram Singh","System"];
export const stockMovements: StockMovement[] = Array.from({ length: 60 }, (_, i) => {
  const p = erpProducts[i % erpProducts.length];
  const type = moveTypes[i % moveTypes.length];
  const sign = type === "purchase" || type === "return" || type === "adjustment" ? 1 : -1;
  const d = new Date();
  d.setHours(d.getHours() - i * 7);
  return {
    id: `M-${pad(70001 + i, 5)}`,
    date: d.toISOString(),
    type,
    productId: p.id,
    productName: p.name,
    emoji: p.emoji,
    qty: sign * (1 + ((i * 11) % 28)),
    warehouse: warehouses[i % warehouses.length].code,
    reference: type === "purchase" ? `PO-${pad(8000 + (i % 18), 5)}` : type === "sale" ? `#DPT-${pad(50231 - i)}` : type === "transfer" ? `TR-${pad(900 + (i % 12), 4)}` : `ADJ-${pad(500 + i, 4)}`,
    user: moveUsers[i % moveUsers.length],
    reason: type === "damage" ? "Cold-chain breach" : type === "expiry" ? "Past best-by" : type === "adjustment" ? "Cycle count" : type === "return" ? "Customer return" : type === "transfer" ? "Inter-warehouse rebalance" : "—",
  };
});

// Purchase orders
const poStatuses: PurchaseOrder["status"][] = ["draft","approved","ordered","received","partial","cancelled"];
export const purchaseOrders: PurchaseOrder[] = Array.from({ length: 18 }, (_, i) => {
  const supplier = supplierNames[i % supplierNames.length];
  const itemCount = 3 + (i % 6);
  const items = Array.from({ length: itemCount }, (_, j) => {
    const p = erpProducts[(i * 7 + j * 3) % erpProducts.length];
    const qty = 20 + ((i + j) * 9) % 180;
    return {
      productId: p.id,
      name: p.name,
      emoji: p.emoji,
      qty,
      received: i % 6 === 4 ? Math.floor(qty * 0.6) : i % 6 === 3 ? qty : 0,
      cost: p.cost,
      tax: p.tax,
    };
  });
  const created = new Date(); created.setDate(created.getDate() - i * 2);
  const expected = new Date(); expected.setDate(expected.getDate() + (14 - i));
  return {
    id: `PO-${pad(8000 + i, 5)}`,
    supplier,
    status: poStatuses[i % poStatuses.length],
    createdAt: created.toISOString(),
    expectedAt: expected.toISOString(),
    warehouse: warehouses[i % warehouses.length].code,
    items,
    shipping: 250 + (i % 5) * 80,
    discount: (i % 4) * 500,
    approver: i % 3 === 0 ? "Aanya Sharma" : "Rahul Mehta",
    notes: i % 4 === 0 ? "Priority freight" : undefined,
  };
});

// Suppliers extended (20)
export type ErpSupplier = {
  id: string;
  name: string;
  contact: string;
  phone: string;
  city: string;
  rating: number;
  onTime: number;
  skus: number;
  outstanding: number;
  totalSpend: number;
  lastOrder: string;
  status: "active" | "paused" | "onboarding";
  paymentTerms: string;
};
export const erpSuppliers: ErpSupplier[] = supplierNames.map((n, i) => ({
  id: `S-${pad(4001 + i)}`,
  name: n,
  contact: `partners@${n.toLowerCase().replace(/[^a-z]+/g, "")}.in`,
  phone: `+91 9${pad(800000000 + i * 1733, 9)}`,
  city: cities[i % cities.length],
  rating: Number((3.5 + ((i * 13) % 15) / 10).toFixed(1)),
  onTime: 82 + ((i * 5) % 17),
  skus: 12 + i * 8,
  outstanding: (i % 5 === 0 ? 0 : (i * 18420) % 240000),
  totalSpend: 120000 + ((i * 73210) % 1800000),
  lastOrder: `${1 + (i % 14)}d ago`,
  status: i === 3 ? "paused" : i === 17 ? "onboarding" : "active",
  paymentTerms: ["Net 15","Net 30","Net 45","COD"][i % 4],
}));

// Batches
export const batches: Batch[] = Array.from({ length: 36 }, (_, i) => {
  const p = erpProducts[(i * 5) % erpProducts.length];
  const mfg = new Date(); mfg.setDate(mfg.getDate() - (i * 4 + 5));
  const exp = new Date(mfg); exp.setDate(exp.getDate() + p.expiryDays);
  return {
    id: `B-${pad(60001 + i, 5)}`,
    productId: p.id,
    productName: p.name,
    emoji: p.emoji,
    batchNo: `BCH-${pad(900 + i, 4)}`,
    lotNo: `LOT-${pad(7700 + i, 4)}`,
    qty: 20 + ((i * 11) % 180),
    mfg: mfg.toISOString(),
    expiry: exp.toISOString(),
    warehouse: warehouses[i % warehouses.length].code,
  };
});

// Transfers
export const transfers: Transfer[] = Array.from({ length: 10 }, (_, i) => {
  const a = warehouses[i % warehouses.length].code;
  const b = warehouses[(i + 1) % warehouses.length].code;
  const d = new Date(); d.setDate(d.getDate() - i);
  return {
    id: `TR-${pad(900 + i, 4)}`,
    from: a, to: b,
    status: (["pending","in-transit","received","cancelled"] as const)[i % 4],
    createdAt: d.toISOString(),
    items: 4 + (i % 7),
    qty: 80 + (i * 23) % 400,
  };
});

// Forecast data
export const forecastSeries = Array.from({ length: 12 }, (_, i) => ({
  week: `W${i + 1}`,
  demand: 1200 + Math.round(Math.sin(i / 1.4) * 380 + i * 42),
  forecast: 1180 + Math.round(Math.sin(i / 1.4) * 360 + i * 48),
  stock: 2400 - i * 90 + Math.round(Math.cos(i / 2) * 120),
}));

export const fastMovers = erpProducts.slice(0, 6).map((p, i) => ({
  ...p,
  velocity: 320 - i * 32,
  trend: 8 + i * 2.4,
}));

export const slowMovers = erpProducts.slice(60, 66).map((p, i) => ({
  ...p,
  velocity: 18 - i,
  trend: -2 - i * 1.1,
}));

export const restockSuggestions = erpProducts
  .filter((p) => p.stock <= p.reorder + 8)
  .slice(0, 8)
  .map((p, i) => ({
    ...p,
    suggestQty: 60 + (i * 14) % 120,
    daysToStockout: Math.max(1, 14 - i * 2),
    confidence: 78 + ((i * 5) % 18),
  }));

export const seasonalTrends = [
  { month: "Jul", demand: 920 },
  { month: "Aug", demand: 1080 },
  { month: "Sep", demand: 1240 },
  { month: "Oct", demand: 1520 },
  { month: "Nov", demand: 1880 },
  { month: "Dec", demand: 2240 },
  { month: "Jan", demand: 1640 },
  { month: "Feb", demand: 1490 },
  { month: "Mar", demand: 1720 },
  { month: "Apr", demand: 1980 },
  { month: "May", demand: 2180 },
  { month: "Jun", demand: 2420 },
];

// Audit log
export const auditLog: AuditEntry[] = [
  { id: "AL-001", at: "Just now", user: "Rahul Mehta", action: "approved", entity: "Purchase Order", entityId: "PO-08003", diff: "Status draft → approved" },
  { id: "AL-002", at: "12m ago", user: "Priya Kapoor", action: "updated price", entity: "Product", entityId: "P-1003", diff: "₹399 → ₹449" },
  { id: "AL-003", at: "1h ago", user: "System", action: "auto-flagged", entity: "Batch", entityId: "B-60012", diff: "Near expiry (5 days)" },
  { id: "AL-004", at: "2h ago", user: "Vikram Singh", action: "transferred stock", entity: "Transfer", entityId: "TR-0904", diff: "BOM-DK1 → BLR-DK1, 84 units" },
  { id: "AL-005", at: "3h ago", user: "Aanya Sharma", action: "created", entity: "Product", entityId: "P-1099", diff: "New SKU added" },
  { id: "AL-006", at: "Yesterday", user: "Neha Iyer", action: "received", entity: "Purchase Order", entityId: "PO-07998", diff: "Partial — 120/180 units" },
  { id: "AL-007", at: "Yesterday", user: "System", action: "imported", entity: "Bulk Import", entityId: "IMP-021", diff: "42 SKUs from CSV" },
  { id: "AL-008", at: "2d ago", user: "Rahul Mehta", action: "archived", entity: "Product", entityId: "P-1044", diff: "Status active → archived" },
];