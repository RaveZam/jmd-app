export type DashboardSnapshot = {
  date: string; // YYYY-MM-DD (latest day in range)
  totals: {
    deliveredQty: number;
    soldQty: number;
    revenue: number;
    boQty: number;
    varianceQty: number;
    boRate: number; // 0-1
  };
  agents: Array<{
    id: string;
    name: string;
    revenue: number;
    boRate: number; // 0-1
    varianceQty: number;
  }>;
  stores?: Array<{
    id: string;
    name: string;
    revenue: number;
    boRate: number; // 0-1
  }>;
  history: Array<{
    date: string;
    revenue: number;
    boRate: number; // 0-1
    varianceQty: number;
  }>;
};

export type InsightAction = {
  id: string;
  title: string;
  why: string;
  action: string;
  priority: "P0" | "P1" | "P2";
  confidence: "Low" | "Med" | "High";
};

export type ForecastDay = {
  date: string;
  revenue: number;
  note: string;
};
