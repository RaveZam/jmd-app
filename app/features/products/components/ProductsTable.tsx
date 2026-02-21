import type { ReactElement } from "react";

export type ProductRow = { id: string; name: string; price: number };

function formatCurrencyPHP(value: number): string {
  const abs = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  return `${sign}₱${abs.toLocaleString(undefined, { maximumFractionDigits: 2 })}`;
}

function TotalRow({ total }: { total: number }): ReactElement {
  return (
    <tr className="border-t bg-muted/30">
      <td className="px-3 py-3 text-xs font-medium text-muted-foreground">Total</td>
      <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
        {formatCurrencyPHP(total)}
      </td>
    </tr>
  );
}

export function ProductsTable({ products }: { products: ProductRow[] }): ReactElement {
  const total = products.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Product Name</th>
            <th className="px-3 py-3 text-right font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {products.length ? (
            products.map((p) => (
              <tr key={p.id} className="border-t">
                <td className="px-3 py-2">{p.name}</td>
                <td className="px-3 py-2 text-right tabular-nums">
                  {formatCurrencyPHP(p.price)}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={2} className="px-3 py-10 text-center text-muted-foreground">
                No products yet.
              </td>
            </tr>
          )}
        </tbody>
        <tfoot>
          <TotalRow total={total} />
        </tfoot>
      </table>
    </div>
  );
}

