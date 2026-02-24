function formatCurrencyPHP(value: number): string {
  return `₱${value.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
}
function formatPercent(p: number): string {
  return `${(p * 100).toFixed(1)}%`;
}

export { formatCurrencyPHP, formatPercent };
