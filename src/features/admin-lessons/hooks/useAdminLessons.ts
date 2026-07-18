import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminLessons } from '../../../services/admin';
import type { AdminLessonListItem } from '../../../types/admin';

function getAdminLessonsErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Lesson kayıtları yüklenemedi.';
}

export function useAdminLessons() {
  return useQuery<AdminLessonListItem[], Error>({
    queryKey: queryKeys.admin.lessons,
    queryFn: async () => {
      const response = await getAdminLessons();

      if (!response.success || !response.data) {
        throw new Error(getAdminLessonsErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
