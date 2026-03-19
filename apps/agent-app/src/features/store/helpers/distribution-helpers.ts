import type { LoggedItem } from "../hooks/useDistributionLog";

export function getSoldItems(loggedItems: LoggedItem[]) {
  return loggedItems
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.qty > 0);
}

export function getBadItems(loggedItems: LoggedItem[]) {
  return loggedItems
    .map((item, idx) => ({ item, idx }))
    .filter(({ item }) => item.boQty > 0);
}

export function computeSummary(loggedItems: LoggedItem[]) {
  const grossSales = loggedItems.reduce((s, i) => s + i.qty * i.price, 0);
  const boDeduction = loggedItems.reduce((s, i) => s + i.boQty * i.price, 0);
  return { grossSales, boDeduction, netTotal: grossSales - boDeduction };
}
