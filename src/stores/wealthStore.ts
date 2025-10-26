import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Asset, AllocationItem } from '../types/index';
import { calculateROI, getAssetValue } from '../utils/calculations';
import { fetchCryptoPrices, getTickersFromAssets } from '../services/cryptoService';

interface WealthState {
  assets: Asset[];
  cryptoPrices: Record<string, number>;
  addAsset: (newAsset: Omit<Asset, 'id'>) => void;
  updateAsset: (id: number, updates: Partial<Asset>) => void;
  deleteAsset: (id: number) => void;
  updatePrices: (prices: Record<string, number>) => void;
  getNetWorth: () => number;
  getYearlyIncome: () => number;
  getAllocation: () => AllocationItem[];
  getROI: (asset: Asset, ticker?: string) => number;
  loadPrices: () => Promise<void>;
  loadSamples: () => void;
}

// Sample data array – Realistic for Oct 25, 2025 (BTC ~$68K, VTI ~$280)
const SAMPLE_ASSETS: Omit<Asset, 'id'>[] = [
  // Bank Balances (Stable core)
  {
    type: 'bank',
    name: 'Chase High-Yield Savings',
    value: 75000,
    yearlyYield: 1200,  // 1.6% APY
    purchaseDate: '2025-01-15',  // Deposit date
    purchaseValue: 75000,
  },
  {
    type: 'bank',
    name: 'Ally Checking',
    value: 25000,
    yearlyYield: 0,  // No interest
  },
  // Credit Card (Negative drag – shows realism)
  {
    type: 'credit',
    name: 'Amex Platinum',
    value: 8000,  // Balance owed
    yearlyYield: -480,  // Est. interest drag
  },
  // Crypto (Volatile wow-factor)
  {
    type: 'crypto',
    name: 'Bitcoin Holding',
    ticker: 'bitcoin',
    qty: 0.25,  // Bought at dip
    purchaseDate: '2025-01-20',
    purchaseValue: 12000,  // ~$48K avg buy
    yearlyYield: 0,
  },
  {
    type: 'crypto',
    name: 'Ethereum Stake',
    ticker: 'ethereum',
    qty: 2.5,
    purchaseDate: '2025-03-10',
    purchaseValue: 7500,  // ~$3K avg
    yearlyYield: 450,  // Staking rewards
  },
  // Stocks/ETFs (Diversified growth)
  {
    type: 'stock',
    name: 'VTI ETF (Total Market)',
    ticker: 'vti',  // Mock price in service ~$280
    qty: 50,
    purchaseDate: '2025-02-05',
    purchaseValue: 12500,  // ~$250/share
    yearlyYield: 300,  // Dividends
  },
  {
    type: 'stock',
    name: 'AAPL Shares',
    ticker: 'aapl',
    qty: 20,
    purchaseDate: '2025-06-01',
    purchaseValue: 3500,  // ~$175/share
    yearlyYield: 10,  // Tiny div
  },
];

const useWealthStore = create<WealthState>()(
  persist(
    (set, get) => ({
      assets: [],
      cryptoPrices: {},
      loadSamples: () => {
        if (get().assets.length === 0) {  // Only if empty
          const assetsWithIds = SAMPLE_ASSETS.map(asset => ({ ...asset, id: Date.now() + Math.random() }));
          set({ assets: assetsWithIds });
        }
      },
      addAsset: (newAsset) => set({ assets: [...get().assets, { ...newAsset, id: Date.now() }] }),
      updateAsset: (id, updates) => set({
        assets: get().assets.map(asset => asset.id === id ? { ...asset, ...updates } : asset)
      }),
      deleteAsset: (id) => set({ assets: get().assets.filter(asset => asset.id !== id) }),
      updatePrices: (prices) => set({ cryptoPrices: prices }),
      getNetWorth: () => get().assets.reduce((sum, a) => {
        const price = get().cryptoPrices[a.ticker?.toLowerCase() ?? ''];
        const value = getAssetValue(a, price);
        return sum + (a.type === 'credit' ? -value : value);
      }, 0),
      getYearlyIncome: () => get().assets.reduce((sum, a) => sum + (a.yearlyYield ?? 0), 0),
      getAllocation: () => get().assets.map(a => {
        const price = get().cryptoPrices[a.ticker?.toLowerCase() ?? ''];
        const value = Math.abs(getAssetValue(a, price));
        return { name: a.name, value, fill: getColor(a.type) };
      }).filter(a => a.value > 0),
      getROI: (asset, ticker) => calculateROI(asset, get().cryptoPrices[ticker?.toLowerCase() ?? '']),
      loadPrices: async () => {
        const tickers = getTickersFromAssets(get().assets);  // From service
        if (tickers.length) {
          const prices = await fetchCryptoPrices(tickers);
          get().updatePrices(prices);
        }
      },
    }),
    { name: 'wealth-tracker-storage',
      onRehydrateStorage: () => (state) => {
        // Post-rehydrate: Load samples if still empty
        if (!state || state.assets.length === 0) {
          state?.loadSamples();
        }
      },
     }
  )
);

const getColor = (type: Asset['type']): string => {
  const colors: Record<Asset['type'], string> = { bank: '#00C49F', credit: '#FF8042', crypto: '#FFBB28', stock: '#0088FE' };
  return colors[type] || '#888';
};

export default useWealthStore;