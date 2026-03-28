export type LedgerRecord = {
  id: string;
  date: string;
  agent: string;
  store: string;
  product: string;
  deliveredQty: number;
  soldQty: number;
  boQty: number;
  unitPrice: number;
};
