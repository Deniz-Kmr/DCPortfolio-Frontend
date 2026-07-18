export interface AuthUser {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  expiresAt: string;
  user: AuthUser;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateAdminRequest {
  setupKey: string;
  fullName: string;
  email: string;
  password: string;
}
