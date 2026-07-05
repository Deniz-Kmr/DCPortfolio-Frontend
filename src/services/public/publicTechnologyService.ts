import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { PublicTechnology, PublicTechnologyGroup } from '../../types/public';

export async function getPublicTechnologies() {
  const response = await apiClient.get<ApiResponse<PublicTechnology[]>>(
    apiRoutes.public.technologies,
  );

  return response.data;
}

export async function getGroupedPublicTechnologies() {
  const response = await apiClient.get<ApiResponse<PublicTechnologyGroup[]>>(
    apiRoutes.public.groupedTechnologies,
  );

  return response.data;
}
