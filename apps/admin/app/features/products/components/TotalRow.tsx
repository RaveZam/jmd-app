import { ReactElement } from "react";
import { formatCurrencyPHP } from "../helpers/getPhpCurrency";
export function TotalRow({ total }: { total: number }): ReactElement {
  return (
    <tr className="border-t bg-muted/30">
      <td className="px-3 py-3 text-xs font-medium text-muted-foreground">
        Total
      </td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
        {formatCurrencyPHP(total)}
      </td>
      <td />
    </tr>
  );
}
