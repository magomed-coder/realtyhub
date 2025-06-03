// src/components/Sidebar.tsx
import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import LogoutButton from "./LogoutButton";

const Sidebar: React.FC = () => {
  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  // Пункты меню для обычных пользователей
  const userMenu = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/profile", label: "Profile", icon: "👤" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/reports", label: "Reports", icon: "📈" },
  ];

  // Пункты меню для администраторов
  const adminMenu = [
    ...userMenu,
    { path: "/admin", label: "Admin Panel", icon: "🔒" },
  ];

  const menuItems = currentUser?.role === "admin" ? adminMenu : userMenu;

  return (
    <div className="w-64 bg-gray-800 text-white h-screen p-4 flex flex-col">
      <div className="mb-8 p-2 border-b border-gray-700">
        <h1 className="text-xl font-bold">App Navigation</h1>
        <p className="text-sm text-gray-400 mt-1">{currentUser?.email}</p>
      </div>

      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={`flex items-center p-3 rounded-lg transition ${
                  location.pathname === item.path
                    ? "bg-blue-600 text-white"
                    : "hover:bg-gray-700"
                }`}
              >
                <span className="mr-3 text-lg">{item.icon}</span>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-auto pt-4 border-t border-gray-700">
        <LogoutButton />
      </div>
    </div>
  );
};

export default Sidebar;
