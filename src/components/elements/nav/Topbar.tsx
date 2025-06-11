// src/components/Topbar.tsx
import React from 'react';

const Topbar: React.FC = () => {
  return (
    <header className="bg-white shadow p-4 flex justify-between items-center">
      <h1 className="text-lg font-semibold">Dashboard</h1>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">Welcome, User</span>
        <img src="https://via.placeholder.com/32" alt="User Avatar" className="rounded-full w-8 h-8" />
      </div>
    </header>
  );
};

export default Topbar;
