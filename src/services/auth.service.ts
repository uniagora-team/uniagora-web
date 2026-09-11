import api, {
  clearTokens,
  getRefreshToken,
  setTokens,
} from "./api";

import type {
  AuthData,
  LoginPayload,
  LogoutPayload,
  PasswordResetConfirmPayload,
  PasswordResetRequestPayload,
  RegisterPayload,
  SetActiveUniversityPayload,
  UpdateProfilePayload,
  User,
} from "../types/auth";

import type { ApiSuccessResponse } from "../types/api";

const authService = {
  async register(payload: RegisterPayload): Promise<AuthData> {
    const response = await api.post<ApiSuccessResponse<AuthData>>(
      "/auth/register/",
      payload,
    );

    const { access, refresh } = response.data.data;

    setTokens(access, refresh);

    return response.data.data;
  },

  async login(payload: LoginPayload): Promise<AuthData> {
    const response = await api.post<ApiSuccessResponse<AuthData>>(
      "/auth/login/",
      payload,
    );

    const { access, refresh } = response.data.data;

    setTokens(access, refresh);

    return response.data.data;
  },

  async logout(): Promise<void> {
    const refresh = getRefreshToken();

    if (!refresh) {
      clearTokens();
      return;
    }

    const payload: LogoutPayload = {
      refresh,
    };

    try {
      await api.post("/auth/logout/", payload);
    } finally {
      clearTokens();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<ApiSuccessResponse<User>>(
      "/users/me/",
    );

    return response.data.data;
  },

  async updateProfile(
    payload: UpdateProfilePayload,
  ): Promise<User> {
    const response = await api.patch<ApiSuccessResponse<User>>(
      "/users/me/",
      payload,
    );

    return response.data.data;
  },

  async setActiveUniversity(
    payload: SetActiveUniversityPayload,
  ): Promise<User> {
    const response = await api.patch<ApiSuccessResponse<User>>(
      "/users/me/active-university/",
      payload,
    );

    return response.data.data;
  },

  async requestPasswordReset(
    payload: PasswordResetRequestPayload,
  ): Promise<void> {
    await api.post(
      "/auth/password-reset/request/",
      payload,
    );
  },

  async confirmPasswordReset(
    payload: PasswordResetConfirmPayload,
  ): Promise<void> {
    await api.post(
      "/auth/password-reset/confirm/",
      payload,
    );
  },
};

export default authService;