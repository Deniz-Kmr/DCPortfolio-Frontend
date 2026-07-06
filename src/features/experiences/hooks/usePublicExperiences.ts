import { useQuery } from '@tanstack/react-query';

import { queryKeys, unwrapApiResponse } from '../../../services/api';
import { getPublicExperiences } from '../../../services/public';

export function usePublicExperiences() {
  return useQuery({
    queryKey: queryKeys.public.experiences,
    queryFn: async () => unwrapApiResponse(await getPublicExperiences()),
  });
}
