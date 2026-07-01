import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type StockMovementKind =
  | "receipt"
  | "sale"
  | "return"
  | "adjustment"
  | "transfer"
  | "damage"
  | "expiry";

export type InventoryRow = Database["public"]["Tables"]["inventory_levels"]["Row"] & {
  product: { id: string; name: string; slug: string; sku: string | null; unit: string } | null;
  warehouse: { id: string; name: string; code: string } | null;
};

export type MovementRow = Database["public"]["Tables"]["stock_movements"]["Row"] & {
  product: { name: string; slug: string } | null;
  warehouse: { name: string; code: string } | null;
};

export type BatchRow = Database["public"]["Tables"]["batches"]["Row"] & {
  product: { name: string; slug: string } | null;
  warehouse: { name: string; code: string } | null;
};

export async function listInventory(opts: {
  warehouseId?: string;
  search?: string;
  lowStock?: boolean;
} = {}): Promise<InventoryRow[]> {
  let q = supabase
    .from("inventory_levels")
    .select(
      `*, product:products(id, name, slug, sku, unit),
       warehouse:warehouses(id, name, code)`,
    );
  if (opts.warehouseId) q = q.eq("warehouse_id", opts.warehouseId);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data ?? []) as unknown as InventoryRow[];
  if (opts.search) {
    const s = opts.search.toLowerCase();
    rows = rows.filter((r) => r.product?.name.toLowerCase().includes(s));
  }
  if (opts.lowStock) rows = rows.filter((r) => r.on_hand <= r.reorder_point);
  return rows;
}

export async function adjustInventory(input: {
  product_id: string;
  warehouse_id: string;
  delta: number;
  kind?: StockMovementKind;
  reference?: string | null;
  note?: string | null;
}) {
  const { error } = await supabase.rpc("adjust_stock", {
    p_product_id: input.product_id,
    p_warehouse_id: input.warehouse_id,
    p_delta: input.delta,
    p_kind: input.kind ?? "adjustment",
    p_reference: input.reference ?? null,
    p_note: input.note ?? null,
  });
  if (error) throw error;
}

export async function transferInventory(input: {
  product_id: string;
  from_warehouse_id: string;
  to_warehouse_id: string;
  qty: number;
  note?: string | null;
}) {
  if (input.qty <= 0) throw new Error("Quantity must be positive");
  const reference = `TRF-${Date.now()}`;
  await adjustInventory({
    product_id: input.product_id,
    warehouse_id: input.from_warehouse_id,
    delta: -input.qty,
    kind: "transfer",
    reference,
    note: input.note ?? `Transfer out → ${input.to_warehouse_id}`,
  });
  await adjustInventory({
    product_id: input.product_id,
    warehouse_id: input.to_warehouse_id,
    delta: input.qty,
    kind: "transfer",
    reference,
    note: input.note ?? `Transfer in ← ${input.from_warehouse_id}`,
  });
}

export async function listStockMovements(opts: {
  kind?: StockMovementKind;
  limit?: number;
} = {}): Promise<MovementRow[]> {
  let q = supabase
    .from("stock_movements")
    .select(`*, product:products(name, slug), warehouse:warehouses(name, code)`)
    .order("created_at", { ascending: false });
  if (opts.kind) q = q.eq("kind", opts.kind);
  if (opts.limit) q = q.limit(opts.limit);
  const { data, error } = await q;
  if (error) throw error;
  return (data ?? []) as unknown as MovementRow[];
}

export async function listBatches(): Promise<BatchRow[]> {
  const { data, error } = await supabase
    .from("batches")
    .select(`*, product:products(name, slug), warehouse:warehouses(name, code)`)
    .order("expiry_date", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as BatchRow[];
}