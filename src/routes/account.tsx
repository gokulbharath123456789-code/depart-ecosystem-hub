import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { AuthGuard } from "@/features/auth/AuthGuard";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — SREE SUPER MART" },
      { name: "description", content: "Manage your SREE SUPER MART orders, wallet, addresses, returns and more." },
    ],
  }),
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <AuthGuard>
      <DashboardLayout>
        <Outlet />
      </DashboardLayout>
    </AuthGuard>
  );
}