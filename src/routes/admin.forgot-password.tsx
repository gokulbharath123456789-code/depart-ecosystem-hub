import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/features/admin/components/AdminShell";
import { AuthCard } from "@/features/admin/components/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export const Route = createFileRoute("/admin/forgot-password")({
  component: ForgotPage,
});

function ForgotPage() {
  const navigate = useNavigate();
  return (
    <AuthShell>
      <AuthCard
        eyebrow="Reset access"
        title="Forgot your password?"
        description="Enter your work email and we'll send a reset link within seconds."
        footer={<><Link to="/admin/login" className="font-semibold text-primary hover:underline">← Back to sign in</Link></>}
      >
        <form
          className="space-y-4"
          onSubmit={(e) => { e.preventDefault(); navigate({ to: "/admin/reset-password" }); }}
        >
          <div className="space-y-1.5">
            <Label htmlFor="email" className="text-xs font-semibold">Work email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input id="email" type="email" defaultValue="aanya@depart.in" className="h-11 rounded-xl pl-9" />
            </div>
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl text-sm font-semibold">Send reset link</Button>
        </form>
      </AuthCard>
    </AuthShell>
  );
}