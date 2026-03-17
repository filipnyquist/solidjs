import { type Component, createSignal } from "solid-js";
import { Layout } from "../components/layout/Layout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { Select } from "../components/ui/Select";
import { SwitchToggle } from "../components/ui/SwitchToggle";
import { addToast } from "../store/toastStore";

export const SettingsPage: Component = () => {
  const [profile, setProfile] = createSignal({
    name: "Admin User",
    email: "admin@dashify.io",
    company: "Dashify Inc.",
    timezone: "UTC",
    language: "en",
  });

  const [notifications, setNotifications] = createSignal({
    emailOrders: true,
    emailUsers: true,
    emailAlerts: true,
    pushOrders: false,
    pushUsers: false,
  });

  const [saving, setSaving] = createSignal(false);

  async function saveProfile() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 800));
    setSaving(false);
    addToast({ title: "Profile saved", description: "Your profile settings have been updated.", variant: "success" });
  }

  async function saveNotifications() {
    setSaving(true);
    await new Promise(r => setTimeout(r, 600));
    setSaving(false);
    addToast({ title: "Preferences saved", description: "Notification settings updated.", variant: "success" });
  }

  function toggle(key: keyof ReturnType<typeof notifications>) {
    setNotifications(n => ({ ...n, [key]: !n[key] }));
  }

  const emailPrefs: { key: keyof ReturnType<typeof notifications>; label: string; desc: string }[] = [
    { key: "emailOrders", label: "New Orders",    desc: "Get notified when a new order is placed" },
    { key: "emailUsers",  label: "New Users",     desc: "Get notified when a new user signs up" },
    { key: "emailAlerts", label: "System Alerts", desc: "Receive critical system and security alerts" },
  ];

  const pushPrefs: { key: keyof ReturnType<typeof notifications>; label: string; desc: string }[] = [
    { key: "pushOrders", label: "Order Updates",  desc: "Push alerts for order status changes" },
    { key: "pushUsers",  label: "User Activity",  desc: "Push alerts for new user registrations" },
  ];

  return (
    <Layout title="Settings" subtitle="Manage your account and preferences">
      <div class="max-w-2xl space-y-6">
        {/* Profile */}
        <Card>
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
            <CardDescription>Update your personal details and account information.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-4">
              <div class="flex items-center gap-4 mb-6">
                <div class="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xl font-bold">
                  A
                </div>
                <div>
                  <Button variant="outline" size="sm">Change Photo</Button>
                  <p class="text-xs text-muted-foreground mt-1">JPG, GIF or PNG. Max 1MB.</p>
                </div>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Full Name</label>
                  <Input value={profile().name} onInput={(e) => setProfile(p => ({ ...p, name: e.currentTarget.value }))} />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">Email</label>
                  <Input type="email" value={profile().email} onInput={(e) => setProfile(p => ({ ...p, email: e.currentTarget.value }))} />
                </div>
              </div>
              <div class="space-y-2">
                <label class="text-sm font-medium">Company</label>
                <Input value={profile().company} onInput={(e) => setProfile(p => ({ ...p, company: e.currentTarget.value }))} />
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="space-y-2">
                  <label class="text-sm font-medium">Timezone</label>
                  <Select
                    options={[
                      { value: "UTC",                  label: "UTC" },
                      { value: "America/New_York",      label: "Eastern Time" },
                      { value: "America/Chicago",       label: "Central Time" },
                      { value: "America/Los_Angeles",   label: "Pacific Time" },
                      { value: "Europe/London",         label: "London" },
                      { value: "Europe/Paris",          label: "Paris" },
                    ]}
                    value={profile().timezone}
                    onChange={(v) => setProfile(p => ({ ...p, timezone: v }))}
                  />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium">Language</label>
                  <Select
                    options={[
                      { value: "en", label: "English" },
                      { value: "es", label: "Spanish" },
                      { value: "fr", label: "French" },
                      { value: "de", label: "German" },
                    ]}
                    value={profile().language}
                    onChange={(v) => setProfile(p => ({ ...p, language: v }))}
                  />
                </div>
              </div>
              <div class="flex justify-end pt-2">
                <Button onClick={saveProfile} disabled={saving()}>
                  {saving() ? "Saving..." : "Save Profile"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>Choose how and when you'd like to be notified.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="space-y-1">
              <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                Email Notifications
              </h4>
              {emailPrefs.map(({ key, label, desc }) => (
                <div class="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p class="text-sm font-medium">{label}</p>
                    <p class="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <SwitchToggle
                    checked={notifications()[key]}
                    onChange={() => toggle(key)}
                    aria-label={`Toggle ${label}`}
                  />
                </div>
              ))}

              <h4 class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 mt-5">
                Push Notifications
              </h4>
              {pushPrefs.map(({ key, label, desc }) => (
                <div class="flex items-center justify-between py-3 border-b border-border last:border-0">
                  <div>
                    <p class="text-sm font-medium">{label}</p>
                    <p class="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <SwitchToggle
                    checked={notifications()[key]}
                    onChange={() => toggle(key)}
                    aria-label={`Toggle ${label}`}
                  />
                </div>
              ))}
              <div class="flex justify-end pt-4">
                <Button onClick={saveNotifications} disabled={saving()}>
                  {saving() ? "Saving..." : "Save Preferences"}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card class="border-destructive/50">
          <CardHeader>
            <CardTitle class="text-destructive">Danger Zone</CardTitle>
            <CardDescription>Irreversible actions. Proceed with caution.</CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm font-medium">Delete Account</p>
                <p class="text-xs text-muted-foreground">Permanently delete your account and all data</p>
              </div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => addToast({ title: "Action blocked", description: "Account deletion is disabled in demo mode.", variant: "warning" })}
              >
                Delete Account
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};
