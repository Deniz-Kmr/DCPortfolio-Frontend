import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminCvProfile,
  AdminCvProfileCreateRequest,
  AdminCvProfileUpdateRequest,
} from '../../types/admin';

export async function getAdminCvProfiles() {
  const response = await apiClient.get<ApiResponse<AdminCvProfile[]>>(
    apiRoutes.admin.cvProfiles,
  );

  return response.data;
}

export async function getAdminCvProfileById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminCvProfile>>(
    apiRoutes.admin.cvProfileById(id),
  );

  return response.data;
}

export async function createAdminCvProfile(request: AdminCvProfileCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminCvProfile>>(
    apiRoutes.admin.cvProfiles,
    request,
  );

  return response.data;
}

export async function updateAdminCvProfile(id: number, request: AdminCvProfileUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminCvProfile>>(
    apiRoutes.admin.cvProfileById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminCvProfile(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.cvProfileById(id),
  );

  return response.data;
}
