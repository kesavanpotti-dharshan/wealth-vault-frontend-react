import React, { useState, useEffect } from 'react';
import useWealthStore from '../../stores/wealthStore';
import type { Asset, AssetType } from '../../types/index';

interface AssetFormProps {
  editingId?: number | null;
  onClose: () => void;
}

export const AssetForm: React.FC<AssetFormProps> = ({ editingId, onClose }) => {
  const { addAsset, updateAsset, assets } = useWealthStore();
  const editingAsset = assets.find((a) => a.id === editingId);
  const [form, setForm] = useState<Omit<Asset, 'id'>>({
    type: 'bank',
    name: '',
    value: 0,
    yearlyYield: 0,
    purchaseDate: '',
    purchaseValue: 0,
    qty: 0,
    ticker: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (editingAsset) {
      setForm({
        type: editingAsset.type,
        name: editingAsset.name,
        value: editingAsset.value ?? 0,
        yearlyYield: editingAsset.yearlyYield ?? 0,
        purchaseDate: editingAsset.purchaseDate ?? '',
        purchaseValue: editingAsset.purchaseValue ?? 0,
        qty: editingAsset.qty ?? 0,
        ticker: editingAsset.ticker ?? '',
      });
    }
  }, [editingAsset]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (form.type !== 'crypto' && form.type !== 'stock' && (form.value ?? 0) <= 0) {
      newErrors.value = 'Value must be positive';
    }
    if ((form.type === 'crypto' || form.type === 'stock') && (!form.ticker || (form.qty ?? 0) <= 0)) {
      newErrors.ticker = 'Ticker and quantity required for crypto/stock';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    if (editingId) {
      updateAsset(editingId, form);
    } else {
      addAsset(form);
    }
    onClose();
  };

  const handleChange = (key: keyof typeof form, value: string | number) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    // Clear error on change
    if (errors[key as string]) setErrors((prev) => ({ ...prev, [key as string]: '' }));
  };

  const isCryptoOrStock = form.type === 'crypto' || form.type === 'stock';
  const hasPurchaseDate = !!form.purchaseDate;

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-6 rounded shadow max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">{editingId ? 'Edit' : 'Add'} Asset</h2>
      
      {/* Type Select */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Type</label>
        <select
          value={form.type}
          onChange={(e) => handleChange('type', e.target.value as AssetType)}
          className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="bank">Bank Balance</option>
          <option value="credit">Credit Card</option>
          <option value="crypto">Crypto</option>
          <option value="stock">Stock/ETF</option>
        </select>
      </div>

      {/* Name */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Name</label>
        <input
          type="text"
          placeholder="e.g., Chase Checking"
          value={form.name}
          onChange={(e) => handleChange('name', e.target.value)}
          className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Value / Ticker + Qty */}
      {!isCryptoOrStock ? (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Value ($)</label>
          <input
            type="number"
            placeholder="e.g., 50000"
            value={form.value ?? ''}
            onChange={(e) => handleChange('value', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
            required
          />
          {errors.value && <p className="text-red-500 text-sm mt-1">{errors.value}</p>}
        </div>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Ticker</label>
            <input
              type="text"
              placeholder="e.g., bitcoin"
              value={form.ticker}
              onChange={(e) => handleChange('ticker', e.target.value.toLowerCase())}
              className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            {errors.ticker && <p className="text-red-500 text-sm mt-1">{errors.ticker}</p>}
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Quantity</label>
            <input
              type="number"
              placeholder="e.g., 0.5"
              value={form.qty ?? ''}
              onChange={(e) => handleChange('qty', parseFloat(e.target.value) || 0)}
              className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              min="0"
              step="0.0001"
              required
            />
          </div>
        </>
      )}

      {/* Yearly Yield */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Yearly Yield/Income ($)</label>
        <input
          type="number"
          placeholder="e.g., 200"
          value={form.yearlyYield ?? ''}
          onChange={(e) => handleChange('yearlyYield', parseFloat(e.target.value) || 0)}
          className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          min="0"
          step="0.01"
        />
      </div>

      {/* Purchase Date & Value */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Purchase Date (for ROI)</label>
        <input
          type="date"
          value={form.purchaseDate ?? ''}
          onChange={(e) => handleChange('purchaseDate', e.target.value)}
          className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          max={new Date().toISOString().split('T')[0]}  // No future dates
        />
      </div>
      {hasPurchaseDate && (
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Purchase Value ($)</label>
          <input
            type="number"
            placeholder="e.g., 30000"
            value={form.purchaseValue ?? ''}
            onChange={(e) => handleChange('purchaseValue', parseFloat(e.target.value) || 0)}
            className="w-full p-2 border dark:border-gray-600 bg-white dark:bg-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            min="0"
            step="0.01"
          />
        </div>
      )}

      {/* Buttons */}
      <div className="flex space-x-2 pt-4">
        <button
          type="submit"
          className="flex-1 bg-blue-500 dark:bg-blue-700 text-white py-2 rounded hover:bg-blue-600 dark:hover:bg-blue-800 transition-colors"
        >
          Save
        </button>
        <button
          type="button"
          onClick={onClose}
          className="flex-1 bg-gray-500 dark:bg-gray-600 text-white py-2 rounded hover:bg-gray-600 dark:hover:bg-gray-700 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};