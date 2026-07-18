import { useQuery } from '@tanstack/react-query';

import { queryKeys, unwrapApiResponse } from '../../../services/api';
import {
  getFeaturedPublicProjects,
  getPublicProjectBySlug,
  getPublicProjects,
} from '../../../services/public';

export function usePublicProjects() {
  return useQuery({
    queryKey: queryKeys.public.projects,
    queryFn: async () => unwrapApiResponse(await getPublicProjects()),
  });
}

export function useFeaturedPublicProjects() {
  return useQuery({
    queryKey: queryKeys.public.featuredProjects,
    queryFn: async () => unwrapApiResponse(await getFeaturedPublicProjects()),
  });
}

export function usePublicProjectDetail(slug: string | undefined) {
  return useQuery({
    queryKey: slug
      ? queryKeys.public.projectDetail(slug)
      : (['public', 'projects', 'missing-slug'] as const),
    queryFn: async () => {
      if (!slug) {
        throw new Error('Project slug is missing.');
      }

      return unwrapApiResponse(await getPublicProjectBySlug(slug));
    },
    enabled: Boolean(slug),
  });
}
