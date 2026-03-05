import { RecordsPage } from "@/app/features/records";

export default function Page({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  return <RecordsPage searchParams={searchParams} />;
}
