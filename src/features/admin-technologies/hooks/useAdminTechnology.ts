import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminTechnologyById } from '../../../services/admin';
import type { AdminTechnologyDetail } from '../../../types/admin';

function getAdminTechnologyErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Teknoloji detayı yüklenemedi.';
}

export function useAdminTechnology(id: number | null) {
  return useQuery<AdminTechnologyDetail, Error>({
    queryKey: id ? queryKeys.admin.technologyDetail(id) : ['admin', 'technologies', 'detail', 'empty'],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('Teknoloji seçilmedi.');
      }

      const response = await getAdminTechnologyById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminTechnologyErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
