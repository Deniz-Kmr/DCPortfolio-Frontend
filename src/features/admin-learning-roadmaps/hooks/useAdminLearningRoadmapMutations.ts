import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminLearningRoadmap,
  deleteAdminLearningRoadmap,
  updateAdminLearningRoadmap,
} from '../../../services/admin';
import type {
  AdminLearningRoadmapCreateRequest,
  AdminLearningRoadmapDetail,
  AdminLearningRoadmapUpdateRequest,
} from '../../../types/admin';

type UpdateAdminLearningRoadmapVariables = {
  id: number;
  request: AdminLearningRoadmapUpdateRequest;
};

function getLearningRoadmapMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Learning roadmap işlemi tamamlanamadı.';
}

export function useCreateAdminLearningRoadmap() {
  const queryClient = useQueryClient();

  return useMutation<AdminLearningRoadmapDetail, Error, AdminLearningRoadmapCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminLearningRoadmap(request);

      if (!response.success || !response.data) {
        throw new Error(getLearningRoadmapMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.learningRoadmaps }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminLearningRoadmap() {
  const queryClient = useQueryClient();

  return useMutation<AdminLearningRoadmapDetail, Error, UpdateAdminLearningRoadmapVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminLearningRoadmap(id, request);

      if (!response.success || !response.data) {
        throw new Error(getLearningRoadmapMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (roadmap) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.learningRoadmaps }),
        queryClient.invalidateQueries({
          queryKey: queryKeys.admin.learningRoadmapDetail(roadmap.id),
        }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminLearningRoadmap() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminLearningRoadmap(id);

      if (!response.success) {
        throw new Error(getLearningRoadmapMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.learningRoadmaps }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
