// src/pages/Login.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
// import { EnvelopeIcon, LockClosedIcon } from "@heroicons/react/24/outline";

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

    if (!username || !password) {
      setFormError("Введите email и пароль");
      return;
    }

    try {
      await login(username, password);
      navigate(fromPath, { replace: true });
    } catch (err: unknown) {
      console.error("Ошибка входа:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="bg-[#009257] py-4">
          <h2 className="font-semibold text-center text-white">
            Вход в систему
          </h2>
        </div>

        <div className="p-8">
          {(formError || error) && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              id="username"
              label="Email"
              type="email"
              placeholder="Введите ваш email"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              // icon={<EnvelopeIcon className="h-5 w-5" />}
              error={!!(formError || error)}
            />

            <Input
              id="password"
              label="Пароль"
              type="password"
              placeholder="Введите ваш пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // icon={<LockClosedIcon className="h-5 w-5" />}
              error={!!(formError || error)}
            />

            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isLoading}
            >
              Войти
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Нет аккаунта?{" "}
              <Link
                to="/signup"
                className="text-[#009257] font-medium hover:underline"
              >
                Зарегистрироваться
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
