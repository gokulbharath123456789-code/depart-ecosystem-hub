import { useEffect, useState } from "react";
import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export type AppRole = "admin" | "manager" | "staff" | "customer";

export type AuthState = {
  loading: boolean;
  session: Session | null;
  user: User | null;
  roles: AppRole[];
};

/**
 * Single source of truth for client auth state.
 * Subscribes to onAuthStateChange and loads user_roles from the DB
 * whenever the signed-in user changes.
 */
export function useAuth(): AuthState {
  const [session, setSession] = useState<Session | null>(null);
  const [roles, setRoles] = useState<AppRole[]>([]);
  const [sessionLoading, setSessionLoading] = useState(true);
  const [rolesLoading, setRolesLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Register listener FIRST, then read initial session.
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      if (!mounted) return;
      setSession(s);
    });

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return;
      setSession(data.session);
      setSessionLoading(false);
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const uid = session?.user.id;
    if (!uid) {
      setRoles([]);
      setRolesLoading(false);
      return;
    }
    setRolesLoading(true);
    supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", uid)
      .then(({ data }) => {
        if (cancelled) return;
        setRoles(((data ?? []) as { role: AppRole }[]).map((r) => r.role));
        setRolesLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [session?.user.id]);

  const user = session?.user ?? null;
  // Loading is true until session known AND (if signed in) roles resolved.
  const loading = sessionLoading || (!!user && rolesLoading);
  return { loading, session, user, roles };
}

export function hasAnyRole(roles: AppRole[], required: AppRole[]): boolean {
  return required.some((r) => roles.includes(r));
}

export async function signOut() {
  await supabase.auth.signOut();
}