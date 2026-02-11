import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut } from 'lucide-react';
import { useSessionStore } from '../../../session/useSessionStore';
import { APIENDPOINTS, getAPIAUTHHEADERS } from '@/constants/APIEndpoints';
import { request } from '@/utils/request';
const Topbar: React.FC = () => {
  const profile = useSessionStore((state: any) => state.profile);
  const clearToken = useSessionStore((s:any)=> s.clearToken);
  const clearProfile = useSessionStore((s:any)=> s.clearProfile);
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const doLogout = async () => {
    try {
      await request(APIENDPOINTS.LOGOUT, {
        method: 'POST',
        headers: getAPIAUTHHEADERS(),
      });
    } catch {}
    clearToken();
    clearProfile();
    window.location.href = '/';
  };

  return (
    <header className="shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm">
          Welcome, {profile?.username ?? 'User'}
        </span>

        <div className="relative" ref={menuRef}>
          <button className="p-2 rounded-full" onClick={() => setOpen((v)=>!v)}>
            <User className="w-5 h-5" />
          </button>
          {open && (
            <div className="absolute right-0 mt-2 w-56 rounded-md border bg-white shadow-lg">
              <div className="p-3 border-b">
                <div className="font-medium text-gray-900">{profile?.username || 'User'}</div>
                <div className="text-xs text-gray-600">{profile?.teams?.[0]?.role || (profile?.isAdmin ? 'admin' : 'member')}</div>
              </div>
              <button
                className="w-full flex items-center gap-2 p-3 text-left hover:bg-gray-50 text-gray-900"
                onClick={doLogout}
              >
                <LogOut className="w-4 h-4" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Topbar;
