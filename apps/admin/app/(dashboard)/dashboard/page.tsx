import { DashboardPage } from "@/app/features/dashboard";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <DashboardPage searchParams={searchParams} />;
}
