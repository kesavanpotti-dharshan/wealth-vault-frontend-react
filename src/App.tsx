import { useState, useEffect } from 'react';
import useWealthStore from './stores/wealthStore';
import { Dashboard } from './components/dashboard/Dashboard';
import { AssetForm } from './components/forms/AssetForm';
import { DarkModeToggle } from './components/common/DarkModeToggle';
import { useTheme } from './hooks/useTheme';


function App() {
  const { darkMode, toggleTheme } = useTheme();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { loadPrices } = useWealthStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    loadPrices();  // Init prices
  }, [darkMode, loadPrices]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-700 dark:from-blue-800 dark:to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Title */}
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg 
                  className="h-10 w-10 text-blue-300"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M4 7V4a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v3" />
                  <path d="M12 12V8" />
                  <path fillRule="evenodd" d="M2 8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V8zm4 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1zm0 4a1 1 0 0 1 1-1h10a1 1 0 1 1 0 2H7a1 1 0 0 1-1-1z" />
                </svg>
              </div>
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Wealth Vault
                </h1>
                <p className="text-sm text-blue-200 dark:text-blue-300">
                  Track • Analyze • Grow
                </p>
              </div>
            </div>

            {/* Right side buttons */}
            <div className="flex items-center space-x-6">
              {/* Notifications */}
              <div className="relative">
                <button 
                  className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-500/20 
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title="Notifications"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" 
                    />
                  </svg>
                  {/* Notification badge */}
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">3</span>
                  </span>
                </button>
              </div>

              {/* Updates/Changes Indicator */}
              <div className="relative">
                <button 
                  className="p-2 text-blue-100 hover:text-white rounded-lg hover:bg-blue-500/20 
                    transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  title="Asset Updates"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" 
                    />
                  </svg>
                  {/* Update badge */}
                  <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-green-500 flex items-center justify-center">
                    <span className="text-xs font-semibold text-white">2</span>
                  </span>
                </button>
              </div>

              {/* Theme Toggle */}
              <DarkModeToggle darkMode={darkMode} onToggle={toggleTheme} />

              {/* Add Asset Button */}
              <button
                onClick={() => { setShowForm(true); setEditingId(null); }}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium
                  text-white bg-blue-500 hover:bg-blue-400 dark:bg-indigo-600 dark:hover:bg-indigo-500
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-indigo-500
                  transform transition-all duration-200 hover:scale-105"
              >
                <svg 
                  className="-ml-1 mr-2 h-5 w-5" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Asset
              </button>
            </div>
          </div>
        </div>
      </header>
      <Dashboard onEdit={(id) => { setEditingId(id); setShowForm(true); }} />
      {showForm && (
        <AssetForm
          editingId={editingId}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App
