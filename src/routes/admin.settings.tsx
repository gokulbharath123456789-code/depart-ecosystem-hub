import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, PanelCard } from "@/features/admin/components/widgets";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export const Route = createFileRoute("/admin/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <div className="mx-auto max-w-[1100px]">
      <PageHeader
        crumbs={[{ label: "Admin", to: "/admin/dashboard" }, { label: "Settings" }]}
        title="Workspace settings"
        description="Configure your store, brand, billing and security."
      />
      <Tabs defaultValue="general">
        <TabsList className="flex h-auto flex-wrap gap-1 bg-muted/40 p-1">
          {["general","brand","billing","security","notifications","integrations"].map((t) => (
            <TabsTrigger key={t} value={t} className="text-xs capitalize">{t}</TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="general" className="mt-6 space-y-6">
          <PanelCard title="Store profile">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Store name" defaultValue="DEPART Mumbai" />
              <Field label="Support email" defaultValue="hello@depart.in" />
              <Field label="Phone" defaultValue="+91 90000 00000" />
              <Field label="GSTIN" defaultValue="27AAFCD1234A1Z5" />
              <Field label="Address line 1" defaultValue="Plot 42, Linking Road" />
              <Field label="City" defaultValue="Mumbai" />
            </div>
            <div className="mt-4 flex justify-end"><Button className="rounded-xl">Save changes</Button></div>
          </PanelCard>

          <PanelCard title="Localization">
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Currency" defaultValue="INR (₹)" />
              <Field label="Timezone" defaultValue="Asia/Kolkata" />
              <Field label="Locale" defaultValue="en-IN" />
              <Field label="Tax mode" defaultValue="GST (B2C)" />
            </div>
          </PanelCard>
        </TabsContent>

        <TabsContent value="brand" className="mt-6">
          <PanelCard title="Brand"><p className="text-sm text-muted-foreground">Upload your logo, set theme colors and typography presets here.</p></PanelCard>
        </TabsContent>

        <TabsContent value="billing" className="mt-6 space-y-6">
          <PanelCard title="Plan">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold">DEPART Growth · ₹4,999/mo</p>
                <p className="text-xs text-muted-foreground">Includes 10 seats, unlimited SKUs and priority support.</p>
              </div>
              <Button variant="outline" className="rounded-xl">Upgrade</Button>
            </div>
          </PanelCard>
          <PanelCard title="Payment method"><p className="text-sm">HDFC Visa ending in 4421 · expires 09/27</p></PanelCard>
        </TabsContent>

        <TabsContent value="security" className="mt-6 space-y-6">
          <PanelCard title="Authentication">
            <Toggle label="Require 2FA for all admins" desc="Force every admin to set up TOTP." defaultChecked />
            <Separator className="my-3" />
            <Toggle label="Lock session after 15 min" desc="Idle sessions auto-lock and require password." defaultChecked />
            <Separator className="my-3" />
            <Toggle label="Restrict by IP" desc="Allow access only from approved networks." />
          </PanelCard>
        </TabsContent>

        <TabsContent value="notifications" className="mt-6">
          <PanelCard title="Email digests">
            <Toggle label="Daily sales summary" desc="Sent every morning at 9:00 IST." defaultChecked />
            <Separator className="my-3" />
            <Toggle label="Low stock alerts" desc="Real-time alerts when SKUs hit reorder." defaultChecked />
            <Separator className="my-3" />
            <Toggle label="New customer signup" desc="Notify when a new account is created." />
          </PanelCard>
        </TabsContent>

        <TabsContent value="integrations" className="mt-6">
          <PanelCard title="Integrations">
            <p className="text-sm text-muted-foreground">Razorpay · Shiprocket · WhatsApp · Zoho Books · Klaviyo (mock).</p>
          </PanelCard>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, defaultValue }: { label: string; defaultValue?: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-semibold">{label}</Label>
      <Input defaultValue={defaultValue} className="h-10 rounded-xl" />
    </div>
  );
}

function Toggle({ label, desc, defaultChecked }: { label: string; desc: string; defaultChecked?: boolean }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-semibold">{label}</p>
        <p className="text-xs text-muted-foreground">{desc}</p>
      </div>
      <Switch defaultChecked={defaultChecked} />
    </div>
  );
}