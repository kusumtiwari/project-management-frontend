import React from "react";
import { Routes, Route } from "react-router-dom";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import ProjectTasks from "@/pages/projectTasks/ProjectTasks";

const ProjectRoutes: React.FC = () => {
    return (
        <Routes>
            {/* /projects */}
            <Route index element={<Projects />} />

            {/* /projects/:id */}
            <Route path=":id" element={<ProjectDetails />} />

            {/* /project/task/:id */}
            <Route path="/tasks/:id" element={<ProjectTasks />} />
        </Routes>
    );
};

export default ProjectRoutes;
