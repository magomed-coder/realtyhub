// src/pages/Dashboard.tsx
import React from "react";

import { useAuthStore } from "../context/authStore";
import { FloorPlanEditor } from "../components/FloorPlanEditor/FloorPlanEditor";

const Dashboard: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);

  // На самом деле, этот компонент всегда рендерится внутри ProtectedRoute,
  // так что currentUser гарантированно не null. Но для безопасности:
  if (!currentUser) {
    return <div>Загрузка профиля...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* <div className=" mx-auto bg-white p-6 rounded-2xl shadow"> */}
      <FloorPlanEditor />
      {/* </div> */}
    </div>
  );
};

export default Dashboard;
