import { computeSummary } from "./distribution-helpers";
import type { LoggedItem } from "../hooks/useDistributionLog";

// A small factory so each test only specifies the fields it cares about.
function makeItem(overrides: Partial<LoggedItem> = {}): LoggedItem {
  return {
    saleId: "s1",
    productId: "p1",
    productName: "Pandesal",
    price: 0,
    qty: 0,
    boQty: 0,
    ...overrides,
  };
}

describe("computeSummary", () => {
  // Happy path: the normal case you expect every day.
  test("sums qty * price across all items", () => {
    const items = [
      makeItem({ price: 10, qty: 3 }), // 30
      makeItem({ price: 5, qty: 4 }), //  20
    ];

    const result = computeSummary(items);

    expect(result.netTotal).toBe(50);
  });

  // Edge case: empty list should be 0, not crash or NaN.
  test("returns 0 for an empty list", () => {
    expect(computeSummary([]).netTotal).toBe(0);
  });

  // Edge case: a zero-quantity line contributes nothing.
  test("ignores items with zero quantity", () => {
    const items = [makeItem({ price: 99, qty: 0 })];
    expect(computeSummary(items).netTotal).toBe(0);
  });
});
