import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

export type DbNotification = Database["public"]["Tables"]["notifications"]["Row"];

export async function listMyNotifications(): Promise<DbNotification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);
  if (error) throw error;
  return data ?? [];
}

export async function markNotificationRead(id: string) {
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", id);
  if (error) throw error;
}

export async function markAllRead() {
  const { data: user } = await supabase.auth.getUser();
  const uid = user.user?.id;
  if (!uid) return;
  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("user_id", uid)
    .eq("is_read", false);
  if (error) throw error;
}