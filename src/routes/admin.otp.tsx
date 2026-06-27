import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AuthShell } from "@/features/admin/components/AdminShell";
import { AuthCard } from "@/features/admin/components/AuthCard";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export const Route = createFileRoute("/admin/otp")({
  component: OtpPage,
});

function OtpPage() {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  return (
    <AuthShell>
      <AuthCard
        eyebrow="Two-factor"
        title="Verify it's you"
        description="We sent a 6-digit code to aanya@depart.in. It expires in 10 minutes."
        footer={<><Link to="/admin/login" className="font-semibold text-primary hover:underline">← Use a different account</Link></>}
      >
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={code} onChange={setCode}>
            <InputOTPGroup>
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <InputOTPSlot key={i} index={i} />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>
        <Button className="h-11 w-full rounded-xl text-sm font-semibold" disabled={code.length < 6} onClick={() => navigate({ to: "/admin/dashboard" })}>
          Verify and continue
        </Button>
        <p className="text-center text-xs text-muted-foreground">Didn't get a code? <button type="button" className="font-semibold text-primary hover:underline">Resend in 28s</button></p>
      </AuthCard>
    </AuthShell>
  );
}