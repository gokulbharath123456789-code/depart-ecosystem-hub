import { createFileRoute, Outlet } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";

export const Route = createFileRoute("/account")({
  head: () => ({
    meta: [
      { title: "Account — DEPART" },
      { name: "description", content: "Manage your DEPART orders, wallet, addresses, returns and more." },
    ],
  }),
  component: AccountLayout,
});

function AccountLayout() {
  return (
    <DashboardLayout>
      <Outlet />
    </DashboardLayout>
  );
}