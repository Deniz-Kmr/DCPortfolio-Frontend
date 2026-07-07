import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminProjectById } from '../../../services/admin';
import type { AdminProjectDetail } from '../../../types/admin';

function getAdminProjectErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Proje detayı yüklenemedi.';
}

export function useAdminProject(id: number | null) {
  return useQuery<AdminProjectDetail, Error>({
    queryKey: id ? queryKeys.admin.projectDetail(id) : ['admin', 'projects', 'detail', 'empty'],
    enabled: Boolean(id),
    queryFn: async () => {
      if (!id) {
        throw new Error('Proje seçilmedi.');
      }

      const response = await getAdminProjectById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminProjectErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
