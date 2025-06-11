import React from 'react';
import { Home, ClipboardList, BarChart2, Settings } from 'lucide-react';

const Sidebar: React.FC = () => {
  const menuItems = [
    { icon: <Home className="w-5 h-5" />, label: 'Dashboard' },
    { icon: <ClipboardList className="w-5 h-5" />, label: 'Projects' },
    { icon: <BarChart2 className="w-5 h-5" />, label: 'Reports' },
    { icon: <Settings className="w-5 h-5" />, label: 'Settings' },
  ];

  return (
    <aside className="w-64 bg-white shadow h-full p-4">
      <h2 className="text-xl font-bold mb-6">Planora</h2>
      <nav className="space-y-4">
        {menuItems.map((item, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 hover:bg-gray-100 rounded cursor-pointer">
            {item.icon}
            <span>{item.label}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;