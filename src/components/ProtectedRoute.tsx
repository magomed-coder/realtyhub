// src/components/ProtectedRoute.tsx
import React, { type JSX } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

interface Props {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<Props> = ({ children }) => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const isLoading = useAuthStore((state) => state.isLoading);
  const location = useLocation();

  if (isLoading) {
    // Пока идёт загрузка (fetchMe), можно показать спиннер
    return (
      <div className="flex justify-center items-center h-screen">
        Загрузка...
      </div>
    );
  }

  if (!currentUser) {
    // Если не залогинен, перенаправляем на /login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
