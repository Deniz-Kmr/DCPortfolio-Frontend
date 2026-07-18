import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminLessonById } from '../../../services/admin';
import type { AdminLessonDetail } from '../../../types/admin';

export function getAdminLessonDetailQueryKey(id: number) {
  return [...queryKeys.admin.lessons, 'detail', id] as const;
}

function getAdminLessonErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Lesson detayı yüklenemedi.';
}

export function useAdminLesson(id: number | null) {
  return useQuery<AdminLessonDetail, Error>({
    queryKey:
      id !== null ? getAdminLessonDetailQueryKey(id) : [...queryKeys.admin.lessons, 'detail', 'idle'],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        throw new Error('Lesson ID bulunamadı.');
      }

      const response = await getAdminLessonById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminLessonErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
