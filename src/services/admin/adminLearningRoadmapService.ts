import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminLearningRoadmapCreateRequest,
  AdminLearningRoadmapDetail,
  AdminLearningRoadmapListItem,
  AdminLearningRoadmapUpdateRequest,
} from '../../types/admin';

export async function getAdminLearningRoadmaps() {
  const response = await apiClient.get<ApiResponse<AdminLearningRoadmapListItem[]>>(
    apiRoutes.admin.learningRoadmaps,
  );

  return response.data;
}

export async function getAdminLearningRoadmapById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminLearningRoadmapDetail>>(
    apiRoutes.admin.learningRoadmapById(id),
  );

  return response.data;
}

export async function createAdminLearningRoadmap(request: AdminLearningRoadmapCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminLearningRoadmapDetail>>(
    apiRoutes.admin.learningRoadmaps,
    request,
  );

  return response.data;
}

export async function updateAdminLearningRoadmap(
  id: number,
  request: AdminLearningRoadmapUpdateRequest,
) {
  const response = await apiClient.put<ApiResponse<AdminLearningRoadmapDetail>>(
    apiRoutes.admin.learningRoadmapById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminLearningRoadmap(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.learningRoadmapById(id),
  );

  return response.data;
}
