export interface IntelligenceAction {
  id: string;
  title: string;
  why: string;
  action: string;
  priority: "P0" | "P1" | "P2" | "P3";
  confidence: "High" | "Med" | "Low" | "Critical";
}

export const NEXT_BEST_ACTIONS: IntelligenceAction[] = [
  {
    id: "a-1",
    title: "Reduce Spanish Bread allocation",
    why: "BO rate hit 44% over the last 3 sessions — excess stock is not selling through.",
    action: "Cut delivery by 20% for next run and monitor sell-through.",
    priority: "P1",
    confidence: "High",
  },
  {
    id: "a-2",
    title: "Follow up with Ben on variance discrepancy",
    why: "5-unit variance recorded on 2026-02-21 with no return logged.",
    action: "Request end-of-day reconciliation sheet from agent.",
    priority: "P2",
    confidence: "Med",
  },
  {
    id: "a-3",
    title: "Increase Pandesal allocation at SM City",
    why: "Consistently sells out — Angel's last 3 sessions show zero BO for this SKU.",
    action: "Add 10 units to next delivery and track for over-ordering.",
    priority: "P2",
    confidence: "Med",
  },
];
