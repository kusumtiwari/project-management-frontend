import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import navigationItems from '../../../utils/navigationItems';
import { useSessionStore } from '@/session/useSessionStore';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const profile = useSessionStore((s: any) => s.profile);
  const getPermissions = useSessionStore((s: any) => s.getPermissions);

  // Filter navigation items based on permissions
  const filteredItems = useMemo(() => {
    // Admins have access to everything
    if (profile?.isAdmin) {
      return navigationItems;
    }

    const userPermissions = getPermissions() || [];
    
    return navigationItems.filter(item => {
      // Dashboard is always visible
      if (item.title === 'Dashboard') return true;
      
      // Check permission requirements for non-admins
      if (item.title === 'Projects' && !userPermissions.includes('view_project')) return false;
      if (item.title === 'Roles' && !userPermissions.includes('view_role')) return false;
      if (item.title === 'Team Members') return false; // Only admins can manage team members
      
      return true;
    });
  }, [profile, getPermissions]);

  return (
    <aside className="w-64 shadow h-full p-4 border-r-0.5">
      <h2 className="text-2xl font-bold mb-6 ">Planora</h2>
      <nav className="space-y-4">
        {filteredItems.map(({ title, route, icon: Icon }, idx) => (
          <div
            key={idx}
            onClick={() => navigate(route)}
            className="flex items-center gap-3 p-2 rounded cursor-pointer hover:bg-gray-100"
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