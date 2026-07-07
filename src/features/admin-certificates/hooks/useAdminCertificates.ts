import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '../../../services/api/queryKeys';
import { getAdminCertificates } from '../../../services/admin';
import type { AdminCertificateListItem } from '../../../types/admin';

function getAdminCertificatesErrorMessage(message: string | null | undefined) {
  return message?.trim() || 'Sertifikalar yüklenemedi.';
}

export function useAdminCertificates() {
  return useQuery<AdminCertificateListItem[], Error>({
    queryKey: queryKeys.admin.certificates,
    queryFn: async () => {
      const response = await getAdminCertificates();

      if (!response.success || !response.data) {
        throw new Error(getAdminCertificatesErrorMessage(response.message));
      }

      return response.data;
    },
  });
}
