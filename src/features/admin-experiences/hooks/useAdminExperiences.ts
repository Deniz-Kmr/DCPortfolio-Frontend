import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminExperiences } from '../../../services/admin';
import type { AdminExperienceListItem } from '../../../types/admin';

function getAdminExperiencesErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Deneyimler yüklenemedi.';
}

export function useAdminExperiences() {
  return useQuery<AdminExperienceListItem[], Error>({
    queryKey: queryKeys.admin.experiences,
    queryFn: async () => {
      const response = await getAdminExperiences();

      if (!response.success || !response.data) {
        throw new Error(getAdminExperiencesErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
