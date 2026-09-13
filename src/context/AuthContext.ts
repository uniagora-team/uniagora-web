import { createContext } from "react";

import type {
  LoginPayload,
  RegisterPayload,
  SetActiveUniversityPayload,
  User,
} from "../types/auth";

export interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (payload: LoginPayload) => Promise<User>;
  register: (payload: RegisterPayload) => Promise<User>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<User | null>;
  setActiveUniversity: (
    payload: SetActiveUniversityPayload,
  ) => Promise<User>;
  clearError: () => void;
}

export const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);