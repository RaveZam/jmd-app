"use client";

import type { ComponentType, ReactElement, ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  CalendarDays,
  CheckSquare,
  Download,
  HelpCircle,
  LayoutGrid,
  LogOut,
  Settings,
  Users,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  badge?: ReactNode;
};

const menuItems: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  {
    href: "/dashboard/tasks",
    label: "Tasks",
    icon: CheckSquare,
    badge: <Badge variant="success">12</Badge>,
  },
  { href: "/dashboard/calendar", label: "Calendar", icon: CalendarDays },
  { href: "/dashboard/analytics", label: "Analytics", icon: BarChart3 },
  { href: "/dashboard/team", label: "Team", icon: Users },
];

const generalItems: NavItem[] = [
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/help", label: "Help", icon: HelpCircle },
  { href: "/logout", label: "Logout", icon: LogOut },
];

function SidebarNavItem({
  item,
  isActive,
}: {
  item: NavItem;
  isActive: boolean;
}): ReactElement {
  const Icon = item.icon;
  return (
    <li>
      <Link
        href={item.href}
        className={cn(
          "flex items-center justify-between rounded-lg px-3 py-2 text-sm transition-colors",
          isActive
            ? "bg-emerald-50 text-emerald-900"
            : "text-muted-foreground hover:bg-muted hover:text-foreground"
        )}
      >
        <span className="flex items-center gap-2">
          <Icon
            className={cn(
              "h-4 w-4",
              isActive ? "text-emerald-700" : "text-muted-foreground"
            )}
          />
          {item.label}
        </span>
        {item.badge}
      </Link>
    </li>
  );
}

function SidebarNavSection({
  title,
  items,
}: {
  title: string;
  items: NavItem[];
}): ReactElement {
  const pathname = usePathname();
  return (
    <div>
      <p className="px-3 pb-2 text-[11px] font-medium tracking-wider text-muted-foreground">
        {title}
      </p>
      <ul className="space-y-1">
        {items.map((item) => (
          <SidebarNavItem
            key={item.href}
            item={item}
            isActive={pathname === item.href}
          />
        ))}
      </ul>
    </div>
  );
}

export function Sidebar(): ReactElement {
  return (
    <aside className="flex h-[calc(100dvh-2rem)] w-[260px] flex-col rounded-2xl border bg-card p-4 shadow-soft">
      <div className="mb-4 flex items-center gap-2 px-2">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-emerald-700 text-white">
          <LayoutGrid className="h-4 w-4" />
        </div>
        <div className="leading-tight">
          <p className="text-sm font-semibold">Donezo</p>
          <p className="text-xs text-muted-foreground">Workspace</p>
        </div>
      </div>

      <div className="flex-1 space-y-6 overflow-auto pb-2">
        <SidebarNavSection title="MENU" items={menuItems} />
        <SidebarNavSection title="GENERAL" items={generalItems} />
      </div>

      <div className="mt-4 rounded-2xl bg-gradient-to-br from-emerald-900 via-emerald-900 to-emerald-700 p-4 text-white shadow-soft">
        <p className="text-sm font-semibold">Download our Mobile App</p>
        <p className="mt-1 text-xs text-emerald-50/80">
          Get easy access on the go.
        </p>
        <Link
          href="#"
          className="mt-3 inline-flex w-fit items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium hover:bg-white/15"
        >
          <Download className="h-4 w-4" />
          Download
        </Link>
      </div>
    </aside>
  );
}

export default Sidebar;

