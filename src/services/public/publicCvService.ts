import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { PublicCv } from '../../types/public';

export async function getPublicCv() {
  const response = await apiClient.get<ApiResponse<PublicCv>>(apiRoutes.public.cv);

  return response.data;
}
