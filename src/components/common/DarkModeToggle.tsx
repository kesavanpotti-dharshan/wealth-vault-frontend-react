import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="px-4 py-2 bg-white dark:bg-gray-700 text-blue-600 dark:text-white rounded transition-colors"
  >
    {darkMode ? '☀️ Light' : '🌙 Dark'}
  </button>
);