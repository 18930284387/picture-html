import React from 'react';
import { useDarkMode } from '../store';

interface LayoutProps {
  children: React.ReactNode;
}

export const useThemeStyles = () => {
  const { darkMode } = useDarkMode();
  return {
    bg: darkMode ? 'bg-gray-950' : 'bg-gray-50',
    textPrimary: darkMode ? 'text-white' : 'text-gray-900',
    textSecondary: darkMode ? 'text-gray-400' : 'text-gray-600',
    cardBg: darkMode ? 'bg-gray-900' : 'bg-white',
    borderColor: darkMode ? 'border-gray-800' : 'border-gray-200',
    hoverBg: darkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100',
    inputBg: darkMode ? 'bg-gray-800 border-gray-700' : 'bg-gray-50 border-gray-300',
  };
};

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { bg } = useThemeStyles();
  return <div className={`min-h-screen ${bg}`}>{children}</div>;
};
