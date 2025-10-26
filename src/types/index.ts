export interface Asset {
  id: number;
  type: 'bank' | 'credit' | 'crypto' | 'stock';
  name: string;
  value?: number;
  yearlyYield?: number;
  purchaseDate?: string;
  purchaseValue?: number;
  qty?: number;
  ticker?: string;
}

export interface AllocationItem {
  name: string;
  value: number;
  fill: string;
  [key: string]: string | number;
}

export type AssetType = Asset['type'];  // For selects