import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminLearningRoadmapById } from '../../../services/admin';
import type { AdminLearningRoadmapDetail } from '../../../types/admin';

function getAdminLearningRoadmapErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Learning roadmap detayı yüklenemedi.';
}

export function useAdminLearningRoadmap(id: number | null) {
  return useQuery<AdminLearningRoadmapDetail, Error>({
    queryKey:
      id !== null
        ? queryKeys.admin.learningRoadmapDetail(id)
        : [...queryKeys.admin.learningRoadmaps, 'detail', 'idle'],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        throw new Error('Learning roadmap ID bulunamadı.');
      }

      const response = await getAdminLearningRoadmapById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminLearningRoadmapErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
