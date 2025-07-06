import React from 'react';
import { useNavigate } from 'react-router-dom';
import navigationItems from '../../../utils/navigationItems';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();

  return (
    <aside className="w-64 shadow h-full p-4 border-r-0.5">
      <h2 className="text-xl font-bold mb-6 ">Planora</h2>
      <nav className="space-y-4">
        {navigationItems.map(({ title, route, icon: Icon }, idx) => (
          <div
            key={idx}
            onClick={() => navigate(route)}
            className="flex items-center gap-3 p-2 rounded cursor-pointer"
          >
            <Icon className="w-5 h-5" />
            <span>{title}</span>
          </div>
        ))}
      </nav>
    </aside>
  );
};

export default Sidebar;