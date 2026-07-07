import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminExperience,
  deleteAdminExperience,
  updateAdminExperience,
} from '../../../services/admin';
import type {
  AdminExperienceCreateRequest,
  AdminExperienceDetail,
  AdminExperienceUpdateRequest,
} from '../../../types/admin';

type UpdateAdminExperienceVariables = {
  id: number;
  request: AdminExperienceUpdateRequest;
};

function getExperienceMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Deneyim işlemi tamamlanamadı.';
}

export function useCreateAdminExperience() {
  const queryClient = useQueryClient();

  return useMutation<AdminExperienceDetail, Error, AdminExperienceCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminExperience(request);

      if (!response.success || !response.data) {
        throw new Error(getExperienceMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminExperience() {
  const queryClient = useQueryClient();

  return useMutation<AdminExperienceDetail, Error, UpdateAdminExperienceVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminExperience(id, request);

      if (!response.success || !response.data) {
        throw new Error(getExperienceMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (experience) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.experienceDetail(experience.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminExperience() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminExperience(id);

      if (!response.success) {
        throw new Error(getExperienceMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.experiences }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
