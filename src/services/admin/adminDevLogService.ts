import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminDevLogCreateRequest,
  AdminDevLogDetail,
  AdminDevLogListItem,
  AdminDevLogUpdateRequest,
} from '../../types/admin';

export async function getAdminDevLogs() {
  const response = await apiClient.get<ApiResponse<AdminDevLogListItem[]>>(
    apiRoutes.admin.devLogs,
  );

  return response.data;
}

export async function getAdminDevLogById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminDevLogDetail>>(
    apiRoutes.admin.devLogById(id),
  );

  return response.data;
}

export async function createAdminDevLog(request: AdminDevLogCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminDevLogDetail>>(
    apiRoutes.admin.devLogs,
    request,
  );

  return response.data;
}

export async function updateAdminDevLog(id: number, request: AdminDevLogUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminDevLogDetail>>(
    apiRoutes.admin.devLogById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminDevLog(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(apiRoutes.admin.devLogById(id));

  return response.data;
}
