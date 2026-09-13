export interface University {
  id: string;
  name: string;
  short_name: string;
  slug: string;
  logo: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: string;
  email: string;
  full_name: string;
  phone_number: string;
  active_university: University | null;
  is_vendor: boolean;
  is_admin: boolean;
  is_active: boolean;
  date_joined: string;
  created_at: string;
  updated_at: string;
}

export interface AuthTokens {
  access: string;
  refresh: string;
}

export interface AuthData extends AuthTokens {
  user: User;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name: string;
  phone_number?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LogoutPayload {
  refresh: string;
}

export interface PasswordResetRequestPayload {
  email: string;
}

export interface PasswordResetConfirmPayload {
  uid: string;
  token: string;
  new_password: string;
}

export interface UpdateProfilePayload {
  full_name?: string;
  phone_number?: string;
}

export interface SetActiveUniversityPayload {
  university_slug: string;
}