// src/pages/SignUp.tsx
import React, { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../context/authStore";
import { Input } from "../components/ui/Input";
import { Button } from "../components/ui/Button";
// import {
//   EnvelopeIcon,
//   LockClosedIcon,
//   UserIcon,
// } from "@heroicons/react/24/outline";

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

    // Проверка совпадения паролей
    if (password !== passwordConfirm) {
      setFormError("Пароли не совпадают");
      return;
    }

    // Проверка минимальной длины
    if (password.length < 6) {
      setFormError("Пароль должен быть не менее 6 символов");
      return;
    }

    try {
      await register(email, password, name || undefined);
      navigate("/dashboard");
    } catch (err: unknown) {
      console.error("Ошибка регистрации:", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        {/* Зеленая верхняя полоса */}
        <div className="bg-[#009257] py-4">
          <h2 className="font-semibold text-center text-white">Регистрация</h2>
        </div>

        <div className="p-8">
          {(formError || error) && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
              {formError || error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* <Input
              id="name"
              label="Имя (необязательно)"
              type="text"
              placeholder="Ваше имя"
              value={name}
              onChange={(e) => setName(e.target.value)}
              // icon={<UserIcon className="h-5 w-5" />}
            /> */}

            <Input
              id="email"
              label="Email"
              type="email"
              placeholder="Введите ваш email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              // icon={<EnvelopeIcon className="h-5 w-5" />}
              error={!!(formError || error)}
            />

            <Input
              id="password"
              label="Пароль (min 6 символов)"
              type="password"
              placeholder="Придумайте пароль"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              // icon={<LockClosedIcon className="h-5 w-5" />}
              error={!!(formError || error)}
            />

            <Input
              id="passwordConfirm"
              label="Подтвердите пароль"
              type="password"
              placeholder="Повторите пароль"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
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
              {isLoading ? "Создаём аккаунт..." : "Зарегистрироваться"}
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-gray-600">
              Уже есть аккаунт?{" "}
              <Link
                to="/login"
                className="text-[#009257] font-medium hover:underline"
              >
                Войти
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
