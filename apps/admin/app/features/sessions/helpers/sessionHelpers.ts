import type { SessionStoreRow } from "../types/session-types";

export function formatSessionDate(dateStr: string): string {
  const d = new Date(`${dateStr}T00:00:00`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function visitRate(visited: number, total: number): string {
  if (total === 0) return "0%";
  return `${Math.round((visited / total) * 100)}%`;
}

export function normalizeProvince(province: string | null): string {
  if (!province) return "";
  return province.toLowerCase().replace(/\s+/g, "");
}

export function groupStoresByProvince(
  stores: SessionStoreRow[],
): { key: string; displayName: string; stores: SessionStoreRow[] }[] {
  const map = new Map<string, { displayName: string; stores: SessionStoreRow[] }>();
  for (const store of stores) {
    const key = normalizeProvince(store.province);
    const safeKey = key || "__unknown__";
    if (!map.has(safeKey)) {
      map.set(safeKey, {
        displayName: store.province?.trim() || "Unknown",
        stores: [],
      });
    }
    map.get(safeKey)!.stores.push(store);
  }
  return Array.from(map.entries()).map(([key, val]) => ({ key, ...val }));
}
