import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminEnglishPlanById } from '../../../services/admin';
import type { AdminEnglishPlanDetail } from '../../../types/admin';

function getAdminEnglishPlanErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'English plan detayı yüklenemedi.';
}

export function useAdminEnglishPlan(id: number | null) {
  return useQuery<AdminEnglishPlanDetail, Error>({
    queryKey:
      id !== null
        ? queryKeys.admin.englishPlanDetail(id)
        : [...queryKeys.admin.englishPlans, 'detail', 'idle'],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        throw new Error('English plan ID bulunamadı.');
      }

      const response = await getAdminEnglishPlanById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminEnglishPlanErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
