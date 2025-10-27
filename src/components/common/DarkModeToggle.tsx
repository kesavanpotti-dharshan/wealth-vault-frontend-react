import React from 'react';

interface DarkModeToggleProps {
  darkMode: boolean;
  onToggle: () => void;
}

export const DarkModeToggle: React.FC<DarkModeToggleProps> = ({ darkMode, onToggle }) => (
  <button
    onClick={onToggle}
    className="relative p-2 rounded-lg bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100 
      hover:bg-blue-200 dark:hover:bg-blue-800 transition-all duration-300 
      focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500"
    title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
  >
    <div className="relative w-6 h-6 flex items-center justify-center">
      {/* Sun icon */}
      <svg
        className={`w-5 h-5 absolute transform transition-transform duration-500 ${
          darkMode ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
        />
      </svg>
      {/* Moon icon */}
      <svg
        className={`w-5 h-5 absolute transform transition-transform duration-500 ${
          darkMode ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0'
        }`}
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
        />
      </svg>
    </div>
  </button>
);