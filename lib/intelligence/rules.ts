import type { DashboardSnapshot, InsightAction } from "./types";

const VARIANCE_SPIKE_MIN = 10;
const VARIANCE_MULTIPLIER = 2;
const BO_SPIKE_DELTA = 0.03;
const REVENUE_DROP_FACTOR = 0.85;
const AGENT_BO_RATE_THRESHOLD = 0.15;
const AGENT_VARIANCE_THRESHOLD = 5;
const CONCENTRATION_THRESHOLD = 0.6;
const STORE_BO_THRESHOLD = 0.2;
const BO_JUMP_PCT = 0.5;

function avg(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

const priorityOrder = { P0: 0, P1: 1, P2: 2, P3: 3 };
const confidenceOrder = { High: 0, Med: 1, Low: 2, Critical: 3 };

function sortActions(actions: InsightAction[]): InsightAction[] {
  return [...actions].sort((a, b) => {
    const p = priorityOrder[a.priority] - priorityOrder[b.priority];
    if (p !== 0) return p;
    return confidenceOrder[a.confidence] - confidenceOrder[b.confidence];
  });
}

export function runInsightRules(snapshot: DashboardSnapshot): InsightAction[] {
  const actions: InsightAction[] = [];
  const h = snapshot.history;
  const t = snapshot.totals;
  const last7 = h.slice(-7);
  const avgVariance = avg(last7.map((x) => x.varianceQty));
  const avgBoRate = avg(last7.map((x) => x.boRate));
  const avgRevenue = avg(last7.map((x) => x.revenue));

  if (last7.length < 7) {
    actions.push({
      id: "low-confidence-history",
      title: "Insufficient history for 7-day baseline",
      why: `Only ${h.length} days of data (7 needed). Metrics use available ${last7.length}-day average.`,
      action: "Use last 7 or 30 days of real data for more reliable insights.",
      priority: "P2",
      confidence: "Low",
    });
  }

  if (h.length >= 1) {
    const todayV = t.varianceQty;
    const threshold = Math.max(
      VARIANCE_SPIKE_MIN,
      VARIANCE_MULTIPLIER * avgVariance,
    );
    if (todayV > threshold) {
      actions.push({
        id: "variance-spike",
        title: "Variance spike today",
        why: `Variance is ${todayV} vs 7-day avg ${avgVariance.toFixed(1)} (threshold ${threshold.toFixed(0)}).`,
        action:
          "Review today's deliveries and agent variance; reconcile discrepancies.",
        priority: "P0",
        confidence: "Critical",
      });
    }
  }

  if (last7.length >= 1 && avgBoRate >= 0) {
    const todayBO = t.boRate;
    if (todayBO > avgBoRate + BO_SPIKE_DELTA) {
      actions.push({
        id: "bo-spike",
        title: "BO rate above recent average",
        why: `Today BO rate ${(todayBO * 100).toFixed(1)}% vs 7-day avg ${(avgBoRate * 100).toFixed(1)}% (+${((todayBO - avgBoRate) * 100).toFixed(1)}%).`,
        action:
          "Check product mix and stock levels; follow up with high-BO agents.",
        priority: "P1",
        confidence: "High",
      });
    }
  }

  if (last7.length >= 1 && avgRevenue > 0) {
    if (t.revenue < avgRevenue * REVENUE_DROP_FACTOR) {
      actions.push({
        id: "revenue-drop",
        title: "Revenue below recent average",
        why: `Today revenue ₱${t.revenue.toLocaleString()} vs 7-day avg ₱${avgRevenue.toFixed(0)} (${((t.revenue / avgRevenue) * 100).toFixed(0)}%).`,
        action:
          "Review route coverage and demand; consider promotions or inventory adjustment.",
        priority: "P1",
        confidence: "High",
      });
    }
  }

  for (const agent of snapshot.agents) {
    if (
      agent.varianceQty > AGENT_VARIANCE_THRESHOLD ||
      agent.boRate > AGENT_BO_RATE_THRESHOLD
    ) {
      actions.push({
        id: `agent-risk-${agent.id}`,
        title: `Investigate ${agent.name} variance or BO`,
        why: `Variance ${agent.varianceQty} pcs, BO rate ${(agent.boRate * 100).toFixed(1)}% (thresholds: variance > ${AGENT_VARIANCE_THRESHOLD}, BO > ${(AGENT_BO_RATE_THRESHOLD * 100).toFixed(0)}%).`,
        action: "Discuss with agent and review their route/product mix.",
        priority: agent.varianceQty > 10 || agent.boRate > 0.2 ? "P0" : "P1",
        confidence: "Med",
      });
    }
  }

  if (snapshot.agents.length >= 1 && t.revenue > 0) {
    const topAgent = snapshot.agents.reduce((a, b) =>
      b.revenue > a.revenue ? b : a,
    );
    const share = topAgent.revenue / t.revenue;
    if (share > CONCENTRATION_THRESHOLD) {
      actions.push({
        id: "concentration-risk",
        title: "Revenue concentration in one agent",
        why: `${topAgent.name} has ${(share * 100).toFixed(0)}% of revenue (threshold ${(CONCENTRATION_THRESHOLD * 100).toFixed(0)}%).`,
        action:
          "Diversify routes or cross-train; avoid single-point dependency.",
        priority: "P2",
        confidence: "Low",
      });
    }
  }

  if (snapshot.stores && snapshot.stores.length > 0) {
    for (const store of snapshot.stores) {
      if (store.boRate > STORE_BO_THRESHOLD) {
        actions.push({
          id: `store-bo-${store.id}`,
          title: `BO hotspot: ${store.name}`,
          why: `Store BO rate ${(store.boRate * 100).toFixed(1)}% (threshold ${(STORE_BO_THRESHOLD * 100).toFixed(0)}%).`,
          action: "Review store demand and allocation; adjust next delivery.",
          priority: "P1",
          confidence: "Med",
        });
      }
    }
  }

  if (h.length >= 3) {
    const last3 = h.slice(-3);
    const revs = last3.map((x) => x.revenue);
    if (revs[0]! > revs[1]! && revs[1]! > revs[2]!) {
      actions.push({
        id: "sustained-decline",
        title: "Revenue declining 3 days in a row",
        why: `Last 3 days: ₱${revs[2]?.toLocaleString()}, ₱${revs[1]?.toLocaleString()}, ₱${revs[0]?.toLocaleString()}.`,
        action:
          "Identify cause (seasonality, route issues, stock); plan corrective action.",
        priority: "P1",
        confidence: "High",
      });
    }
  }

  if (h.length >= 2) {
    const prev = h[h.length - 2]!;
    const curr = h[h.length - 1]!;
    if (prev.boRate > 0 && curr.boRate > prev.boRate * (1 + BO_JUMP_PCT)) {
      actions.push({
        id: "sudden-bo-jump",
        title: "Sudden BO rate jump vs yesterday",
        why: `BO rate ${(curr.boRate * 100).toFixed(1)}% vs yesterday ${(prev.boRate * 100).toFixed(1)}% (>50% increase).`,
        action:
          "Check for one-off returns or allocation error; confirm with agents.",
        priority: "P0",
        confidence: "Critical",
      });
    }
  }

  actions.push({
    id: "high-edits-flags",
    title: "High edits / flags review",
    why: "Edits and flags data not yet available in this view.",
    action:
      "When available: review high-edit agents and resolve data quality issues.",
    priority: "P2",
    confidence: "Low",
  });

  // Highlight top performing store (if present)
  if (snapshot.stores && snapshot.stores.length > 0 && t.revenue > 0) {
    const topStore = snapshot.stores.reduce((a, b) =>
      b.revenue > a.revenue ? b : a,
    );
    const share = topStore.revenue / t.revenue;
    actions.push({
      id: `top-store-${topStore.id}`,
      title: `Top performing store: ${topStore.name}`,
      why: `${topStore.name} generated ₱${topStore.revenue.toLocaleString()} (${(share * 100).toFixed(0)}% of today's revenue).`,
      action:
        "Consider increasing stock or replicating successful allocation to similar stores.",
      priority: "P2",
      confidence: "High",
    });
  }

  // Flag the store with the highest BO rate for review
  if (snapshot.stores && snapshot.stores.length > 0) {
    const worstStore = snapshot.stores.reduce((a, b) =>
      b.boRate > a.boRate ? b : a,
    );
    if (worstStore.boRate > STORE_BO_THRESHOLD * 1.25) {
      actions.push({
        id: `worst-store-${worstStore.id}`,
        title: `Store with high BO: ${worstStore.name}`,
        why: `${worstStore.name} BO rate ${(worstStore.boRate * 100).toFixed(1)}% — among the highest today.`,
        action:
          "Investigate local demand, returns, and allocation for this store.",
        priority: "P1",
        confidence: "Med",
      });
    }
  }

  // Identify the most at-risk agent (high BO + variance) and mark as actionable
  if (snapshot.agents && snapshot.agents.length > 0) {
    const riskyAgent = snapshot.agents.reduce((a, b) => {
      const scoreA = a.boRate * 2 + a.varianceQty / 10;
      const scoreB = b.boRate * 2 + b.varianceQty / 10;
      return scoreB > scoreA ? b : a;
    });
    if (riskyAgent.boRate > 0.2 || riskyAgent.varianceQty > 12) {
      actions.push({
        id: `risky-agent-${riskyAgent.id}`,
        title: `Underperforming agent: ${riskyAgent.name}`,
        why: `${riskyAgent.name} has BO ${(riskyAgent.boRate * 100).toFixed(1)}% and variance ${riskyAgent.varianceQty} pcs — operational risk.`,
        action:
          "Place agent on review: consider retraining, reassignment, or termination if no improvement.",
        priority: "P0",
        confidence: "High",
      });
    }
  }

  // Systemic BO across multiple stores — suggests broader operational issue
  if (snapshot.stores && snapshot.stores.length > 1) {
    const highBoStores = snapshot.stores.filter(
      (s) => s.boRate > STORE_BO_THRESHOLD,
    );
    if (highBoStores.length >= 2) {
      const names = highBoStores
        .map((s) => s.name)
        .slice(0, 3)
        .join(", ");
      actions.push({
        id: "systemic-bo-multi-store",
        title: "Multiple stores showing high BO",
        why: `Several stores (${names}${highBoStores.length > 3 ? ", ..." : ""}) have elevated BO rates indicating a possible systemic issue.`,
        action:
          "Investigate shared causes (shipment, packaging, product quality) and coordinate a cross-store corrective plan.",
        priority: "P1",
        confidence: "High",
      });
    }
  }

  const deduped = actions.filter(
    (a, i) => actions.findIndex((b) => b.id === a.id) === i,
  );
  return sortActions(deduped).slice(0, 5);
}
