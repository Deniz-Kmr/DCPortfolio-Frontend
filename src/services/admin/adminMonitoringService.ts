import type {
  AdminMonitoringHealth,
  AdminMonitoringHistory,
  AdminMonitoringSummary,
  AdminMonitoringTraffic,
} from '../../types/admin';
import type { ApiResponse } from '../../types/api/apiResponse';
import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';

export async function getAdminMonitoringSummary() {
  const response = await apiClient.get<ApiResponse<AdminMonitoringSummary>>(
    apiRoutes.admin.monitoringSummary,
  );

  return response.data;
}

export async function getAdminMonitoringTraffic() {
  const response = await apiClient.get<ApiResponse<AdminMonitoringTraffic>>(
    apiRoutes.admin.monitoringTraffic,
  );

  return response.data;
}

export async function getAdminMonitoringHealth() {
  const response = await apiClient.get<ApiResponse<AdminMonitoringHealth>>(
    apiRoutes.admin.monitoringHealth,
  );

  return response.data;
}

export async function getAdminMonitoringHistory(days: number) {
  const response = await apiClient.get<ApiResponse<AdminMonitoringHistory>>(
    apiRoutes.admin.monitoringHistory(days),
  );

  return response.data;
}