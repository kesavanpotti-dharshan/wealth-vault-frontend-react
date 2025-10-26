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
}

const useWealthStore = create<WealthState>()(
  persist(
    (set, get) => ({
      assets: [],
      cryptoPrices: {},
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
    { name: 'wealth-tracker-storage' }
  )
);

const getColor = (type: Asset['type']): string => {
  const colors: Record<Asset['type'], string> = { bank: '#00C49F', credit: '#FF8042', crypto: '#FFBB28', stock: '#0088FE' };
  return colors[type] || '#888';
};

export default useWealthStore;