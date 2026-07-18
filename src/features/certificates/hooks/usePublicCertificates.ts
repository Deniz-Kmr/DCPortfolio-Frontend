import { useQuery } from '@tanstack/react-query';

import { queryKeys, unwrapApiResponse } from '../../../services/api';
import { getPublicCertificates } from '../../../services/public';

export function usePublicCertificates() {
  return useQuery({
    queryKey: queryKeys.public.certificates,
    queryFn: async () => unwrapApiResponse(await getPublicCertificates()),
  });
}
