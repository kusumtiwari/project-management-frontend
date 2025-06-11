import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/elements/nav/Sidebar';
import Topbar from '../components/elements/nav/Topbar';
type Props = {
  // Define your props here
}

const Layout: React.FC<Props> = ({  }) => {
  return (
    <div className="w-screen h-screen flex overflow-hidden">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Topbar />
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;