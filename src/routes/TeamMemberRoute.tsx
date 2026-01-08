import React from 'react';
import { Outlet, Routes, Route, Navigate } from 'react-router-dom';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';
import TeamMembers from '@/pages/team/Team';
import { useSessionStore } from '@/session/useSessionStore';

type Props = {
    // you can define any props if needed, otherwise keep empty
}

const TeamMemberRoute: React.FC<Props> = () => {
    const profile = useSessionStore((s: any) => s.profile);

    // Only admins can view/manage team members
    const isAdmin = profile?.isAdmin;

    return (
        <Routes>
            {/* Parent route for team members - admin only */}
            <Route index element={isAdmin ? <TeamMembers /> : <Navigate to="/" replace />} />
        </Routes>
    );
};

export default TeamMemberRoute;
