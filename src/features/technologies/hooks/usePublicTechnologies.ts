import { useQuery } from '@tanstack/react-query';

import { queryKeys, unwrapApiResponse } from '../../../services/api';
import {
  getGroupedPublicTechnologies,
  getPublicTechnologies,
} from '../../../services/public';

export function usePublicTechnologies() {
  return useQuery({
    queryKey: queryKeys.public.technologies,
    queryFn: async () => unwrapApiResponse(await getPublicTechnologies()),
  });
}

export function useGroupedPublicTechnologies() {
  return useQuery({
    queryKey: queryKeys.public.groupedTechnologies,
    queryFn: async () => unwrapApiResponse(await getGroupedPublicTechnologies()),
  });
}
