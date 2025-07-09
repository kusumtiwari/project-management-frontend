import React from 'react';
import { Outlet, Routes, Route } from 'react-router-dom';
import Projects from '../pages/projects/Projects';
import ProjectDetails from '../pages/projects/ProjectDetails';

type Props = {
    // you can define any props if needed, otherwise keep empty
}

const ProjectRoutes: React.FC<Props> = () => {
    return (
        <Routes>
            {/* Parent route for projects */}
                <Route index element={<Projects />} />
                <Route path=":projectId" element={<ProjectDetails />} />
                {/* Add more nested project-related routes here if needed */}
         
        </Routes>
    );
};

export default ProjectRoutes;
