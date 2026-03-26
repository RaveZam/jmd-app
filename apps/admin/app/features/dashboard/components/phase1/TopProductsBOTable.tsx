import type { ReactElement } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function TopProductsBOTable(): ReactElement {
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
              <tr className="border-t">
                <td className="px-3 py-2">Spanish Bread</td>
                <td className="px-3 py-2 text-right tabular-nums">20</td>
                <td className="px-3 py-2 text-right tabular-nums">₱600</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2">Ensaymada</td>
                <td className="px-3 py-2 text-right tabular-nums">7</td>
                <td className="px-3 py-2 text-right tabular-nums">₱245</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2">Cheese Bread</td>
                <td className="px-3 py-2 text-right tabular-nums">5</td>
                <td className="px-3 py-2 text-right tabular-nums">₱200</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2">Brownies (4pc)</td>
                <td className="px-3 py-2 text-right tabular-nums">4</td>
                <td className="px-3 py-2 text-right tabular-nums">₱380</td>
              </tr>
              <tr className="border-t">
                <td className="px-3 py-2">Pandesal (12pc)</td>
                <td className="px-3 py-2 text-right tabular-nums">3</td>
                <td className="px-3 py-2 text-right tabular-nums">₱165</td>
              </tr>
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
