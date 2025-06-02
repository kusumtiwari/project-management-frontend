import React from 'react';
import { Outlet } from 'react-router-dom';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import ProtectedRoute from './ProtectedRoute';
type Props = {
  // Define your props here
}

const MainRoute: React.FC<Props> = ({  }) => {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<Login />} />

      {/* Protected Routes wrapped with ProtectedRoute */}
      <Route element={<ProtectedRoute/>}>
        {/* Routes with shared layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          {/* Add more protected nested routes here */}
        </Route>
      </Route>
    </Routes>
  );
};

export default MainRoute;