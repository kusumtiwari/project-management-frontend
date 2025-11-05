import React from 'react';
import { User, Sun, Moon } from 'lucide-react';
import { useSessionStore } from '../../../session/useSessionStore';
import { useTheme } from '../../../utils/ThemeContext';
const Topbar: React.FC = () => {
  const profile = useSessionStore((state: any) => state.profile);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="shadow p-4 flex justify-between items-center bg-white dark:bg-neutral-900">
      <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-700 dark:text-gray-200">
          Welcome, {profile?.username ?? 'User'}
        </span>

        <div className="cursor-pointer" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Moon className="w-5 h-5 text-gray-200" />
          ) : (
            <Sun className="w-5 h-5 text-yellow-500" />
          )}
        </div>

        <div className="bg-gray-100 dark:bg-neutral-800 p-2 rounded-full">
          <User className="w-5 h-5 text-gray-600 dark:text-gray-200" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
