import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminTechnology,
  deleteAdminTechnology,
  updateAdminTechnology,
} from '../../../services/admin';
import type {
  AdminTechnologyCreateRequest,
  AdminTechnologyDetail,
  AdminTechnologyUpdateRequest,
} from '../../../types/admin';

type UpdateAdminTechnologyVariables = {
  id: number;
  request: AdminTechnologyUpdateRequest;
};

function getTechnologyMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Teknoloji işlemi tamamlanamadı.';
}

export function useCreateAdminTechnology() {
  const queryClient = useQueryClient();

  return useMutation<AdminTechnologyDetail, Error, AdminTechnologyCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminTechnology(request);

      if (!response.success || !response.data) {
        throw new Error(getTechnologyMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.technologies }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminTechnology() {
  const queryClient = useQueryClient();

  return useMutation<AdminTechnologyDetail, Error, UpdateAdminTechnologyVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminTechnology(id, request);

      if (!response.success || !response.data) {
        throw new Error(getTechnologyMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (technology) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.technologies }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.technologyDetail(technology.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminTechnology() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminTechnology(id);

      if (!response.success) {
        throw new Error(getTechnologyMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.technologies }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
