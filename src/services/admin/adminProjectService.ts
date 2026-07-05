import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminProjectCreateRequest,
  AdminProjectDetail,
  AdminProjectListItem,
  AdminProjectUpdateRequest,
} from '../../types/admin';

export async function getAdminProjects() {
  const response = await apiClient.get<ApiResponse<AdminProjectListItem[]>>(
    apiRoutes.admin.projects,
  );

  return response.data;
}

export async function getAdminProjectById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminProjectDetail>>(
    apiRoutes.admin.projectById(id),
  );

  return response.data;
}

export async function createAdminProject(request: AdminProjectCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminProjectDetail>>(
    apiRoutes.admin.projects,
    request,
  );

  return response.data;
}

export async function updateAdminProject(id: number, request: AdminProjectUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminProjectDetail>>(
    apiRoutes.admin.projectById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminProject(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(apiRoutes.admin.projectById(id));

  return response.data;
}
