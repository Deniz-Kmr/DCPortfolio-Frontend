import { apiClient } from '../api/apiClient';
import { apiRoutes } from '../api/apiRoutes';
import type { ApiResponse } from '../../types/api/apiResponse';
import type { PublicProjectDetail, PublicProjectListItem } from '../../types/public';

export async function getPublicProjects() {
  const response = await apiClient.get<ApiResponse<PublicProjectListItem[]>>(
    apiRoutes.public.projects,
  );

  return response.data;
}

export async function getFeaturedPublicProjects() {
  const response = await apiClient.get<ApiResponse<PublicProjectListItem[]>>(
    apiRoutes.public.featuredProjects,
  );

  return response.data;
}

export async function getPublicProjectBySlug(slug: string) {
  const response = await apiClient.get<ApiResponse<PublicProjectDetail>>(
    apiRoutes.public.projectBySlug(slug),
  );

  return response.data;
}
