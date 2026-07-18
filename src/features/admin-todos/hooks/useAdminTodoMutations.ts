import { useMutation, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import {
  createAdminTodo,
  deleteAdminTodo,
  updateAdminTodo,
} from '../../../services/admin';
import type {
  AdminTodoCreateRequest,
  AdminTodoDetail,
  AdminTodoUpdateRequest,
} from '../../../types/admin';
import { getAdminTodoDetailQueryKey } from './useAdminTodo';

type UpdateAdminTodoVariables = {
  id: number;
  request: AdminTodoUpdateRequest;
};

function getTodoMutationErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Todo işlemi tamamlanamadı.';
}

export function useCreateAdminTodo() {
  const queryClient = useQueryClient();

  return useMutation<AdminTodoDetail, Error, AdminTodoCreateRequest>({
    mutationFn: async (request) => {
      const response = await createAdminTodo(request);

      if (!response.success || !response.data) {
        throw new Error(getTodoMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.todos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useUpdateAdminTodo() {
  const queryClient = useQueryClient();

  return useMutation<AdminTodoDetail, Error, UpdateAdminTodoVariables>({
    mutationFn: async ({ id, request }) => {
      const response = await updateAdminTodo(id, request);

      if (!response.success || !response.data) {
        throw new Error(getTodoMutationErrorMessage(response.message));
      }

      return response.data;
    },
    onSuccess: async (todo) => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.todos }),
        queryClient.invalidateQueries({ queryKey: getAdminTodoDetailQueryKey(todo.id) }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}

export function useDeleteAdminTodo() {
  const queryClient = useQueryClient();

  return useMutation<boolean, Error, number>({
    mutationFn: async (id) => {
      const response = await deleteAdminTodo(id);

      if (!response.success) {
        throw new Error(getTodoMutationErrorMessage(response.message));
      }

      return Boolean(response.data);
    },
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.todos }),
        queryClient.invalidateQueries({ queryKey: queryKeys.admin.dashboard }),
      ]);
    },
  });
}
