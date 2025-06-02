import React from 'react';
import { Outlet } from 'react-router-dom';

type Props = {
  // Define your props here
}

const Layout: React.FC<Props> = ({  }) => {
  return (
      <div className="layout">
          <header className="p-4 bg-blue-600 text-white">Header</header>
          <main className="p-4">
              <Outlet />
          </main>
          <footer className="p-4 bg-gray-200 text-center">© 2025 MyApp</footer>
      </div>
  );
};

export default Layout;