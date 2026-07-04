import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbOrder = Database["public"]["Tables"]["orders"]["Row"];
export type DbOrderItem = Database["public"]["Tables"]["order_items"]["Row"];
export type DbOrderStatusHistory = Database["public"]["Tables"]["order_status_history"]["Row"];
export type DbPayment = Database["public"]["Tables"]["payments"]["Row"];
export type DbInvoice = Database["public"]["Tables"]["invoices"]["Row"];
export type DbCoupon = Database["public"]["Tables"]["coupons"]["Row"];
export type OrderStatus = Database["public"]["Enums"]["order_status"];
export type PaymentMethod = Database["public"]["Enums"]["payment_method"];

export type OrderWithRefs = DbOrder & {
  items: DbOrderItem[];
  history: DbOrderStatusHistory[];
  payments: DbPayment[];
  invoices: DbInvoice[];
};

const ORDER_SELECT = `*,
  items:order_items(*),
  history:order_status_history(*),
  payments:payments(*),
  invoices:invoices(*)`;

export async function listMyOrders(): Promise<OrderWithRefs[]> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .order("placed_at", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as OrderWithRefs[];
}

export async function getOrderById(id: string): Promise<OrderWithRefs | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as OrderWithRefs | null;
}

export async function getOrderByNumber(orderNumber: string): Promise<OrderWithRefs | null> {
  const { data, error } = await supabase
    .from("orders")
    .select(ORDER_SELECT)
    .eq("order_number", orderNumber)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as OrderWithRefs | null;
}

export async function listAllOrders(filters: {
  status?: OrderStatus | "all";
  search?: string;
  limit?: number;
} = {}): Promise<OrderWithRefs[]> {
  let q = supabase.from("orders").select(ORDER_SELECT).order("placed_at", { ascending: false });
  if (filters.status && filters.status !== "all") q = q.eq("status", filters.status);
  if (filters.limit) q = q.limit(filters.limit);
  const { data, error } = await q;
  if (error) throw error;
  let rows = (data ?? []) as unknown as OrderWithRefs[];
  if (filters.search) {
    const s = filters.search.toLowerCase();
    rows = rows.filter(
      (o) =>
        o.order_number.toLowerCase().includes(s) ||
        o.ship_full_name.toLowerCase().includes(s),
    );
  }
  return rows;
}

export type PlaceOrderInput = {
  addressId: string;
  items: { product_id: string; qty: number }[];
  paymentMethod: PaymentMethod;
  deliverySlot: string;
  couponCode?: string;
  notes?: string;
};

export async function placeOrder(input: PlaceOrderInput): Promise<DbOrder> {
  const { data, error } = await supabase.rpc("place_order", {
    _address_id: input.addressId,
    _items: input.items,
    _payment_method: input.paymentMethod,
    _delivery_slot: input.deliverySlot,
    _coupon_code: input.couponCode ?? null,
    _notes: input.notes ?? null,
  });
  if (error) throw error;
  return data as unknown as DbOrder;
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus,
  note?: string,
): Promise<DbOrder> {
  const { data, error } = await supabase.rpc("update_order_status", {
    _order_id: orderId,
    _status: status,
    _note: note ?? null,
  });
  if (error) throw error;
  return data as unknown as DbOrder;
}

// ---------------------- Coupons -----------------------------------------

export async function listActiveCoupons(): Promise<DbCoupon[]> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("is_active", true)
    .order("value", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function previewCoupon(
  code: string,
  subtotal: number,
): Promise<{ ok: boolean; discount: number; coupon?: DbCoupon; reason?: string }> {
  const { data, error } = await supabase
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .maybeSingle();
  if (error) return { ok: false, discount: 0, reason: error.message };
  if (!data) return { ok: false, discount: 0, reason: "Invalid code" };
  if (data.expires_at && new Date(data.expires_at) < new Date())
    return { ok: false, discount: 0, reason: "Expired coupon" };
  if (subtotal < Number(data.min_order))
    return { ok: false, discount: 0, reason: `Min order ₹${data.min_order}` };
  let discount =
    data.kind === "percent"
      ? Math.round((subtotal * Number(data.value)) / 100)
      : Number(data.value);
  if (data.max_discount && discount > Number(data.max_discount))
    discount = Number(data.max_discount);
  return { ok: true, discount, coupon: data };
}