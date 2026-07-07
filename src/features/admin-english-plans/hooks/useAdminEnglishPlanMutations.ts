import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminEnglishPlan,
  deleteAdminEnglishPlan,
  updateAdminEnglishPlan,
} from '../../../services/admin';
import type {
  AdminEnglishPlanCreateRequest,
  AdminEnglishPlanDetail,
  AdminEnglishPlanUpdateRequest,
} from '../../../types/admin';

type UpdateAdminEnglishPlanVariables = {
  id: number;
  request: AdminEnglishPlanUpdateRequest;
};

function getEnglishPlanMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'English plan işlemi tamamlanamadı.';
}

export function useCreateAdminEnglishPlan() {
  const queryClient = useQueryClient();

  return useMutation<AdminEnglishPlanDetail, Error, AdminEnglishPlanCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminEnglishPlan(request);

      if (!response.success || !response.data) {
        throw new Error(getEnglishPlanMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.englishPlans }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminEnglishPlan() {
  const queryClient = useQueryClient();

  return useMutation<AdminEnglishPlanDetail, Error, UpdateAdminEnglishPlanVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminEnglishPlan(id, request);

      if (!response.success || !response.data) {
        throw new Error(getEnglishPlanMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (plan) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.englishPlans }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.englishPlanDetail(plan.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminEnglishPlan() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminEnglishPlan(id);

      if (!response.success) {
        throw new Error(getEnglishPlanMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.englishPlans }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
