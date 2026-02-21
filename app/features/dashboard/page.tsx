import Sidebar from "./components/Sidebar";
import { ProgressRing } from "./components/ProgressRing";
import { ProjectAnalyticsChart } from "./components/ProjectAnalyticsChart";
import { StatsCard } from "./components/StatsCard";
import { TeamCard } from "./components/TeamCard";
import { TimeTracker } from "./components/TimeTracker";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { ReactElement } from "react";
import {
  Bell,
  CheckCircle2,
  Download,
  Mail,
  Plus,
  Search,
  Wrench,
} from "lucide-react";

const teamMembers = [
  {
    name: "Alexandra Deff",
    subtitle: "Working on Github Project Repository",
    status: "Completed" as const,
    avatarFallback: "AD",
  },
  {
    name: "Edwin Adenik",
    subtitle: "Working on Integrate User Authentication System",
    status: "In Progress" as const,
    avatarFallback: "EA",
  },
  {
    name: "Isaac Ovuatueomiron",
    subtitle: "Working on Develop Search and Filter Functionality",
    status: "Pending" as const,
    avatarFallback: "IO",
  },
  {
    name: "David Oshod",
    subtitle: "Working on Responsive Layout for Homepage",
    status: "In Progress" as const,
    avatarFallback: "DO",
  },
];

const projects = [
  {
    title: "Develop API Endpoints",
    due: "Nov 26, 2024",
    icon: <Wrench className="h-4 w-4" />,
    tint: "bg-blue-50 text-blue-700",
  },
  {
    title: "Onboarding Flow",
    due: "Nov 28, 2024",
    icon: <Download className="h-4 w-4" />,
    tint: "bg-emerald-50 text-emerald-700",
  },
  {
    title: "Build Dashboard",
    due: "Nov 30, 2024",
    icon: <CheckCircle2 className="h-4 w-4" />,
    tint: "bg-amber-50 text-amber-700",
  },
  {
    title: "Optimize Page Load",
    due: "Dec 05, 2024",
    icon: <CheckCircle2 className="h-4 w-4" />,
    tint: "bg-violet-50 text-violet-700",
  },
];

function TopBar(): ReactElement {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-[420px]">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search task"
          className="rounded-2xl pl-9 shadow-soft"
        />
      </div>

      <div className="flex items-center justify-between gap-3 md:justify-end">
        <div className="flex items-center gap-2">
          <Button size="icon" variant="ghost" className="rounded-full">
            <Mail className="h-5 w-5 text-muted-foreground" />
          </Button>
          <Button size="icon" variant="ghost" className="rounded-full">
            <Bell className="h-5 w-5 text-muted-foreground" />
          </Button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border bg-card px-3 py-2 shadow-soft">
          <div className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-800">
            TM
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold">Totok Michael</p>
            <p className="text-xs text-muted-foreground">tmichael20@mail.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function RemindersCard(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Reminders</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-lg font-semibold text-emerald-900">
          Meeting with Arc Company
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          Time: 02.00 pm - 04.00 pm
        </p>
        <Button className="mt-4 w-full rounded-2xl">Start Meeting</Button>
      </CardContent>
    </Card>
  );
}

function ProjectsCard(): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base">Project</CardTitle>
        <button className="rounded-full border px-3 py-1 text-xs text-muted-foreground hover:bg-muted">
          + New
        </button>
      </CardHeader>
      <CardContent className="space-y-3">
        {projects.map((p) => (
          <div key={p.title} className="flex items-center gap-3">
            <div
              className={`grid h-9 w-9 place-items-center rounded-xl ${p.tint}`}
            >
              {p.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">{p.title}</p>
              <p className="text-xs text-muted-foreground">Due date: {p.due}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

function DashboardHeaderSection(): ReactElement {
  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Plan, prioritize, and accomplish your tasks with ease.
        </p>
      </div>
      <div className="flex items-center gap-3">
        <Button className="rounded-2xl">
          <Plus className="h-4 w-4" />
          Add Project
        </Button>
        <Button variant="outline" className="rounded-2xl">
          Import Data
        </Button>
      </div>
    </div>
  );
}

function StatsGridSection(): ReactElement {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatsCard
        title="Total Projects"
        value={24}
        tone="primary"
        footer="Increased from last month"
      />
      <StatsCard title="Ended Projects" value={10} footer="Increased from last month" />
      <StatsCard title="Running Projects" value={12} footer="Increased from last month" />
      <StatsCard title="Pending Project" value={2} footer="On Discuss" />
    </div>
  );
}

function DashboardLeftColumn(): ReactElement {
  return (
    <div className="space-y-6">
      <ProjectAnalyticsChart />
      <TeamCard members={teamMembers} />
    </div>
  );
}

function DashboardRightColumn(): ReactElement {
  return (
    <div className="space-y-6">
      <RemindersCard />
      <ProjectsCard />
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-1">
        <ProgressRing percent={41} />
        <TimeTracker />
      </div>
    </div>
  );
}

function DashboardContentGrid(): ReactElement {
  return (
    <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
      <DashboardLeftColumn />
      <DashboardRightColumn />
    </div>
  );
}

export function DashboardPage(): ReactElement {
  return (
    <main className="min-h-dvh bg-slate-50/60 p-4 md:p-6">
      <div className="mx-auto flex max-w-[1400px] gap-6">
        <Sidebar />

        <section className="min-w-0 flex-1 space-y-6">
          <TopBar />
          <DashboardHeaderSection />
          <StatsGridSection />
          <DashboardContentGrid />

        </section>
      </div>
    </main>
  );
}

export default DashboardPage;

