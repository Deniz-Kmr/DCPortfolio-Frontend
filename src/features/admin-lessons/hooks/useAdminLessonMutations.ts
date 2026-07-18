import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminLesson,
  deleteAdminLesson,
  updateAdminLesson,
} from '../../../services/admin';
import type {
  AdminLessonCreateRequest,
  AdminLessonDetail,
  AdminLessonUpdateRequest,
} from '../../../types/admin';
import { getAdminLessonDetailQueryKey } from './useAdminLesson';

type UpdateAdminLessonVariables = {
  id: number;
  request: AdminLessonUpdateRequest;
};

function getLessonMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Lesson işlemi tamamlanamadı.';
}

export function useCreateAdminLesson() {
  const queryClient = useQueryClient();

  return useMutation<AdminLessonDetail, Error, AdminLessonCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminLesson(request);

      if (!response.success || !response.data) {
        throw new Error(getLessonMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lessons }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminLesson() {
  const queryClient = useQueryClient();

  return useMutation<AdminLessonDetail, Error, UpdateAdminLessonVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminLesson(id, request);

      if (!response.success || !response.data) {
        throw new Error(getLessonMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (lesson) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lessons }),
        queryClient.invalidateQueries({ queryKey: getAdminLessonDetailQueryKey(lesson.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminLesson() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminLesson(id);

      if (!response.success) {
        throw new Error(getLessonMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.lessons }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
