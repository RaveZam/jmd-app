import type { ReactElement } from "react";
import { useState } from "react";
import { Pencil, Trash2, Package, ChevronsUpDown, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProductsTableProps } from "../types/product-types";
import { formatCurrencyPHP } from "../helpers/getPhpCurrency";
import { TotalRow } from "./TotalRow";

export type ProductRow = { id: string; name: string; price: number };

type SortKey = "name" | "price";
type SortDir = "asc" | "desc" | null;

function SortIcon({ column, sortKey, sortDir }: { column: SortKey; sortKey: SortKey | null; sortDir: SortDir }): ReactElement {
  if (sortKey !== column) return <ChevronsUpDown className="ml-1 inline h-3.5 w-3.5 opacity-40" />;
  if (sortDir === "asc") return <ChevronUp className="ml-1 inline h-3.5 w-3.5" />;
  return <ChevronDown className="ml-1 inline h-3.5 w-3.5" />;
}

export function ProductsTable({
  products,
  onEdit,
  onDelete,
  onAddClick,
}: ProductsTableProps & { onAddClick?: () => void }): ReactElement {
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState<SortKey | null>(null);
  const [sortDir, setSortDir] = useState<SortDir>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function handleSort(key: SortKey): void {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDir("asc");
    } else if (sortDir === "asc") {
      setSortDir("desc");
    } else {
      setSortKey(null);
      setSortDir(null);
    }
  }

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()),
  );

  const sorted = [...filtered].sort((a, b) => {
    if (!sortKey || !sortDir) return 0;
    const mult = sortDir === "asc" ? 1 : -1;
    if (sortKey === "name") return mult * a.name.localeCompare(b.name);
    return mult * (a.price - b.price);
  });

  const total = products.reduce((acc, p) => acc + p.price, 0);

  return (
    <div className="space-y-3">
      <Input
        placeholder="Search products…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm rounded-2xl"
      />
      <div className="overflow-auto rounded-2xl border bg-card shadow-soft">
        <table className="w-full text-sm">
          <thead className="sticky top-0 z-10 bg-muted/60 text-xs text-muted-foreground backdrop-blur">
            <tr>
              <th className="px-3 py-3 text-left font-medium">
                <button
                  type="button"
                  className="flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("name")}
                >
                  Product Name
                  <SortIcon column="name" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-3 py-3 text-right font-medium">
                <button
                  type="button"
                  className="ml-auto flex items-center hover:text-foreground transition-colors"
                  onClick={() => handleSort("price")}
                >
                  Price
                  <SortIcon column="price" sortKey={sortKey} sortDir={sortDir} />
                </button>
              </th>
              <th className="px-3 py-3" />
            </tr>
          </thead>
          <tbody>
            {sorted.length ? (
              sorted.map((p) => (
                <tr key={p.id} className="border-t hover:bg-muted/40 transition-colors">
                  <td className="px-3 py-2">{p.name}</td>
                  <td className="px-3 py-2 text-right tabular-nums">
                    {formatCurrencyPHP(p.price)}
                  </td>
                  <td className="px-3 py-2">
                    {confirmDeleteId === p.id ? (
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-xs text-muted-foreground">Delete?</span>
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-6 rounded-lg px-2 text-xs"
                          onClick={() => { onDelete(p.id); setConfirmDeleteId(null); }}
                        >
                          Yes
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-6 rounded-lg px-2 text-xs"
                          onClick={() => setConfirmDeleteId(null)}
                        >
                          No
                        </Button>
                      </div>
                    ) : (
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
                          onClick={() => setConfirmDeleteId(p.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="px-3 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted-foreground">
                    <Package className="h-10 w-10 opacity-30" />
                    <p className="text-sm">
                      {search ? `No products match "${search}".` : "No products yet."}
                    </p>
                    {!search && onAddClick && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-2xl"
                        onClick={onAddClick}
                      >
                        Add your first product
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )}
          </tbody>
          <tfoot>
            <TotalRow total={total} />
          </tfoot>
        </table>
      </div>
    </div>
  );
}
