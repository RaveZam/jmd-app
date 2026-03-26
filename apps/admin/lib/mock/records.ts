export type LedgerRecord = {
  id: string;
  date: string; // YYYY-MM-DD
  agent: string;
  store: string;
  product: string;
  deliveredQty?: number;
  soldQty: number;
  boQty: number;
  returnedQty?: number;
  unitPrice: number; // PHP
};
