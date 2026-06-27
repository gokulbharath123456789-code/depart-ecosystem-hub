import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PanelCard, DataTable, StatusPill, KpiCard } from "@/features/admin/components/widgets";
import { Button } from "@/components/ui/button";
import { adminUsers } from "@/features/admin/mock/data";
import { Plus, ShieldCheck, Users, UserPlus } from "lucide-react";

export const Route = createFileRoute("/admin/users")({
  component: UsersPage,
});

function UsersPage() {
  const active = adminUsers.filter((u) => u.status === "active").length;
  const invited = adminUsers.filter((u) => u.status === "invited").length;
  return (
    <div className="mx-auto max-w-[1200px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Settings" }, { label: "Team" }]}
        title="Team"
        description="Manage seats, roles and permissions."
        actions={<Button className="rounded-xl"><Plus className="mr-2 h-4 w-4" /> Invite teammate</Button>}
      />
      <section className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard label="Members" value={adminUsers.length} icon={Users} tint="primary" />
        <KpiCard label="Active" value={active} icon={ShieldCheck} tint="emerald" />
        <KpiCard label="Invited" value={invited} icon={UserPlus} tint="amber" />
        <KpiCard label="Seats left" value={4} icon={Users} tint="sky" />
      </section>
      <PanelCard title="Members" className="mt-6">
        <DataTable
          rows={adminUsers}
          columns={[
            {
              key: "name", label: "Member",
              render: (u) => (
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-primary/15 text-xs font-bold text-primary">{u.name.split(" ").map(n => n[0]).join("")}</span>
                  <div className="min-w-0"><p className="text-sm font-semibold">{u.name}</p><p className="text-[11px] text-muted-foreground">{u.email}</p></div>
                </div>
              ),
            },
            { key: "role", label: "Role", render: (u) => <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold">{u.role}</span> },
            { key: "lastActive", label: "Last active", render: (u) => <span className="text-xs text-muted-foreground">{u.lastActive}</span> },
            { key: "status", label: "Status", render: (u) => <StatusPill status={u.status} /> },
          ]}
        />
      </PanelCard>
    </div>
  );
}