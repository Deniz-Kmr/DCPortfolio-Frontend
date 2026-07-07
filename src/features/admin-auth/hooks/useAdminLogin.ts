import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { login, setAccessToken } from '../../../services/auth';
import type { AuthResponse, LoginRequest } from '../../../types/auth';

function getLoginErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Giriş başarısız. Bilgileri kontrol ediniz.';
}

export function useAdminLogin() {
  const queryClient = useQueryClient();

  return useMutation<AuthResponse, Error, LoginRequest>({
    mutationFn: async (credentials) => {
      const response = await login(credentials);

      if (!response.success || !response.data?.token) {
        throw new Error(getLoginErrorMessage(response.message));
      }

      setAccessToken(response.data.token);

      return response.data;
    },
    onSuccess: (authResponse) => {
      queryClient.setQueryData(queryKeys.auth.me, authResponse.user);
    },
  });
}
