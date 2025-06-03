// src/pages/Dashboard.tsx
import React from "react";

import { Link } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import { useAuthStore } from "../context/authStore";

const Dashboard: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  // На самом деле, этот компонент всегда рендерится внутри ProtectedRoute,
  // так что currentUser гарантированно не null. Но для безопасности:
  if (!currentUser) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen bg-amber-600 p-8">
      <div className="max-w-3xl mx-auto bg-white p-6 rounded-2xl shadow">
        <p className="mb-4">
          Ваша роль: <span className="font-medium">{currentUser}</span>
        </p>

        {currentUser.role === "admin" && (
          <Link
            to="/admin"
            className="inline-block mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
          >
            Перейти в админ-панель
          </Link>
        )}

        <LogoutButton />
      </div>
    </div>
  );
};

export default Dashboard;
