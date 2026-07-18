import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type {
  AdminCertificateCreateRequest,
  AdminCertificateDetail,
  AdminCertificateListItem,
  AdminCertificateUpdateRequest,
} from '../../types/admin';

export async function getAdminCertificates() {
  const response = await apiClient.get<ApiResponse<AdminCertificateListItem[]>>(
    apiRoutes.admin.certificates,
  );

  return response.data;
}

export async function getAdminCertificateById(id: number) {
  const response = await apiClient.get<ApiResponse<AdminCertificateDetail>>(
    apiRoutes.admin.certificateById(id),
  );

  return response.data;
}

export async function createAdminCertificate(request: AdminCertificateCreateRequest) {
  const response = await apiClient.post<ApiResponse<AdminCertificateDetail>>(
    apiRoutes.admin.certificates,
    request,
  );

  return response.data;
}

export async function updateAdminCertificate(id: number, request: AdminCertificateUpdateRequest) {
  const response = await apiClient.put<ApiResponse<AdminCertificateDetail>>(
    apiRoutes.admin.certificateById(id),
    request,
  );

  return response.data;
}

export async function deleteAdminCertificate(id: number) {
  const response = await apiClient.delete<ApiResponse<boolean>>(
    apiRoutes.admin.certificateById(id),
  );

  return response.data;
}
