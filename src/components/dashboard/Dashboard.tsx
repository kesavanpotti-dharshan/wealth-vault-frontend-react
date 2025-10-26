import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import useWealthStore from '../../stores/wealthStore';
import type { AllocationItem } from '../../types/index';

interface DashboardProps {
  onEdit: (id: number) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ onEdit }) => {
  const { assets, cryptoPrices, getNetWorth, getYearlyIncome, getAllocation, getROI, deleteAsset, loadPrices } = useWealthStore();

  useEffect(() => {
    loadPrices(); // Fetch/update prices
    const interval = setInterval(loadPrices, 60000); // Refresh minutely
    return () => clearInterval(interval);
  }, [assets, loadPrices]);

  const allocationData: AllocationItem[] = getAllocation();
  const netWorth = getNetWorth();
  const yearlyIncome = getYearlyIncome();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">Dashboard Overview</h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Net Worth</h3>
          <p className="text-2xl">${netWorth.toLocaleString()}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
          <h3 className="text-lg font-semibold mb-2">Yearly Income</h3>
          <p className="text-2xl">${yearlyIncome.toLocaleString()}</p>
        </div>
      </div>

      {/* Allocation Pie Chart */}
      {allocationData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-4 rounded shadow mb-6">
          <h3 className="text-lg font-semibold mb-4">Asset Allocation</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={allocationData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(props: PieLabelRenderProps) => {
                  const name = String(props.name ?? '');
                  const percent = typeof props.percent === 'number' ? props.percent : 0;
                  return `${name} ${(percent * 100).toFixed(0)}%`;
                }}
              >
                {allocationData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`$${value.toLocaleString()}`, 'Allocation']} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Assets List */}
      <div className="bg-white dark:bg-gray-800 p-4 rounded shadow">
        <h3 className="text-lg font-semibold mb-4">Assets</h3>
        {assets.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">No assets yet. Add one to get started!</p>
        ) : (
          <ul className="space-y-2">
            {assets.map((asset) => {
              const price = cryptoPrices[asset.ticker?.toLowerCase() ?? ''];
              const currentValue = asset.type === 'crypto' || asset.type === 'stock'
                ? (asset.qty ?? 0) * (price ?? 0)
                : (asset.value ?? 0);
              const roi = getROI(asset, asset.ticker);

              return (
                <li
                  key={asset.id}
                  className="p-3 rounded border border-gray-200 dark:border-gray-600 flex justify-between items-center"
                >
                  <div className="flex-1">
                    <span className="font-medium">{asset.name} ({asset.type})</span>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                      ${currentValue.toLocaleString()}
                    </span>
                    {roi !== 0 && (
                      <span
                        className={`ml-2 text-sm font-semibold ${
                          roi > 0 ? 'text-green-500' : 'text-red-500'
                        }`}
                      >
                        ROI: {roi.toFixed(1)}%
                      </span>
                    )}
                    {asset.yearlyYield && asset.yearlyYield > 0 && (
                      <span className="ml-2 text-sm text-blue-600">Yield: ${asset.yearlyYield.toLocaleString()}</span>
                    )}
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => onEdit(asset.id)}
                      className="text-blue-500 hover:text-blue-700 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteAsset(asset.id)}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
};