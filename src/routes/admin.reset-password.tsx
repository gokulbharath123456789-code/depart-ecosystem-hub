import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/features/admin/components/AdminShell";
import { AuthCard } from "@/features/admin/components/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import { Lock } from "lucide-react";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/reset-password")({
  component: ResetPage,
});

function score(pwd: string) {
  let s = 0;
  if (pwd.length >= 8) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function ResetPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("Depart@2025");
  const s = useMemo(() => score(pwd), [pwd]);
  const label = ["Too weak", "Weak", "Okay", "Strong", "Excellent"][s];
  return (
    <AuthShell>
      <AuthCard
        eyebrow="Choose a new password"
        title="Reset password"
        description="Use at least 8 characters with a mix of cases, numbers and symbols."
        footer={<><Link to="/admin/login" className="font-semibold text-primary hover:underline">← Back to sign in</Link></>}
      >
        <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/admin/login" }); }}>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">New password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" value={pwd} onChange={(e) => setPwd(e.target.value)} className="h-11 rounded-xl pl-9" />
            </div>
            <div className="mt-2 flex gap-1">
              {[0, 1, 2, 3].map((i) => (
                <span key={i} className={cn("h-1.5 flex-1 rounded-full", i < s ? "bg-primary" : "bg-muted")} />
              ))}
            </div>
            <p className="text-[11px] text-muted-foreground">Strength: <span className="font-semibold text-foreground">{label}</span></p>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs font-semibold">Confirm password</Label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input type="password" defaultValue={pwd} className="h-11 rounded-xl pl-9" />
            </div>
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold">Update password</Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}