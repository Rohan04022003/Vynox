import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const user = localStorage.getItem("user");

    // user nahi mila → redirect login
    if (!user) {
        return <Navigate to="/user/login" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
