import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSessionStore } from "../session/useSessionStore";
import {jwtDecode} from "jwt-decode";

interface JwtPayload {
    exp: number;
}

const isTokenExpired = (token: string): boolean => {
    try {
        const decoded = jwtDecode<JwtPayload>(token);
        if (!decoded.exp) return true;
        const currentTime = Date.now() / 1000; // in seconds
        return decoded.exp < currentTime;
    } catch (error) {
        return true; // If decoding fails, treat it as expired
    }
};

const ProtectedRoute: React.FC = () => {
    const { token, clearToken, clearProfile } = useSessionStore();

    if (!token || isTokenExpired(token)) {
        clearToken();
        clearProfile();
        return <Navigate to="/login" replace />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
