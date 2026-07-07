import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminEnglishPlans } from '../../../services/admin';
import type { AdminEnglishPlanListItem } from '../../../types/admin';

function getAdminEnglishPlansErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'English plan kayıtları yüklenemedi.';
}

export function useAdminEnglishPlans() {
  return useQuery<AdminEnglishPlanListItem[], Error>({
    queryKey: queryKeys.admin.englishPlans,
    queryFn: async () => {
      const response = await getAdminEnglishPlans();

      if (!response.success || !response.data) {
        throw new Error(getAdminEnglishPlansErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
