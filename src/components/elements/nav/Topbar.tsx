import React from 'react';
import { User, Sun, Moon } from 'lucide-react';
import { useSessionStore } from '../../../session/useSessionStore';
import { useTheme } from '../../../utils/ThemeContext';
const Topbar: React.FC = () => {
  const profile = useSessionStore((state: any) => state.profile);
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="shadow p-4 flex justify-between items-center" style={{ backgroundColor: 'var(--bg-color)' }}>
      <h1 className="text-lg font-semibold" style={{ color: 'var(--text-color)' }}>Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm" style={{ color: 'var(--text-color)' }}>
          Welcome, {profile?.username ?? 'User'}
        </span>

        <div className="cursor-pointer" onClick={toggleTheme}>
          {theme === 'dark' ? (
            <Sun className="w-5 h-5 text-yellow-500" />
          ) : (
            <Moon className="w-5 h-5 text-gray-800" />
          )}
        </div>

        <div className="bg-gray-100 p-2 rounded-full">
          <User className="w-5 h-5 text-gray-600" />
        </div>
      </div>
    </header>
  );
};

export default Topbar;
