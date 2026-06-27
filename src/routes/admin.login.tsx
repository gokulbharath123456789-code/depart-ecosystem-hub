import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";
import { AuthShell } from "@/features/admin/components/AdminShell";
import { AuthCard } from "@/features/admin/components/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => navigate({ to: "/admin/dashboard" }), 700);
  };

  return (
    <AuthShell>
      <AuthCard
        eyebrow="DEPART Admin"
        title="Welcome back"
        description="Sign in to manage your stores, orders and inventory."
        footer={<>New here? <Link to="/admin/login" className="font-semibold text-primary hover:underline">Request access</Link></>}
      >
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Work email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" defaultValue="aanya@depart.in" className="h-11 rounded-xl pl-9" />
            </div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="pwd" className="text-xs font-semibold">Password</Label>
              <Link to="/admin/forgot-password" className="text-xs font-semibold text-primary hover:underline">Forgot?</Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="pwd" type={showPwd ? "text" : "password"} defaultValue="supersecret" className="h-11 rounded-xl pl-9 pr-10" />
              <button type="button" onClick={() => setShowPwd((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground" aria-label="Toggle password">
                {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label className="flex items-center gap-2 text-xs font-medium">
              <Checkbox defaultChecked /> Remember me for 30 days
            </Label>
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign in"}
          </Button>
          <div className="flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-[11px] uppercase tracking-widest text-muted-foreground">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>
          <Button type="button" variant="outline" className="h-11 w-full rounded-xl" onClick={() => navigate({ to: "/admin/otp" })}>
            Sign in with email OTP
          </Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}