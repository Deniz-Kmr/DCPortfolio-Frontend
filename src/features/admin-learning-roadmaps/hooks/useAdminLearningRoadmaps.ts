import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminLearningRoadmaps } from '../../../services/admin';
import type { AdminLearningRoadmapListItem } from '../../../types/admin';

function getAdminLearningRoadmapsErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Learning roadmap kayıtları yüklenemedi.';
}

export function useAdminLearningRoadmaps() {
  return useQuery<AdminLearningRoadmapListItem[], Error>({
    queryKey: queryKeys.admin.learningRoadmaps,
    queryFn: async () => {
      const response = await getAdminLearningRoadmaps();

      if (!response.success || !response.data) {
        throw new Error(getAdminLearningRoadmapsErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
