// src/pages/AdminPage.tsx
import React, { useEffect, useState } from "react";
import axios from "axios";

import { useAuthStore } from "../context/authStore";
import { LogoutButton } from "../components/LogoutButton";

interface SimpleUser {
  id: string;
  email: string;
  role: string;
  name?: string;
}

const AdminPage: React.FC = () => {
  const currentUser = useAuthStore((state) => state.currentUser);
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // useEffect(() => {
  //   const fetchUsers = async () => {
  //     setLoading(true);
  //     setError(null);
  //     try {
  //       const response = await axios.get<SimpleUser[]>(
  //         `http://localhost:4000/api/users`
  //       );
  //       setUsers(response.data);
  //     } catch (err) {
  //       console.error("Ошибка при получении списка пользователей:", err);
  //       setError("Не удалось загрузить список пользователей");
  //     }
  //     setLoading(false);
  //   };

  //   fetchUsers();
  // }, []);

  if (!currentUser) {
    // Защиту по-сути берёт на себя AdminRoute, но на всякий случай:
    return <div>Доступ запрещён</div>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        Загрузка списка пользователей...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center text-red-600">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-2xl shadow">
        <h1 className="text-3xl font-semibold mb-4">Админ-панель</h1>
        <table className="w-full table-auto border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-200 px-4 py-2 text-left">ID</th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Email
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-200 px-4 py-2 text-left">
                Role
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td className="border border-gray-200 px-4 py-2">{u.id}</td>
                <td className="border border-gray-200 px-4 py-2">{u.email}</td>
                <td className="border border-gray-200 px-4 py-2">
                  {u.name || "-"}
                </td>
                <td className="border border-gray-200 px-4 py-2">{u.role}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6">
          <LogoutButton />
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
