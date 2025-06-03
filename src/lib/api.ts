import axios from "axios";
import { API_ENDPOINTS } from "../constants/system";
import { tokenService } from "../services/tokenService";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://fav-13.ru";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔁 Перехватчик запросов: добавляет текущий access token в заголовок
api.interceptors.request.use(
  async (config) => {
    const token = await tokenService.getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔁 Перехватчик ответов: при 401 попытается обновить токен и повторить запрос
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("[Token refresh failed]", refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;

// Вспомогательная функция для обновления токена
export const refreshToken = async (): Promise<string> => {
  const refresh_token = await tokenService.getRefreshToken();
  const res = await api.post(API_ENDPOINTS.REFRESH_TOKEN, {
    refresh: refresh_token,
  });
  const { access: access_token, refresh: new_refresh_token } = res.data;
  await tokenService.saveTokens(access_token, new_refresh_token);
  return access_token;
};

// Если нужен дебаг запросов в режиме разработки, можно раскомментировать блок ниже:
// if (process.env.NODE_ENV === "development") {
//   api.interceptors.request.use(
//     (config) => {
//       console.log("=== OUTGOING REQUEST ===");
//       console.log("baseURL:", config.baseURL);
//       console.log("url:", config.url);
//       console.log("Method:", config.method);
//       console.log("Headers:", config.headers);
//       console.log("Data:", config.data);
//       console.log("Params:", config.params);
//       return config;
//     },
//     (error) => {
//       console.error("REQUEST ERROR:", error);
//       return Promise.reject(error);
//     }
//   );
// }
