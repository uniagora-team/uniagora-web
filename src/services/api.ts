import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api/v1";

const ACCESS_TOKEN_KEY = "uniagora_access_token";
const REFRESH_TOKEN_KEY = "uniagora_refresh_token";

export interface ApiErrorResponse {
  success?: boolean;
  message?: string;
  errors?: Record<string, unknown>;
}

export const getAccessToken = (): string | null => {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = (): string | null => {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
};

export const setTokens = (access: string, refresh: string): void => {
  localStorage.setItem(ACCESS_TOKEN_KEY, access);
  localStorage.setItem(REFRESH_TOKEN_KEY, refresh);
};

export const clearTokens = (): void => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
};

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const refreshClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const accessToken = getAccessToken();

    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

type FailedRequest = {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
};

let failedQueue: FailedRequest[] = [];

const processQueue = (
  error: unknown,
  token: string | null = null,
): void => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else if (token) {
      resolve(token);
    }
  });

  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiErrorResponse>) => {
    const originalRequest = error.config as
      | (InternalAxiosRequestConfig & { _retry?: boolean })
      | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry
    ) {
      return Promise.reject(error);
    }

    const refreshToken = getRefreshToken();

    if (!refreshToken) {
      clearTokens();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        failedQueue.push({ resolve, reject });
      }).then((newAccessToken) => {
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        return api(originalRequest);
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const response = await refreshClient.post<{
        success: boolean;
        message: string;
        data: {
          access: string;
        };
      }>("/auth/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccessToken = response.data.data.access;

      localStorage.setItem(ACCESS_TOKEN_KEY, newAccessToken);

      processQueue(null, newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      clearTokens();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

const extractErrorMessage = (value: unknown): string | null => {
  if (Array.isArray(value)) {
    for (const item of value) {
      const message = extractErrorMessage(item);

      if (message) {
        return message;
      }
    }

    return null;
  }

  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (value && typeof value === "object") {
    const objectValue = value as Record<string, unknown>;

    for (const nestedValue of Object.values(objectValue)) {
      const message = extractErrorMessage(nestedValue);

      if (message) {
        return message;
      }
    }
  }

  return null;
};

export const getApiErrorMessage = (
  error: unknown,
  fallback = "Something went wrong. Please try again.",
): string => {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const response = error.response?.data;

    if (response?.errors) {
      const errorMessage = extractErrorMessage(response.errors);

      if (errorMessage) {
        return errorMessage;
      }
    }

    if (response?.message) {
      return response.message;
    }
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

export default api;