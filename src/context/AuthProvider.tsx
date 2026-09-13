import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import authService from "../services/auth.service";
import {
  clearTokens,
  getAccessToken,
  getApiErrorMessage,
} from "../services/api";

import { AuthContext } from "./AuthContext";

import type {
  LoginPayload,
  RegisterPayload,
  SetActiveUniversityPayload,
  User,
} from "../types/auth";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({
  children,
}: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async (): Promise<User | null> => {
    const accessTokenAtStart = getAccessToken();

    if (!accessTokenAtStart) {
      setUser(null);
      return null;
    }

    try {
      const currentUser = await authService.getCurrentUser();

      if (getAccessToken() !== accessTokenAtStart) {
        return null;
      }

      setUser(currentUser);

      return currentUser;
    } catch (requestError) {
      if (getAccessToken() !== accessTokenAtStart) {
        return null;
      }

      clearTokens();
      setUser(null);

      setError(
        getApiErrorMessage(
          requestError,
          "Your session has expired. Please log in again.",
        ),
      );

      return null;
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    const initializeAuth = async () => {
      await refreshUser();

      if (isMounted) {
        setIsLoading(false);
      }
    };

    void initializeAuth();

    return () => {
      isMounted = false;
    };
  }, [refreshUser]);

  const login = useCallback(
    async (payload: LoginPayload): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const authData = await authService.login(payload);

        setUser(authData.user);

        return authData.user;
      } catch (requestError) {
        const message = getApiErrorMessage(
          requestError,
          "Unable to log in. Please check your credentials.",
        );

        setError(message);

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const register = useCallback(
    async (payload: RegisterPayload): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const authData = await authService.register(payload);

        setUser(authData.user);

        return authData.user;
      } catch (requestError) {
        const message = getApiErrorMessage(
          requestError,
          "Unable to create your account. Please try again.",
        );

        setError(message);

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const setActiveUniversity = useCallback(
    async (
      payload: SetActiveUniversityPayload,
    ): Promise<User> => {
      setIsLoading(true);
      setError(null);

      try {
        const updatedUser =
          await authService.setActiveUniversity(payload);

        setUser(updatedUser);

        return updatedUser;
      } catch (requestError) {
        const message = getApiErrorMessage(
          requestError,
          "Unable to update your university. Please try again.",
        );

        setError(message);

        throw requestError;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const logout = useCallback(async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.logout();
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to complete logout.",
        ),
      );
    } finally {
      clearTokens();
      setUser(null);
      setIsLoading(false);
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
      setActiveUniversity,
      clearError,
    }),
    [
      user,
      isLoading,
      error,
      login,
      register,
      logout,
      refreshUser,
      setActiveUniversity,
      clearError,
    ],
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}