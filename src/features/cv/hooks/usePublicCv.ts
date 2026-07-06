import { useQuery } from '@tanstack/react-query';

import { queryKeys, unwrapApiResponse } from '../../../services/api';
import { getPublicCv } from '../../../services/public';

export function usePublicCv() {
  return useQuery({
    queryKey: queryKeys.public.cv,
    queryFn: async () => unwrapApiResponse(await getPublicCv()),
  });
}
