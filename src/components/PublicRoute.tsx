// src/components/PublicRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

interface PublicRouteProps {
  children: JSX.Element;
}

const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (currentUser) {
    // Если уже залогинен, не пускаем на /login или /signup
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default PublicRoute;
