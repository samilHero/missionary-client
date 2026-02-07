import { useQuery } from '@tanstack/react-query';
import { missionaryApi } from 'apis/missionary';
import { queryKeys } from 'lib/queryKeys';

export function useMissionary(id: string) {
  return useQuery({
    queryKey: queryKeys.missionaries.detail(id),
    queryFn: async () => {
      const response = await missionaryApi.getMissionary(id);
      return response.data;
    },
    enabled: !!id,
  });
}
