import type { LedgerRecord } from "@/lib/mock/records";

export type RecordDerived = {
  lineTotal: number;
  boValue: number;
};

export function deriveRecord(r: LedgerRecord): RecordDerived {
  const lineTotal = r.soldQty * r.unitPrice;
  const boValue = r.boQty * r.unitPrice;
  return { lineTotal, boValue };
}

export function selectAgents(records: LedgerRecord[]): string[] {
  return Array.from(new Set(records.map((r) => r.agent))).sort((a, b) =>
    a.localeCompare(b),
  );
}
