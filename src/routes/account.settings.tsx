import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Shield, Globe, Bell, Smartphone, Trash2, Monitor, Lock, KeyRound } from "lucide-react";
import { user } from "@/mock/account";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PanelCard } from "@/components/dashboard/cards";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export const Route = createFileRoute("/account/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  return (
    <Tabs defaultValue="profile" className="space-y-5">
      <TabsList className="flex w-full flex-wrap justify-start rounded-full">
        <TabsTrigger value="profile" className="rounded-full">Profile</TabsTrigger>
        <TabsTrigger value="security" className="rounded-full">Security</TabsTrigger>
        <TabsTrigger value="preferences" className="rounded-full">Preferences</TabsTrigger>
        <TabsTrigger value="notifications" className="rounded-full">Notifications</TabsTrigger>
        <TabsTrigger value="devices" className="rounded-full">Devices</TabsTrigger>
        <TabsTrigger value="privacy" className="rounded-full">Privacy</TabsTrigger>
      </TabsList>

      <TabsContent value="profile" className="space-y-5">
        <PanelCard title="Profile">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-xl font-bold text-primary">{user.avatar}</div>
            <Button variant="outline" size="sm" className="rounded-full" onClick={() => toast.success("Upload photo (demo)")}>Change photo</Button>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Field label="Full name" defaultValue={user.name} />
            <Field label="Email" defaultValue={user.email} type="email" />
            <Field label="Phone" defaultValue={user.phone} />
            <Field label="Date of birth" type="date" />
          </div>
          <Button className="mt-5 rounded-full" onClick={() => toast.success("Profile updated")}>Save changes</Button>
        </PanelCard>
      </TabsContent>

      <TabsContent value="security" className="space-y-5">
        <PanelCard title="Change password">
          <div className="grid max-w-md gap-3">
            <Field label="Current password" type="password" />
            <Field label="New password" type="password" />
            <Field label="Confirm new password" type="password" />
          </div>
          <Button className="mt-4 rounded-full" onClick={() => toast.success("Password updated")}><Lock className="mr-2 h-4 w-4" /> Update password</Button>
        </PanelCard>
        <PanelCard title="Two-factor authentication">
          <Row icon={KeyRound} title="Authenticator app" desc="Time-based one-time codes for extra security." action={<Switch />} />
          <Row icon={Smartphone} title="SMS verification" desc="Receive codes via text message." action={<Switch defaultChecked />} />
        </PanelCard>
        <PanelCard title="Login history">
          <ul className="divide-y divide-border/60 text-sm">
            {[
              { device: "iPhone 16 Pro - Safari", loc: "Coimbatore, IN", at: "Today, 09:14 AM", current: true },
              { device: "MacBook Air - Chrome", loc: "Coimbatore, IN", at: "Yesterday, 7:42 PM" },
              { device: "Pixel 9 - Chrome", loc: "Pune, IN", at: "3 days ago" },
            ].map((l, i) => (
              <li key={i} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="font-medium">{l.device}</p>
                  <p className="text-xs text-muted-foreground">{l.loc} - {l.at}</p>
                </div>
                {l.current ? <Badge variant="secondary" className="rounded-full bg-emerald-100 text-emerald-700">Current</Badge> : <Button size="sm" variant="ghost" className="rounded-full text-rose-600">Sign out</Button>}
              </li>
            ))}
          </ul>
        </PanelCard>
      </TabsContent>

      <TabsContent value="preferences" className="space-y-5">
        <PanelCard title="Language and region">
          <div className="grid max-w-xl gap-3 sm:grid-cols-2">
            <SelectField label="Language" options={["English","Hindi","Marathi","Tamil","Bengali"]} />
            <SelectField label="Currency" options={["INR","USD","EUR"]} />
          </div>
        </PanelCard>
        <PanelCard title="Appearance">
          <SelectField label="Theme" options={["System","Light","Dark"]} />
        </PanelCard>
      </TabsContent>

      <TabsContent value="notifications" className="space-y-5">
        <PanelCard title="Channels">
          <Row icon={Bell} title="Push notifications" desc="Order updates, deals and reminders." action={<Switch defaultChecked />} />
          <Row icon={Bell} title="Email" desc="Receipts, statements and offers." action={<Switch defaultChecked />} />
          <Row icon={Bell} title="SMS" desc="Critical delivery updates only." action={<Switch />} />
          <Row icon={Bell} title="WhatsApp" desc="Order updates on WhatsApp." action={<Switch defaultChecked />} />
        </PanelCard>
      </TabsContent>

      <TabsContent value="devices" className="space-y-5">
        <PanelCard title="Connected devices">
          <ul className="divide-y divide-border/60 text-sm">
            {[
              { icon: Smartphone, name: "iPhone 16 Pro", last: "Active now" },
              { icon: Monitor, name: "MacBook Air", last: "2 hours ago" },
              { icon: Smartphone, name: "Pixel 9", last: "3 days ago" },
            ].map((d, i) => (
              <li key={i} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-full bg-muted"><d.icon className="h-4 w-4" /></span>
                  <div>
                    <p className="font-medium">{d.name}</p>
                    <p className="text-xs text-muted-foreground">{d.last}</p>
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="rounded-full text-rose-600">Revoke</Button>
              </li>
            ))}
          </ul>
        </PanelCard>
      </TabsContent>

      <TabsContent value="privacy" className="space-y-5">
        <PanelCard title="Privacy">
          <Row icon={Shield} title="Personalised recommendations" desc="Use your activity to improve suggestions." action={<Switch defaultChecked />} />
          <Row icon={Globe} title="Share usage analytics" desc="Help us improve the app." action={<Switch />} />
        </PanelCard>
        <PanelCard title="Danger zone">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/60 p-4 dark:border-rose-900/40 dark:bg-rose-900/10">
            <div>
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">Delete account</p>
              <p className="text-xs text-rose-700/80 dark:text-rose-300/80">Permanently remove your SREE SUPER MART account and data.</p>
            </div>
            <Button variant="outline" className="rounded-full border-rose-300 text-rose-700 hover:bg-rose-100 dark:border-rose-900/60" onClick={() => toast.error("This is a demo")}>
              <Trash2 className="mr-2 h-4 w-4" /> Delete account
            </Button>
          </div>
        </PanelCard>
      </TabsContent>
    </Tabs>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Input {...props} className="mt-1 rounded-xl" />
    </div>
  );
}

function SelectField({ label, options }: { label: string; options: string[] }) {
  const [v, setV] = useState(options[0]);
  return (
    <div>
      <Label className="text-xs">{label}</Label>
      <Select value={v} onValueChange={setV}>
        <SelectTrigger className="mt-1 rounded-xl"><SelectValue /></SelectTrigger>
        <SelectContent>
          {options.map((o) => <SelectItem key={o} value={o}>{o}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );
}

function Row({ icon: Icon, title, desc, action }: { icon: React.ComponentType<{ className?: string }>; title: string; desc: string; action: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border/60 py-3 last:border-b-0 first:pt-0 last:pb-0">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-muted"><Icon className="h-4 w-4" /></span>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className="text-xs text-muted-foreground">{desc}</p>
        </div>
      </div>
      {action}
    </div>
  );
}