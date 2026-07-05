import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminTechnologyCreateRequest,
  AdminTechnologyDetail,
  AdminTechnologyListItem,
  AdminTechnologyUpdateRequest,
} from '../../types/admin';

export async function getAdminTechnologies() {
  const response = await apiClient.get<ApiResponse<AdminTechnologyListItem[]>>(
    apiRoutes.admin.technologies,
  );

  return response.data;
}

export async function getAdminTechnologyById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminTechnologyDetail>>(
    apiRoutes.admin.technologyById(id),
  );

  return response.data;
}

export async function createAdminTechnology(request: AdminTechnologyCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminTechnologyDetail>>(
    apiRoutes.admin.technologies,
    request,
  );

  return response.data;
}

export async function updateAdminTechnology(id: number, request: AdminTechnologyUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminTechnologyDetail>>(
    apiRoutes.admin.technologyById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminTechnology(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.technologyById(id),
  );

  return response.data;
}
