// src/components/LogoutButton.tsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { LogoutIcon } from "../assets/icons/LogoutIcon";

interface LogoutButtonProps {
  className?: string;
  label?: string;
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  label = "Выйти",
  isLoading = false,
  icon = <LogoutIcon className="text-white" />,
}) => {
  const logout = useAuthStore((state) => state.logout);
  const navigate = useNavigate();

  const handleLogout = () => {
    if (isLoading) return;
    logout();
    navigate("/login");
  };

  const buttonLabel = isLoading ? `${label}...` : label;

  return (
    <button
      onClick={handleLogout}
      disabled={isLoading}
      className={`
        w-full px-4 py-3 rounded text-white flex items-center justify-center transition-all duration-200 ease-in-out
        ${
          isLoading
            ? "bg-red-300 cursor-not-allowed"
            : "bg-red-500 hover:bg-red-600"
        }
        ${className}

          ${icon ? "flex justify-center gap-2" : ""}
      `}
    >
      {icon && icon}
      {buttonLabel}
    </button>
  );
};
