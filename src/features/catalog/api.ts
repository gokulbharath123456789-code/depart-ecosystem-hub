import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbCategory = Database["public"]["Tables"]["categories"]["Row"];
export type DbBrand = Database["public"]["Tables"]["brands"]["Row"];
export type DbSupplier = Database["public"]["Tables"]["suppliers"]["Row"];
export type DbWarehouse = Database["public"]["Tables"]["warehouses"]["Row"];
export type DbProduct = Database["public"]["Tables"]["products"]["Row"];
export type DbProductImage = Database["public"]["Tables"]["product_images"]["Row"];
export type DbInventoryLevel = Database["public"]["Tables"]["inventory_levels"]["Row"];
export type DbStockMovement = Database["public"]["Tables"]["stock_movements"]["Row"];
export type DbBatch = Database["public"]["Tables"]["batches"]["Row"];

export type ProductWithRefs = DbProduct & {
  images: DbProductImage[];
  category: Pick<DbCategory, "id" | "slug" | "name"> | null;
  brand: Pick<DbBrand, "id" | "slug" | "name"> | null;
  supplier: Pick<DbSupplier, "id" | "code" | "name"> | null;
  inventory: { on_hand: number; reserved: number; reorder_point: number }[];
};

export type ProductListFilters = {
  search?: string;
  categorySlug?: string | null;
  status?: "all" | "active" | "draft" | "archived";
  featured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  tags?: string[];
  sort?: "popular" | "price-asc" | "price-desc" | "newest" | "name";
  limit?: number;
};

// ---------------------------- Catalog reads -----------------------------

