import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-[250px_1fr] min-h-screen">
      <Sidebar />
      <main className="p-6 bg-gray-100 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
