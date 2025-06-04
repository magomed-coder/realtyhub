import React from "react";
import { Outlet } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";

const MainLayout: React.FC = () => {
  return (
    <div className="grid grid-cols-[auto_1fr] h-screen">
      <Sidebar />
      <main className="bg-amber-950 h-full overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;
