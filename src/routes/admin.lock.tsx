import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/lock")({
  component: LockPage,
});

function LockPage() {
  const navigate = useNavigate();
  const [pwd, setPwd] = useState("");
  return (
    <div className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-700 to-amber-600 text-white">
      <div className="absolute inset-0">
        <div className="absolute -left-24 top-10 h-80 w-80 rounded-full bg-emerald-400/30 blur-3xl" />
        <div className="absolute bottom-10 right-10 h-96 w-96 rounded-full bg-amber-300/30 blur-3xl" />
      </div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-sm rounded-3xl border border-white/15 bg-white/10 p-8 text-center backdrop-blur-2xl shadow-2xl"
      >
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-white/20 ring-1 ring-white/30">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-emerald-700 text-xl font-extrabold">AS</span>
        </div>
        <h2 className="mt-4 font-display text-xl font-extrabold">Welcome back, Aanya</h2>
        <p className="text-xs text-white/70">Your session is locked. Enter your password to continue.</p>
        <form className="mt-6 space-y-3" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/admin/dashboard" }); }}>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/70" />
            <Input
              autoFocus
              type="password"
              placeholder="Password"
              value={pwd}
              onChange={(e) => setPwd(e.target.value)}
              className="h-11 rounded-xl border-white/30 bg-white/10 pl-9 text-white placeholder:text-white/60 focus-visible:ring-white/40"
            />
          </div>
          <Button type="submit" className="h-11 w-full rounded-xl bg-white text-emerald-700 hover:bg-white/90">
            Unlock
          </Button>
        </form>
        <button type="button" onClick={() => navigate({ to: "/admin/login" })} className="mt-4 text-xs text-white/80 hover:text-white">
          Sign in as another user
        </button>
      </motion.div>
    </div>
  );
}