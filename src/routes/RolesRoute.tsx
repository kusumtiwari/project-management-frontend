import React from "react";
import { Routes, Route } from "react-router-dom";
import Roles from "@/pages/roles/Roles";

const RolesRoutes: React.FC = () => {
    return (
        <Routes>
            {/* /projects */}
            <Route index element={<Roles />} />

        </Routes>
    );
};

export default RolesRoutes;
