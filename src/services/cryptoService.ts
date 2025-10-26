import type { Asset } from '../types/index';

// Mock prices; replace with fetch in prod
const mockPrices = { bitcoin: 65000, ethereum: 3500 };

export const fetchCryptoPrices = async (tickers: string[]): Promise<Record<string, number>> => {
  // Real: const res = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${tickers.join(',')}&vs_currencies=usd`);
  // return res.json();
  return { ...mockPrices, ...Object.fromEntries(tickers.map(t => [t, mockPrices[t as keyof typeof mockPrices] ?? 0])) };
};

export const getTickersFromAssets = (assets: Asset[]): string[] => {
  return [...new Set(assets.map(a => a.ticker).filter((ticker): ticker is string => ticker !== undefined))];
};