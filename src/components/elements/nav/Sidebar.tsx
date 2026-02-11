import React, { useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import navigationItems from '../../../utils/navigationItems';
import { useSessionStore } from '@/session/useSessionStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation(); 
  const profile = useSessionStore((s: any) => s.profile);
  const getPermissions = useSessionStore((s: any) => s.getPermissions);

  const filteredItems = useMemo(() => {
    if (profile?.isAdmin) {
      return navigationItems;
    }

    const userPermissions = getPermissions() || [];

    return navigationItems.filter(item => {
      if (item.title === 'Dashboard') return true;
      if (item.title === 'Projects' && !userPermissions.includes('view_project')) return false;
      if (item.title === 'Roles' && !userPermissions.includes('view_role')) return false;
      if (item.title === 'Team Members') return false;

      return true;
    });
  }, [profile, getPermissions]);

  return (
    <aside className="w-64 shadow h-full p-4 ">
      <h2 className="text-2xl font-bold mb-8">Planora</h2>

      <nav className="space-y-4">
        {filteredItems.map(({ title, route, icon: Icon }, idx) => {
          const isActive = location.pathname === route;

          return (
            <div
              key={idx}
              onClick={() => navigate(route)}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all
                ${isActive 
                  ? 'bg-blue-500 text-white' 
                  : 'hover:bg-gray-100 text-gray-700'
                }
              `}
            >
              <Icon className="w-5 h-5" />
              <span>{title}</span>
            </div>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;
