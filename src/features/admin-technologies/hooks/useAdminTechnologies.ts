import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminTechnologies } from '../../../services/admin';
import type { AdminTechnologyListItem } from '../../../types/admin';

function getAdminTechnologiesErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Teknolojiler yüklenemedi.';
}

export function useAdminTechnologies() {
  return useQuery<AdminTechnologyListItem[], Error>({
    queryKey: queryKeys.admin.technologies,
    queryFn: async () => {
      const response = await getAdminTechnologies();

      if (!response.success || !response.data) {
        throw new Error(getAdminTechnologiesErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
