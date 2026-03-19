import type { LoggedItem } from "../hooks/useDistributionLog";

export function getSoldItems(loggedItems: LoggedItem[]) {
  return loggedItems.map((item, idx) => ({ item, idx }));
}


export function computeSummary(loggedItems: LoggedItem[]) {
  const netTotal = loggedItems.reduce((s, i) => s + i.qty * i.price, 0);
  return { netTotal };
}
