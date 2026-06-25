export const inr = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);

export const pct = (mrp: number, price: number) =>
  Math.max(0, Math.round(((mrp - price) / mrp) * 100));