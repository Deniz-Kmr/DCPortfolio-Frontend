import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminTodos } from '../../../services/admin';
import type { AdminTodoListItem } from '../../../types/admin';

function getAdminTodosErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Todo kayıtları yüklenemedi.';
}

export function useAdminTodos() {
  return useQuery<AdminTodoListItem[], Error>({
    queryKey: queryKeys.admin.todos,
    queryFn: async () => {
      const response = await getAdminTodos();

      if (!response.success || !response.data) {
        throw new Error(getAdminTodosErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
