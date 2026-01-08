import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Projects from "../pages/projects/Projects";
import ProjectDetails from "../pages/projects/ProjectDetails";
import ProjectTasks from "@/pages/projectTasks/ProjectTasks";
import { useSessionStore } from "@/session/useSessionStore";

const ProjectRoutes: React.FC = () => {
    const profile = useSessionStore((s: any) => s.profile);
    const getPermissions = useSessionStore((s: any) => s.getPermissions);

    // Check if user has permission to view projects
    const canViewProjects = profile?.isAdmin || getPermissions().includes('view_project');

    return (
        <Routes>
            {/* /projects */}
            <Route index element={canViewProjects ? <Projects /> : <Navigate to="/" replace />} />

            {/* /projects/:id */}
            <Route path=":id" element={canViewProjects ? <ProjectDetails /> : <Navigate to="/" replace />} />

            {/* /project/task/:id */}
            <Route path="/tasks/:id" element={canViewProjects ? <ProjectTasks /> : <Navigate to="/" replace />} />
        </Routes>
    );
};

export default ProjectRoutes;
