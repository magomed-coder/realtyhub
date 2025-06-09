import axios, { AxiosError } from "axios";
import type { AuthLoginResponse, AuthResponse, AuthState } from "../types/auth";
import { create } from "zustand";
import { tokenService } from "../services/tokenService";
import api from "../lib/api";
import { API_ENDPOINTS } from "../constants/system";

export const useAuthStore = create<AuthState>((set, get) => ({
  // --- Начальное состояние ---
  currentUser: null,
  token: null,
  isLoading: true, // если токен был, предположим, что идёт fetchMe
  error: null,

  // --- Экшены ---

  // 1) fetchMe: проверяем валидность токена и получаем профиль
  fetchMe: async () => {
    const token = await tokenService.getAccessToken();
    if (!token) {
      // Если токена нет, сразу завершаем
      set({ isLoading: false });
      return;
    }

    // Устанавливаем индикатор загрузки
    set({ isLoading: true, error: null });
    try {
      const response = await api.get<AuthResponse>(API_ENDPOINTS.USER_INFO);

      const fetchedUser = response.data;
      set({ currentUser: fetchedUser, isLoading: false });
    } catch (e) {
      // Если 401 или другая ошибка — считаем, что сессия недействительна
      console.error("[fetchMe error:]", e);

      set({ currentUser: null, token: null, isLoading: false });
      await tokenService.clearTokens();
    }
  },

  // 2) login: POST /api/token/ → { access_token, refresh_token }
  login: async (username, password) => {
    set({ isLoading: true, error: null });

    try {
      const response = await api.post<AuthLoginResponse>(API_ENDPOINTS.LOGIN, {
        username,
        password,
      });

      const { access, refresh } = response.data;
      await tokenService.saveTokens(access, refresh);

      // После успешного login вызываем fetchMe, чтобы получить currentUser
      await get().fetchMe();
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      let message = "Не удалось войти";

      if (error?.response?.data.message) {
        message = error.response.data.message;
      }

      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 3) register: POST /api/register/ → { access_token, refresh_token  }
  register: async (email, password, name) => {
    set({ isLoading: true, error: null });

    try {
      const response = await axios.post<AuthResponse>(API_ENDPOINTS.REGISTER, {
        email,
        password,
        name,
      });

      const fetchedUser = response.data;

      // localStorage.setItem("token", token);
      // axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      set({ currentUser: fetchedUser, isLoading: false });
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      let message = "Не удалось зарегистрироваться";

      if (error?.response?.data.message) {
        message = error.response.data.message;
      }

      set({ error: message, isLoading: false });
      throw new Error(message);
    }
  },

  // 4) logout: сбрасываем всё
  logout: async () => {
    await tokenService.clearTokens();
    set({ currentUser: null, token: null });
  },
}));
