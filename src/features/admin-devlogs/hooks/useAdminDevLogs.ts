import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminDevLogs } from '../../../services/admin';
import type { AdminDevLogListItem } from '../../../types/admin';

function getAdminDevLogsErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'DevLog kayıtları yüklenemedi.';
}

export function useAdminDevLogs() {
  return useQuery<AdminDevLogListItem[], Error>({
    queryKey: queryKeys.admin.devLogs,
    queryFn: async () => {
      const response = await getAdminDevLogs();

      if (!response.success || !response.data) {
        throw new Error(getAdminDevLogsErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
