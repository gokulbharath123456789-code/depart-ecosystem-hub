import { createFileRoute, useNavigate, useSearch, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { Loader2, Mail, Lock, User as UserIcon, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { useAuth } from "@/features/auth/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AuthShell } from "@/features/admin/components/AdminShell";

const searchSchema = z.object({ redirect: z.string().optional() });

export const Route = createFileRoute("/auth")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Sign in — SREE SUPER MART" },
      { name: "description", content: "Sign in or create your SREE SUPER MART account." },
    ],
  }),
  component: AuthPage,
});

function safeRedirect(path: string | undefined) {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return "/";
  return path;
}

function roleHome(roles: string[]) {
  if (roles.some((r) => r === "admin" || r === "manager" || r === "staff")) return "/admin";
  return "/account";
}

function AuthPage() {
  const { redirect } = useSearch({ from: "/auth" });
  const { user, loading, roles } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [busy, setBusy] = useState(false);

  // Already signed in? bounce.
  useEffect(() => {
    if (loading || !user) return;
    if (redirect) {
      navigate({ to: safeRedirect(redirect) as "/" });
      return;
    }
    navigate({ to: roleHome(roles) as "/" });
  }, [loading, user, redirect, navigate, roles]);

  async function handleEmail(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: window.location.origin,
            data: { full_name: fullName },
          },
        });
        if (error) throw error;
        toast.success("Account created. Welcome to SREE SUPER MART!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Signed in");
      }
      // Redirect handled by the effect once roles resolve.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  }

  async function handleGoogle() {
    setBusy(true);
    try {
      const result = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (result.error) throw result.error;
      if (result.redirected) return;
      // Redirect handled by the effect once roles resolve.
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Google sign-in failed");
      setBusy(false);
    }
  }

  async function handleForgot() {
    if (!email) {
      toast.error("Enter your email above first");
      return;
    }
    setBusy(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      toast.success("Password reset email sent");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not send reset email");
    } finally {
      setBusy(false);
    }
  }

  return (
    <AuthShell>
      <div>
        <Link to="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary text-primary-foreground font-display font-extrabold">
            D
          </span>
          <span className="font-display text-lg font-extrabold">SREE SUPER MART</span>
        </Link>
        <h1 className="font-display text-2xl font-bold tracking-tight">
          {mode === "signin" ? "Welcome back" : "Create your account"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {mode === "signin"
            ? "Sign in to manage your orders, wallet and admin tools."
            : "Free to start. No credit card required."}
        </p>

        <Button
          type="button"
          variant="outline"
          className="mt-6 w-full rounded-xl"
          onClick={handleGoogle}
          disabled={busy}
        >
          <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.1A6.97 6.97 0 0 1 5.48 12c0-.73.13-1.43.36-2.1V7.07H2.18A11 11 0 0 0 1 12c0 1.77.43 3.45 1.18 4.93l3.66-2.83z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.83C6.71 7.31 9.14 5.38 12 5.38z" />
          </svg>
          Continue with Google
        </Button>

        <div className="my-5 flex items-center gap-3 text-xs uppercase text-muted-foreground">
          <span className="h-px flex-1 bg-border" />
          or
          <span className="h-px flex-1 bg-border" />
        </div>

        <form onSubmit={handleEmail} className="space-y-3">
          {mode === "signup" && (
            <div>
              <Label htmlFor="name" className="text-xs">Full name</Label>
              <div className="relative mt-1">
                <UserIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input id="name" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Aanya Sharma" className="pl-9 rounded-xl" required minLength={2} />
              </div>
            </div>
          )}
          <div>
            <Label htmlFor="email" className="text-xs">Email</Label>
            <div className="relative mt-1">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-9 rounded-xl" required />
            </div>
          </div>
          <div>
            <Label htmlFor="password" className="text-xs">Password</Label>
            <div className="relative mt-1">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="password" type="password" autoComplete={mode === "signin" ? "current-password" : "new-password"} value={password} onChange={(e) => setPassword(e.target.value)} className="pl-9 rounded-xl" required minLength={6} />
            </div>
          </div>
          <Button type="submit" className="w-full rounded-xl" disabled={busy}>
            {busy ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {mode === "signin" ? "Sign in" : "Create account"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </form>

        {mode === "signin" && (
          <div className="mt-3 text-right">
            <button
              type="button"
              onClick={handleForgot}
              disabled={busy}
              className="text-xs font-semibold text-primary hover:underline disabled:opacity-50"
            >
              Forgot password?
            </button>
          </div>
        )}

        <p className="mt-6 text-center text-sm text-muted-foreground">
          {mode === "signin" ? "New to SREE SUPER MART? " : "Already have an account? "}
          <button
            type="button"
            onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
            className="font-semibold text-primary hover:underline"
          >
            {mode === "signin" ? "Create an account" : "Sign in"}
          </button>
        </p>
      </div>
    </AuthShell>
  );
}