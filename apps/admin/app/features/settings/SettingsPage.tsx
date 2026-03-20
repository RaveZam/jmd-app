"use client";

import type { ReactElement } from "react";
import { Bell, Palette, User } from "lucide-react";

import { cn } from "@/lib/utils";

type SettingsSectionProps = {
  title: string;
  description: string;
  children: ReactElement | ReactElement[];
};

function SettingsSection({
  title,
  description,
  children,
}: SettingsSectionProps): ReactElement {
  return (
    <div className="rounded-xl border bg-card p-6">
      <div className="mb-4">
        <h2 className="text-base font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

type SettingsRowProps = {
  label: string;
  description?: string;
  children: ReactElement;
};

function SettingsRow({
  label,
  description,
  children,
}: SettingsRowProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-4">
      <div className="min-w-0">
        <p className="text-sm font-medium">{label}</p>
        {description ? (
          <p className="text-xs text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

function Toggle({
  defaultChecked = false,
}: {
  defaultChecked?: boolean;
}): ReactElement {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        className="peer sr-only"
        defaultChecked={defaultChecked}
      />
      <div
        className={cn(
          "h-5 w-9 rounded-full bg-muted transition-colors",
          "peer-checked:bg-emerald-600",
          "after:absolute after:left-[2px] after:top-[2px] after:h-4 after:w-4 after:rounded-full after:bg-white after:transition-all after:content-['']",
          "peer-checked:after:translate-x-4",
        )}
      />
    </label>
  );
}

function Select({
  options,
  defaultValue,
}: {
  options: string[];
  defaultValue?: string;
}): ReactElement {
  return (
    <select
      className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
      defaultValue={defaultValue}
    >
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  );
}

function SettingsPage(): ReactElement {
  return (
    <>
      <header className="sticky top-0 z-20 border-b bg-slate-50/80 px-6 py-5 backdrop-blur">
        <div className="mx-auto w-full max-w-[1200px]">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">
                Settings
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account and application preferences.
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto px-6 py-6">
        <div className="mx-auto w-full max-w-[1200px] space-y-6">
          {/* Profile */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
            <User className="h-3.5 w-3.5" />
            PROFILE
          </div>
          <SettingsSection
            title="Account Information"
            description="Your personal details and contact information."
          >
            <SettingsRow label="Display Name" description="Shown across the dashboard.">
              <input
                type="text"
                defaultValue="Admin"
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </SettingsRow>
            <SettingsRow label="Email Address" description="Used for login and notifications.">
              <input
                type="email"
                defaultValue="admin@jmdbakery.com"
                className="rounded-lg border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-600"
              />
            </SettingsRow>
          </SettingsSection>

          {/* Notifications */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
            <Bell className="h-3.5 w-3.5" />
            NOTIFICATIONS
          </div>
          <SettingsSection
            title="Notification Preferences"
            description="Control what updates you receive."
          >
            <SettingsRow
              label="Daily Summary"
              description="Receive a daily report of sales and route activity."
            >
              <Toggle defaultChecked />
            </SettingsRow>
            <SettingsRow
              label="Agent Activity Alerts"
              description="Get notified when agents complete sessions."
            >
              <Toggle defaultChecked />
            </SettingsRow>
            <SettingsRow
              label="Low Stock Warnings"
              description="Alert when product inventory is running low."
            >
              <Toggle />
            </SettingsRow>
          </SettingsSection>

          {/* Appearance */}
          <div className="flex items-center gap-2 text-xs font-medium tracking-wider text-muted-foreground">
            <Palette className="h-3.5 w-3.5" />
            APPEARANCE
          </div>
          <SettingsSection
            title="Display Preferences"
            description="Customize the look and feel of the dashboard."
          >
            <SettingsRow label="Theme" description="Choose your preferred color scheme.">
              <Select options={["Light", "Dark", "System"]} defaultValue="Light" />
            </SettingsRow>
            <SettingsRow
              label="Compact Mode"
              description="Reduce spacing for a denser layout."
            >
              <Toggle />
            </SettingsRow>
            <SettingsRow
              label="Dark Sidebar"
              description="Use a dark background for the navigation sidebar."
            >
              <Toggle />
            </SettingsRow>
          </SettingsSection>

        </div>
      </div>
    </>
  );
}

export { SettingsPage };
export default SettingsPage;
