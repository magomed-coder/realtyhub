import axios from "axios";
import { STORAGE_KEYS } from "../constants/system";

export const tokenService = {
  /**
   * Возвращает текущий access-токен из localStorage (или null, если нет).
   */
  async getAccessToken(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN));
  },

  /**
   * Возвращает текущий refresh-токен из localStorage (или null, если нет).
   */
  async getRefreshToken(): Promise<string | null> {
    return Promise.resolve(localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN));
  },

  /**
   * Сохраняет пару токенов (access и refresh) в localStorage.
   */
  async saveTokens(accessToken: string, refreshToken: string): Promise<void> {
    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
    localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
    return Promise.resolve();
  },

  /**
   * Удаляет оба токена (access и refresh) из localStorage.
   */
  async clearTokens(): Promise<void> {
    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
    delete axios.defaults.headers.common["Authorization"];
    return Promise.resolve();
  },
};
