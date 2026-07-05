import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { AdminDashboard } from '../../types/admin';

export async function getAdminDashboard() {
  const response = await apiClient.get<ApiResponse<AdminDashboard>>(apiRoutes.admin.dashboard);

  return response.data;
}
