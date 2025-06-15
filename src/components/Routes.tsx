// src/Routes.tsx (обновлённая версия)
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Страницы
import Dashboard from "../pages/Dashboard";
import SignUp from "../pages/SignUp";
import Login from "../pages/Login";
import NotFoundPage from "../pages/NotFoundPage";
import AdminPage from "../pages/AdminPage";
import Profile from "../pages/Profile";
import Settings from "../pages/Settings";
import Reports from "../pages/Reports";
import ReportDetail from "../pages/ReportDetail";

// Обёртки
import ProtectedRoute from "./ProtectedRoute";
import PublicRoute from "./PublicRoute";
import AdminRoute from "./AdminRoute";

// Layout
import MainLayout from "../layouts/MainLayout";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Публичные страницы */}
      <Route
        path="/login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignUp />
          </PublicRoute>
        }
      />

      {/* Защищённые маршруты с лейаутом */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Основные защищённые маршруты */}
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="profile" element={<Profile />} />
        <Route path="settings" element={<Settings />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports/:id" element={<ReportDetail />} />

        {/* Админ-страница */}
        <Route
          path="admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Route>

      {/* 404 */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;
