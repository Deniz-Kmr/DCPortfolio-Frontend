import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminProject,
  deleteAdminProject,
  updateAdminProject,
} from '../../../services/admin';
import type {
  AdminProjectCreateRequest,
  AdminProjectDetail,
  AdminProjectUpdateRequest,
} from '../../../types/admin';

type UpdateAdminProjectVariables = {
  id: number;
  request: AdminProjectUpdateRequest;
};

function getProjectMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Proje işlemi tamamlanamadı.';
}

export function useCreateAdminProject() {
  const queryClient = useQueryClient();

  return useMutation<AdminProjectDetail, Error, AdminProjectCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminProject(request);

      if (!response.success || !response.data) {
        throw new Error(getProjectMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminProject() {
  const queryClient = useQueryClient();

  return useMutation<AdminProjectDetail, Error, UpdateAdminProjectVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminProject(id, request);

      if (!response.success || !response.data) {
        throw new Error(getProjectMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (project) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projectDetail(project.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminProject() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminProject(id);

      if (!response.success) {
        throw new Error(getProjectMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.projects }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
