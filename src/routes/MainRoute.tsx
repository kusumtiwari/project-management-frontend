import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from '../layout/Layout';
import Login from '../pages/login/Login';
import Dashboard from '../pages/dashboard/Dashboard';
import ProjectRoutes from './ProjectRoutes';
import ProtectedRoute from './ProtectedRoute';
import Signup from '../pages/signup/Signup';
// import TeamSetup from '../pages/teams/TeamSetup';
import VerifyEmail from '@/pages/verify-email/VerifyEmail';
import SuccessMsg from '@/pages/successMsg/SuccessMsg';
import TeamMemberRoute from './TeamMemberRoute';
import RolesRoutes from './RolesRoute';

type Props = {
  // Define your props here
}

const MainRoute: React.FC<Props> = ({  }) => {
  return (
    <Routes>
      {/* Public Route: Login */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/verify-email" element={<VerifyEmail />} />
      <Route path="/verify-info" element={<SuccessMsg />} />
      {/* Email-based invite flow removed */}

      {/* Protected Routes wrapped with ProtectedRoute */}
      <Route element={<ProtectedRoute/>}>
       {/* <Route path='/team-setup' element={<TeamSetup/>}></Route> */}
        {/* Routes with shared layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="projects/*" element={<ProjectRoutes />} />
          <Route path="roles/*" element={<RolesRoutes />} />
          <Route path="team-members/*" element={<TeamMemberRoute />} />
          {/* Add more protected nested routes here */}
        </Route>
      </Route>
    </Routes>
  );
};

export default MainRoute;