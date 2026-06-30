import { useEffect, type ReactNode } from "react";
import { useNavigate, useRouterState } from "@tanstack/react-router";
import { Loader2, ShieldAlert } from "lucide-react";
import { useAuth, hasAnyRole, type AppRole } from "./useAuth";
import { Button } from "@/components/ui/button";

type Props = {
  children: ReactNode;
  /** Roles allowed to view. Omit to require only that the user is signed in. */
  requireRoles?: AppRole[];
  /** Where to send unauthenticated users. */
  redirectTo?: string;
};

export function AuthGuard({ children, requireRoles, redirectTo = "/auth" }: Props) {
  const { loading, user, roles } = useAuth();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    if (loading) return;
    if (!user) {
      navigate({ to: redirectTo, search: { redirect: pathname } });
    }
  }, [loading, user, navigate, redirectTo, pathname]);

  if (loading || !user) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Checking your session…
        </div>
      </div>
    );
  }

  if (requireRoles && requireRoles.length > 0 && !hasAnyRole(roles, requireRoles)) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-4">
        <div className="max-w-md text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-amber-100 text-amber-600">
            <ShieldAlert className="h-6 w-6" />
          </div>
          <h1 className="mt-4 font-display text-xl font-bold">You don't have access</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            This area is restricted to {requireRoles.join(", ")} accounts. Ask an admin to grant
            you the required role.
          </p>
          <div className="mt-5 flex justify-center gap-2">
            <Button variant="outline" onClick={() => navigate({ to: "/" })} className="rounded-xl">
              Back to store
            </Button>
            <Button
              onClick={async () => {
                const { signOut } = await import("./useAuth");
                await signOut();
                navigate({ to: "/auth" });
              }}
              className="rounded-xl"
            >
              Sign in as another user
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}