// src/components/AdminRoute.tsx
import React, { type JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

interface Props {
  children: JSX.Element;
}

const AdminRoute: React.FC<Props> = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isLoading = useAuthStore((state) => state.isLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (!currentUser) {
    // Если не залогинен вообще — уводим на /login
    return <Navigate to="/login" replace />;
  }

  if (currentUser.role !== "admin") {
    // Если залогинен, но не админ — редиректим на /dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default AdminRoute;
