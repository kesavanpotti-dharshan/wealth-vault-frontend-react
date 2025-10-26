import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-110"
    title={darkMode ? 'Switch to Light' : 'Switch to Dark'}
  >
    {darkMode ? '☀️' : '🌙'}
  </button>
);