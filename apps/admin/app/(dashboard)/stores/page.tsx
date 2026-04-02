import { StoresPage } from "@/app/features/stores";
import type { ReactElement } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}): Promise<ReactElement> {
  const { year } = await searchParams;
  const parsedYear = year ? parseInt(year, 10) : new Date().getFullYear();
  return <StoresPage year={parsedYear} />;
}
