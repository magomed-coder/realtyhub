import { useState } from "react";
import { useAuthStore } from "../context/authStore";
import { NavLink, useLocation } from "react-router-dom";

import { ProfileIcon } from "../assets/icons/ProfileIcon";
import { LogoutIcon } from "../assets/icons/LogoutIcon";
import { LogoutButton } from "./LogoutButton";
import { HomeIcon } from "../assets/icons/HomeIcon";
import { LayersIcon } from "../assets/icons/LayersIcon";

export const Sidebar = () => {
  // 1. Убрано состояние darkMode
  const [close, setClose] = useState(false);

  const location = useLocation();
  const currentUser = useAuthStore((state) => state.currentUser);

  // Пункты меню для обычных пользователей
  const userMenu = [
    { path: "/dashboard", label: "Dashboard", icon: LayersIcon },
    { path: "/profile", label: "Profile", icon: ProfileIcon },
    { path: "/settings", label: "Settings", icon: LogoutIcon },
    { path: "/reports", label: "Reports", icon: HomeIcon },
  ];

  // Пункты меню для администраторов
  const adminMenu = [
    ...userMenu,
    { path: "/admin", label: "Admin Panel", icon: HomeIcon },
  ];

  const menuItems = currentUser?.role === "admin" ? adminMenu : userMenu;

  return (
    <nav
      className={`     
       px-3 py-5 h-[100vh]       
        transition-all duration-300
        ${close ? "w-24" : "w-64"} 
        bg-white               
      `}
    >
      {/* САМ СПИСОК МЕНЮ + НИЖНИЙ БЛОК */}
      <div className="flex flex-col justify-between h-full  overflow-y-auto no-scrollbar">
        {/* Секция с пунктами меню */}
        <div>
          <ul className="space-y-2">
            {menuItems.map((i, idx) => (
              <li key={idx} className="h-12">
                <NavLink
                  to={i.path}
                  className={`
                    flex items-center w-full h-full rounded-lg
                    transition-colors
                    hover:bg-[#009257] 
                    ${location.pathname === i.path ? "bg-[#009257]" : ""}
                  `}
                >
                  {/* Иконка пункта меню */}
                  <span
                    className={`
                      min-w-[60px] 
                      rounded-lg flex items-center justify-center                     
                      group-hover:text-white                      
                       ${
                         location.pathname === i.path
                           ? "text-white"
                           : "text-[#707070]"
                       }
                      `}
                  >
                    <i.icon
                      className={`${
                        location.pathname === i.path
                          ? "text-white"
                          : "text-[#707070]"
                      }`}
                    />
                  </span>

                  {/* Текст пункта меню: скрывается, когда close=true */}
                  <span
                    className={`
                    whitespace-nowrap transition-opacity
                    ${close ? "opacity-0 w-0" : "opacity-100"}                
                    group-hover:text-white
                     ${
                       location.pathname === i.path
                         ? "text-white"
                         : "text-[#707070]"
                     }
                  `}
                  >
                    {i.label}
                  </span>
                </NavLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Нижняя часть с Logout (только один пункт) */}
        <div className="mt-auto">
          <li className="list-none">
            <LogoutButton className="" />
          </li>
        </div>
      </div>
    </nav>
  );
};
