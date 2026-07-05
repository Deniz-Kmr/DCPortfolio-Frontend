import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { PublicExperience } from '../../types/public';

export async function getPublicExperiences() {
  const response = await apiClient.get<ApiResponse<PublicExperience[]>>(
    apiRoutes.public.experiences,
  );

  return response.data;
}
