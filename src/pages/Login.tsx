// src/pages/Login.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const Login: React.FC = () => {
  const login = useAuthStore((state) => state.login);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();
  const location = useLocation();
  const fromPath =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    "/dashboard";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    setFormError(null);
    setFormError(null); // сбрасываем прошлую локальную ошибку

    if (!username || !password) {
      setFormError("Введите email и пароль");
      return;
    }

    try {
      await login(username, password);
      // После успешного login Zustand обновил currentUser и token.
      navigate(fromPath, { replace: true });
    } catch (err: any) {
      console.error("Ошибка входа:", err);
      // Сообщение ошибки уже в store.error
      // Локальная formError нужна лишь для валидации на клиенте
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Вход</h2>

        {/* Отображаем сначала formError (локальную), а потом error из store */}
        {(formError || error) && (
          <div className="mb-4 text-red-600 text-sm">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Входим..." : "Войти"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Нет аккаунта?{" "}
          <Link to="/signup" className="text-blue-600 hover:underline">
            Зарегистрироваться
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
