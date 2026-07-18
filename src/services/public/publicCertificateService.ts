import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { PublicCertificate } from '../../types/public';

export async function getPublicCertificates() {
  const response = await apiClient.get<ApiResponse<PublicCertificate[]>>(
    apiRoutes.public.certificates,
  );

  return response.data;
}
