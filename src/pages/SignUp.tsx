// src/pages/SignUp.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore";

const SignUp: React.FC = () => {
  const register = useAuthStore((state) => state.register);
  const error = useAuthStore((state) => state.error);
  const isLoading = useAuthStore((state) => state.isLoading);

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [formError, setFormError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1) Проверка совпадения паролей
    if (password !== passwordConfirm) {
      setFormError("Пароли не совпадают");
      return;
    }
    // 2) Проверка минимальной длины
    if (password.length < 6) {
      setFormError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      await register(email, password, name || undefined);
      // После успешной регистрации Zustand обновит currentUser и token
      navigate("/dashboard");
    } catch (err: any) {
      console.error("Ошибка регистрации:", err);
      // error из store автоматически выставится
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-6">Регистрация</h2>

        {(formError || error) && (
          <div className="mb-4 text-red-600 text-sm">{formError || error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Имя (необязательно)"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Пароль (min 6 символов)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Повторите пароль"
            value={passwordConfirm}
            onChange={(e) => setPasswordConfirm(e.target.value)}
            required
            className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600">
          Уже есть аккаунт?{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            Войти
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
