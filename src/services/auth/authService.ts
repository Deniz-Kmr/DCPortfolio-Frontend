import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { AuthResponse, AuthUser, CreateAdminRequest, LoginRequest } from '../../types/auth';

export async function createAdmin(request: CreateAdminRequest) {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(
    apiRoutes.auth.createAdmin,
    request,
  );

  return response.data;
}

export async function login(request: LoginRequest) {
  const response = await apiClient.post<ApiResponse<AuthResponse>>(apiRoutes.auth.login, request);

  return response.data;
}

export async function getCurrentUser() {
  const response = await apiClient.get<ApiResponse<AuthUser>>(apiRoutes.auth.me);

  return response.data;
}
