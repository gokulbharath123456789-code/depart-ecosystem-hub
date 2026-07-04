import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbAddress = Database["public"]["Tables"]["addresses"]["Row"];
export type AddressInput = Database["public"]["Tables"]["addresses"]["Insert"];

export async function listAddresses(): Promise<DbAddress[]> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .order("is_default", { ascending: false })
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function upsertAddress(input: AddressInput) {
  const { data: user } = await supabase.auth.getUser();
  const uid = user.user?.id;
  if (!uid) throw new Error("Not authenticated");
  const payload = { ...input, user_id: uid };
  if (input.id) {
    const { data, error } = await supabase
      .from("addresses")
      .update(payload)
      .eq("id", input.id)
      .select("*")
      .single();
    if (error) throw error;
    return data;
  }
  const { data, error } = await supabase
    .from("addresses")
    .insert(payload)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteAddress(id: string) {
  const { error } = await supabase.from("addresses").delete().eq("id", id);
  if (error) throw error;
}

export async function setDefaultAddress(id: string) {
  const { data, error } = await supabase
    .from("addresses")
    .update({ is_default: true })
    .eq("id", id)
    .select("*")
    .single();
  if (error) throw error;
  return data;
}

export async function getDefaultAddress(): Promise<DbAddress | null> {
  const { data, error } = await supabase
    .from("addresses")
    .select("*")
    .eq("is_default", true)
    .maybeSingle();
  if (error) throw error;
  return data;
}