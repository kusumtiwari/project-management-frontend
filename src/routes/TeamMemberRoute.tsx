import React from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';
import TeamMembers from '@/pages/team/Team';

type Props = {
    // you can define any props if needed, otherwise keep empty
}

const TeamMemberRoute: React.FC<Props> = () => {
    return (
        <Routes>
            {/* Parent route for projects */}
            <Route index element={<TeamMembers />} />
            {/* <Route path=":projectId" element={<ProjectDetails />} /> */}
            {/* Add more nested project-related routes here if needed */}

        </Routes>
    );
};

export default TeamMemberRoute;
