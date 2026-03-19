import type { LoggedItem } from "../hooks/useDistributionLog";

export function computeSummary(loggedItems: LoggedItem[]) {
  const netTotal = loggedItems.reduce((s, i) => s + i.qty * i.price, 0);
  return { netTotal };
}
