import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminProjects } from '../../../services/admin';
import type { AdminProjectListItem } from '../../../types/admin';

function getAdminProjectsErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Projeler yüklenemedi.';
}

export function useAdminProjects() {
  return useQuery<AdminProjectListItem[], Error>({
    queryKey: queryKeys.admin.projects,
    queryFn: async () => {
      const response = await getAdminProjects();

      if (!response.success || !response.data) {
        throw new Error(getAdminProjectsErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
