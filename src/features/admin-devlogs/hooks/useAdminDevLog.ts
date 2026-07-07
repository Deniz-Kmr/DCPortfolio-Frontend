import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminDevLogById } from '../../../services/admin';
import type { AdminDevLogDetail } from '../../../types/admin';

export function getAdminDevLogDetailQueryKey(id: number) {
  return [...queryKeys.admin.devLogs, 'detail', id] as const;
}

function getAdminDevLogErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'DevLog detayı yüklenemedi.';
}

export function useAdminDevLog(id: number | null) {
  return useQuery<AdminDevLogDetail, Error>({
    queryKey: id ? getAdminDevLogDetailQueryKey(id) : [...queryKeys.admin.devLogs, 'detail', 'idle'],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        throw new Error('DevLog ID bulunamadı.');
      }

      const response = await getAdminDevLogById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminDevLogErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
