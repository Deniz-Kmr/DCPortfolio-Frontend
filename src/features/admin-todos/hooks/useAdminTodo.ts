import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminTodoById } from '../../../services/admin';
import type { AdminTodoDetail } from '../../../types/admin';

export function getAdminTodoDetailQueryKey(id: number) {
  return [...queryKeys.admin.todos, 'detail', id] as const;
}

function getAdminTodoErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Todo detayı yüklenemedi.';
}

export function useAdminTodo(id: number | null) {
  return useQuery<AdminTodoDetail, Error>({
    queryKey: id ? getAdminTodoDetailQueryKey(id) : [...queryKeys.admin.todos, 'detail', 'idle'],
    enabled: id !== null,
    queryFn: async () => {
      if (id === null) {
        throw new Error('Todo ID bulunamadı.');
      }

      const response = await getAdminTodoById(id);

      if (!response.success || !response.data) {
        throw new Error(getAdminTodoErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
