import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getCurrentUser, getAccessToken } from '../../../services/auth';
import type { AuthUser } from '../../../types/auth';

function getCurrentUserErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Oturum doğrulanamadı.';
}

export function useCurrentAdminUser() {
  const hasToken = Boolean(getAccessToken());

  return useQuery<AuthUser, Error>({
    queryKey: queryKeys.auth.me,
    enabled: hasToken,
    retry: false,
    queryFn: async () => {
      const response = await getCurrentUser();

      if (!response.success || !response.data) {
        throw new Error(getCurrentUserErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
