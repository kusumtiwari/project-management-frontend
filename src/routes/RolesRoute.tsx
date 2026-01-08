import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Roles from "@/pages/roles/Roles";
import { useSessionStore } from "@/session/useSessionStore";

const RolesRoutes: React.FC = () => {
    const profile = useSessionStore((s: any) => s.profile);
    const getPermissions = useSessionStore((s: any) => s.getPermissions);

    // Check if user has permission to view roles
    const canViewRoles = profile?.isAdmin || getPermissions().includes('view_role');

    return (
        <Routes>
            {/* /roles */}
            <Route index element={canViewRoles ? <Roles /> : <Navigate to="/" replace />} />
        </Routes>
    );
};

export default RolesRoutes;
