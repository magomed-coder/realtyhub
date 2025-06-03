// src/components/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const LogoutButton: React.FC = () => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <button
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Выйти
    </button>
  );
};

export default LogoutButton;
