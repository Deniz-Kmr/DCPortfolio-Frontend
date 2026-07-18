import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminDashboard } from '../../../services/admin';
import { getAccessToken } from '../../../services/auth';
import type { AdminDashboard } from '../../../types/admin';

function getDashboardErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Dashboard verileri yüklenemedi.';
}

export function useAdminDashboard() {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AdminDashboard, Error>({
    queryKey: queryKeys.admin.dashboard,
    enabled: hasToken,
    retry: false,
    queryFn: async () => {
      const response = await getAdminDashboard();

      if (!response.success || !response.data) {
        throw new Error(getDashboardErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
