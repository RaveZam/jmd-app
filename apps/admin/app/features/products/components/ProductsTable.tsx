import type { ReactElement } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";

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
      <td />
    </tr>
  );
}

type ProductsTableProps = {
  products: ProductRow[];
  onEdit: (product: ProductRow) => void;
  onDelete: (id: string) => void;
};

export function ProductsTable({ products, onEdit, onDelete }: ProductsTableProps): ReactElement {
  const total = products.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
      <table className="w-full text-sm">
        <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
          <tr>
            <th className="px-3 py-3 text-left font-medium">Product Name</th>
            <th className="px-3 py-3 text-right font-medium">Price</th>
            <th className="px-3 py-3" />
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
                <td className="px-3 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg"
                      onClick={() => onEdit(p)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-lg text-destructive hover:text-destructive"
                      onClick={() => onDelete(p.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={3} className="px-3 py-10 text-center text-muted-foreground">
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

