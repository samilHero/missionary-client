import { useQuery } from '@tanstack/react-query';
import { regionApi } from 'apis/region';
import { queryKeys } from 'lib/queryKeys';

export function useRegions() {
  return useQuery({
    queryKey: queryKeys.regions.list(),
    queryFn: async () => {
      const response = await regionApi.getRegions();
      return response.data;
    },
  });
}
