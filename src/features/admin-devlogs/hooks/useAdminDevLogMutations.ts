import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminDevLog,
  deleteAdminDevLog,
  updateAdminDevLog,
} from '../../../services/admin';
import type {
  AdminDevLogCreateRequest,
  AdminDevLogDetail,
  AdminDevLogUpdateRequest,
} from '../../../types/admin';
import { getAdminDevLogDetailQueryKey } from './useAdminDevLog';

type UpdateAdminDevLogVariables = {
  id: number;
  request: AdminDevLogUpdateRequest;
};

function getDevLogMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'DevLog işlemi tamamlanamadı.';
}

export function useCreateAdminDevLog() {
  const queryClient = useQueryClient();

  return useMutation<AdminDevLogDetail, Error, AdminDevLogCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminDevLog(request);

      if (!response.success || !response.data) {
        throw new Error(getDevLogMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.devLogs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminDevLog() {
  const queryClient = useQueryClient();

  return useMutation<AdminDevLogDetail, Error, UpdateAdminDevLogVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminDevLog(id, request);

      if (!response.success || !response.data) {
        throw new Error(getDevLogMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (devLog) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.devLogs }),
        queryClient.invalidateQueries({ queryKey: getAdminDevLogDetailQueryKey(devLog.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminDevLog() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminDevLog(id);

      if (!response.success) {
        throw new Error(getDevLogMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.devLogs }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
