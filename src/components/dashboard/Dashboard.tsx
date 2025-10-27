import React, { useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import type { PieLabelRenderProps } from 'recharts';
import useWealthStore from '../../stores/wealthStore';
import type { AllocationItem, AssetType } from '../../types/index';
import { BanknotesIcon, CreditCardIcon, CurrencyDollarIcon, ChartBarIcon } from '@heroicons/react/24/outline';

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
  // Helper component (add to Dashboard or common):
  const IconByType: React.FC<{ type: AssetType; className?: string }> = ({
    type,
    className,
  }) => {
    switch (type) {
      case "bank":
        return <BanknotesIcon className={className} />;
      case "credit":
        return <CreditCardIcon className={className} />;
      case "crypto":
        return <CurrencyDollarIcon className={className} />;
      case "stock":
        return <ChartBarIcon className={className} />;
      default:
        return null;
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Financial Dashboard
      </h2>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <BanknotesIcon className="h-8 w-8 text-blue-500 dark:text-blue-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Net Worth</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${netWorth.toLocaleString()}
          </p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-4">
            <CurrencyDollarIcon className="h-8 w-8 text-green-500 dark:text-green-400 mr-3" />
            <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Yearly Income</h3>
          </div>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">
            ${yearlyIncome.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Allocation Pie Chart */}
      {allocationData.length > 0 && (
        <div className="bg-white dark:bg-gray-800 p-6 mb-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center mb-6">
            <ChartBarIcon className="h-7 w-7 text-indigo-500 dark:text-indigo-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Asset Allocation</h3>
          </div>
          <div className="grid md:grid-cols-5 gap-6">
            <div className="md:col-span-3">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={allocationData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    label={(props: PieLabelRenderProps) => {
                      const name = String(props.name ?? '');
                      const percent = typeof props.percent === 'number' ? props.percent : 0;
                      return `${name} ${(percent * 100).toFixed(0)}%`;
                    }}
                    labelLine={false}
                    animationBegin={0}
                    animationDuration={1500}
                  >
                    {allocationData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.fill}
                        className="transition-all duration-300 hover:opacity-80"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0];
                        return (
                          <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
                            <p className="font-medium text-gray-900 dark:text-white">{data.name}</p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Value: <span className="font-medium">${Number(data.value).toLocaleString()}</span>
                            </p>
                            <p className="text-gray-600 dark:text-gray-400">
                              Share: <span className="font-medium">{(data.percent * 100).toFixed(1)}%</span>
                            </p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="md:col-span-2 flex flex-col justify-center">
              <div className="space-y-3">
                {allocationData.map((item, index) => (
                  <div 
                    key={`legend-${index}`}
                    className="flex items-center p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-200"
                  >
                    <div 
                      className="w-4 h-4 rounded mr-3" 
                      style={{ backgroundColor: item.fill }}
                    />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        ${item.value.toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {((item.value / allocationData.reduce((sum, i) => sum + i.value, 0)) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Assets List */}
      <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-7 w-7 text-purple-500 dark:text-purple-400 mr-3" />
            <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">Assets</h3>
          </div>
        </div>
        {assets.length === 0 ? (
          <div className="text-center py-8">
            <CurrencyDollarIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg">No assets yet. Add one to get started!</p>
          </div>
        ) : (
          <ul className="space-y-3">
            {assets.map((asset) => {
              const price = cryptoPrices[asset.ticker?.toLowerCase() ?? ''];              
              const currentValue = asset.type === 'crypto' || asset.type === 'stock'
                ? (asset.qty ?? 0) * (price ?? 0)
                : (asset.value ?? 0);
              const roi = getROI(asset, asset.ticker);

              return (
                <li
                  key={asset.id}
                  className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 
                    hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-200"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <IconByType type={asset.type} className="h-8 w-8 text-gray-500 dark:text-gray-400" />
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{asset.name}</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 capitalize">{asset.type}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900 dark:text-white">
                          ${currentValue.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-1">
                          {roi !== 0 && (
                            <span
                              className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                                ${roi > 0 
                                  ? 'bg-green-100 text-green-800 dark:bg-green-800/20 dark:text-green-400' 
                                  : 'bg-red-100 text-red-800 dark:bg-red-800/20 dark:text-red-400'}`}
                            >
                              ROI: {roi.toFixed(1)}%
                            </span>
                          )}
                          {asset.yearlyYield && asset.yearlyYield > 0 && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                              bg-blue-100 text-blue-800 dark:bg-blue-800/20 dark:text-blue-400">
                              Yield: ${asset.yearlyYield.toLocaleString()}/yr
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => onEdit(asset.id)}
                          className="inline-flex items-center justify-center p-2 rounded-full text-blue-600 hover:text-blue-700
                            hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-800/40 transition-colors duration-200"
                          title="Edit asset"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteAsset(asset.id)}
                          className="inline-flex items-center justify-center p-2 rounded-full text-red-600 hover:text-red-700
                            hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-800/40 transition-colors duration-200"
                          title="Delete asset"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
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