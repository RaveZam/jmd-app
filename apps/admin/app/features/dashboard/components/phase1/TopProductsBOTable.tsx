import type { ReactElement } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TopProduct } from "@/lib/selectors/metrics";

function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}

export function TopProductsBOTable({
  products,
}: {
  products: TopProduct[];
}): ReactElement {
  return (
    <Card className="shadow-soft">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Top 5 BO products</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-hidden rounded-xl border bg-background">
          <table className="w-full text-sm">
            <thead className="bg-muted/40 text-xs text-muted-foreground">
              <tr>
                <th className="px-3 py-2 text-left font-medium">Product</th>
                <th className="px-3 py-2 text-right font-medium">BO Qty</th>
                <th className="px-3 py-2 text-right font-medium">₱</th>
              </tr>
            </thead>
            <tbody>
              {products.length ? (
                products.map((p) => (
                  <tr key={p.product} className="border-t">
                    <td className="px-3 py-2">{p.product}</td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {p.qty}
                    </td>
                    <td className="px-3 py-2 text-right tabular-nums">
                      {formatCurrencyPHP(p.value)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={3}
                    className="px-3 py-6 text-center text-muted-foreground"
                  >
                    No data.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

