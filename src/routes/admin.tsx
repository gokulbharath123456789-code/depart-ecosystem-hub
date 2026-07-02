import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AdminShell } from "@/features/admin/components/AdminShell";
import { AuthGuard } from "@/features/auth/AuthGuard";

export const Route = createFileRoute("/admin")({
  component: AdminLayout,
});

function AdminLayout() {
  return (
    <AuthGuard requireRoles={["admin", "manager", "staff"]}>
      <AdminShell>
        <Outlet />
      </AdminShell>
    </AuthGuard>
  );
}