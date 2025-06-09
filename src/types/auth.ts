// src/types/auth.ts

export interface User {
  username: string;
  id: string;
  email: string;
  name?: string;
  role: string; // "user" или "admin"
}

export interface AuthResponse extends User {
  mock?: string;
}

export interface AuthLoginResponse {
  access: string;
  refresh: string;
}

export interface AuthState {
  currentUser: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;

  // Экшены
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name?: string) => Promise<void>;
  logout: () => void;
  fetchMe: () => Promise<void>;
}
