import { createFileRoute, Outlet, useRouterState } from "@tanstack/react-router";
import { AdminShell } from "@/features/admin/components/AdminShell";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

const AUTH_PATHS = new Set([
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
  "/admin/otp",
  "/admin/lock",
]);

function AdminLayout() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuth = AUTH_PATHS.has(pathname);
  if (isAuth) return <Outlet />;
  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}