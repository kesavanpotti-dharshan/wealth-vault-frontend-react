import { differenceInDays } from 'date-fns';
import type {Asset} from '../types/index';

export const calculateROI = (asset: Asset, currentPrice: number): number => {
  if (!asset.purchaseDate || (asset.type !== 'crypto' && asset.type !== 'stock')) return 0;
  const purchaseValue = asset.purchaseValue ?? (asset.value ?? 0);
  const currentValue = (asset.qty ?? 0) * currentPrice;
  const daysHeld = differenceInDays(new Date(), new Date(asset.purchaseDate));
  const annualROI = ((currentValue - purchaseValue) / purchaseValue) * (365 / (daysHeld || 1)) * 100;
  return isNaN(annualROI) ? 0 : annualROI;
};

export const getAssetValue = (asset: Asset, price: number): number => {
  return asset.type === 'crypto' || asset.type === 'stock'
    ? (asset.qty ?? 0) * price
    : (asset.value ?? 0);
};