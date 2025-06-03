export enum API_ENDPOINTS {
  LOGIN = "/api/token/",
  REFRESH_TOKEN = "/api/token/refresh/",
  USER_INFO = "/api/me/",

  //TODO:
  REGISTER = "/api/register/",
}

export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  USER_NAME: "user_name",
} as const;
