import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "../session/useSessionStore";

const ProtectedRoute: React.FC = () => {
    const { token } = useSessionStore();  // grab token from your store/context
    console.log(token,'this is token')

    if (!token) {
        return <Navigate to="/login" replace />;
    }
    return <Outlet />;
};

export default ProtectedRoute;
