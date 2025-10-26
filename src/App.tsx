import React, { useState, useEffect } from 'react';
import useWealthStore from './stores/wealthStore';
import { Dashboard } from './components/dashboard/Dashboard';
import { AssetForm } from './components/forms/AssetForm';
import { DarkModeToggle } from './components/common/DarkModeToggle';


function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { loadPrices } = useWealthStore();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    loadPrices();  // Init prices
  }, [darkMode, loadPrices]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-blue-600 dark:bg-blue-800 text-white p-4 flex justify-between items-center">
        <h1 className="text-2xl">Wealth Vault</h1>
        <div className="flex items-center space-x-4">
          <DarkModeToggle darkMode={darkMode} onToggle={() => setDarkMode(!darkMode)} />
          <button
            onClick={() => { setShowForm(true); setEditingId(null); }}
            className="bg-white dark:bg-gray-700 text-blue-600 dark:text-white px-4 py-2 rounded"
          >
            Add Asset
          </button>
        </div>
      </header>
      <Dashboard />
      {showForm && (
        <AssetForm
          editingId={editingId}
          onClose={() => setShowForm(false)}
          onEdit={(id) => setEditingId(id)}
        />
      )}
    </div>
  );
}

export default App