export async function listCategories(): Promise<DbCategory[]> {
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listBrands(): Promise<DbBrand[]> {
  const { data, error } = await supabase
    .from("brands")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listSuppliers(): Promise<DbSupplier[]> {
  const { data, error } = await supabase
    .from("suppliers")
    .select("*")
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listWarehouses(): Promise<DbWarehouse[]> {
  const { data, error } = await supabase
    .from("warehouses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function listProducts(
  filters: ProductListFilters = {},
): Promise<ProductWithRefs[]> {
  let query = supabase
    .from("products")
    .select(
      `*,
       images:product_images(*),
       category:categories(id, slug, name),
       brand:brands(id, slug, name),
       supplier:suppliers(id, code, name),
       inventory:inventory_levels(on_hand, reserved, reorder_point)`,
    );

  if (filters.status && filters.status !== "all") {
    query = query.eq("status", filters.status);
  }
  if (filters.featured) query = query.eq("is_featured", true);
  if (filters.minPrice != null) query = query.gte("price", filters.minPrice);
  if (filters.maxPrice != null) query = query.lte("price", filters.maxPrice);
  if (filters.tags?.length) query = query.overlaps("tags", filters.tags);
  if (filters.search) query = query.ilike("name", `%${filters.search}%`);

  const sort = filters.sort ?? "popular";
  if (sort === "price-asc") query = query.order("price", { ascending: true });
  else if (sort === "price-desc") query = query.order("price", { ascending: false });
  else if (sort === "name") query = query.order("name");
  else query = query.order("created_at", { ascending: false });

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error) throw error;

  let rows = (data ?? []) as unknown as ProductWithRefs[];
  if (filters.categorySlug) {
    rows = rows.filter((r) => r.category?.slug === filters.categorySlug);
  }
  return rows;
}

export async function getProductBySlug(slug: string): Promise<ProductWithRefs | null> {
  const { data, error } = await supabase
    .from("products")
    .select(
      `*,
       images:product_images(*),
       category:categories(id, slug, name),
       brand:brands(id, slug, name),
       supplier:suppliers(id, code, name),
       inventory:inventory_levels(on_hand, reserved, reorder_point)`,
    )
    .eq("slug", slug)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as ProductWithRefs | null;
}

// ---------------------------- Catalog writes ----------------------------

export async function createCategory(input: {
  slug: string;
  name: string;
  description?: string | null;
  image_url?: string | null;
  parent_id?: string | null;
}) {
  const { data, error } = await supabase.from("categories").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, patch: Partial<DbCategory>) {
  const { data, error } = await supabase
    .from("categories")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createBrand(input: { slug: string; name: string; logo_url?: string | null }) {
  const { data, error } = await supabase.from("brands").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function createSupplier(input: {
  code: string;
  name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  city?: string | null;
  payment_terms?: string | null;
}) {
  const { data, error } = await supabase.from("suppliers").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export async function updateSupplier(id: string, patch: Partial<DbSupplier>) {
  const { data, error } = await supabase
    .from("suppliers")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function createWarehouse(input: {
  code: string;
  name: string;
  city?: string | null;
  is_default?: boolean;
}) {
  const { data, error } = await supabase.from("warehouses").insert(input).select("*").single();
  if (error) throw error;
  return data;
}

export type CreateProductInput = {
  slug: string;
  name: string;
  description?: string | null;
  category_id?: string | null;
  brand_id?: string | null;
  supplier_id?: string | null;
  sku?: string | null;
  barcode?: string | null;
  unit?: string;
  price: number;
  compare_at_price?: number | null;
  cost_price?: number | null;
  tax_rate?: number;
  tags?: string[];
  status?: "draft" | "active" | "archived";
  is_featured?: boolean;
  images?: { url: string; alt?: string | null; is_primary?: boolean }[];
  initialStock?: { warehouse_id: string; on_hand: number; reorder_point?: number; reorder_qty?: number };
};

export async function createProduct(input: CreateProductInput) {
  const { images, initialStock, ...productFields } = input;
  const { data: product, error } = await supabase
    .from("products")
    .insert({
      ...productFields,
      status: productFields.status ?? "draft",
      published_at: productFields.status === "active" ? new Date().toISOString() : null,
    })
    .select("*")
    .single();
  if (error) throw error;

  if (images?.length) {
    const rows = images.map((img, i) => ({
      product_id: product.id,
      url: img.url,
      alt: img.alt ?? null,
      sort_order: i,
      is_primary: img.is_primary ?? i === 0,
    }));
    const { error: imgErr } = await supabase.from("product_images").insert(rows);
    if (imgErr) throw imgErr;
  }

  if (initialStock) {
    const { error: stockErr } = await supabase.from("inventory_levels").upsert({
      product_id: product.id,
      warehouse_id: initialStock.warehouse_id,
      on_hand: initialStock.on_hand,
      reorder_point: initialStock.reorder_point ?? 0,
      reorder_qty: initialStock.reorder_qty ?? 0,
    });
    if (stockErr) throw stockErr;
    if (initialStock.on_hand > 0) {
      await supabase.from("stock_movements").insert({
        product_id: product.id,
        warehouse_id: initialStock.warehouse_id,
        kind: "receipt",
        qty: initialStock.on_hand,
        reference: "OPENING",
        note: "Opening stock from product creation",
      });
    }
  }

  return product;
}

export async function updateProduct(id: string, patch: Partial<DbProduct>) {
  const { data, error } = await supabase
    .from("products")
    .update(patch)
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function archiveProduct(id: string) {
  return updateProduct(id, { status: "archived" });
}

export async function deleteProduct(id: string) {
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw error;
}

// ---------------------------- Product media -----------------------------

export const PRODUCT_MEDIA_BUCKET = "product-media";

export async function uploadProductImage(productId: string, file: File): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${productId}/${crypto.randomUUID()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from(PRODUCT_MEDIA_BUCKET)
    .upload(path, file, { upsert: false, contentType: file.type });
  if (upErr) throw upErr;
  const { data } = supabase.storage.from(PRODUCT_MEDIA_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export async function addProductImage(productId: string, url: string, isPrimary = false) {
  const { data, error } = await supabase
    .from("product_images")
    .insert({ product_id: productId, url, is_primary: isPrimary })
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteProductImage(imageId: string) {
  const { error } = await supabase.from("product_images").delete().eq("id", imageId);
  if (error) throw error;
}