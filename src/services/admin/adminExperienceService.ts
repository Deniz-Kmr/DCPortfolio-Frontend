import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminExperienceCreateRequest,
  AdminExperienceDetail,
  AdminExperienceListItem,
  AdminExperienceUpdateRequest,
} from '../../types/admin';

export async function getAdminExperiences() {
  const response = await apiClient.get<ApiResponse<AdminExperienceListItem[]>>(
    apiRoutes.admin.experiences,
  );

  return response.data;
}

export async function getAdminExperienceById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminExperienceDetail>>(
    apiRoutes.admin.experienceById(id),
  );

  return response.data;
}

export async function createAdminExperience(request: AdminExperienceCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminExperienceDetail>>(
    apiRoutes.admin.experiences,
    request,
  );

  return response.data;
}

export async function updateAdminExperience(id: number, request: AdminExperienceUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminExperienceDetail>>(
    apiRoutes.admin.experienceById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminExperience(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.experienceById(id),
  );

  return response.data;
}
