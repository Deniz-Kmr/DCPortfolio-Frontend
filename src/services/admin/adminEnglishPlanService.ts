import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminEnglishPlanCreateRequest,
  AdminEnglishPlanDetail,
  AdminEnglishPlanListItem,
  AdminEnglishPlanUpdateRequest,
} from '../../types/admin';

export async function getAdminEnglishPlans() {
  const response = await apiClient.get<ApiResponse<AdminEnglishPlanListItem[]>>(
    apiRoutes.admin.englishPlans,
  );

  return response.data;
}

export async function getAdminEnglishPlanById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminEnglishPlanDetail>>(
    apiRoutes.admin.englishPlanById(id),
  );

  return response.data;
}

export async function createAdminEnglishPlan(request: AdminEnglishPlanCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminEnglishPlanDetail>>(
    apiRoutes.admin.englishPlans,
    request,
  );

  return response.data;
}

export async function updateAdminEnglishPlan(id: number, request: AdminEnglishPlanUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminEnglishPlanDetail>>(
    apiRoutes.admin.englishPlanById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminEnglishPlan(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.englishPlanById(id),
  );

  return response.data;
}
