import { useQuery } from '@tanstack/react-query';
import { missionaryApi } from 'apis/missionary';
import { queryKeys } from 'lib/queryKeys';

export function useMissionaries() {
  return useQuery({
    queryKey: queryKeys.missionaries.list(),
    queryFn: async () => {
      const response = await missionaryApi.getMissionaries();
      return response.data;
    },
  });
}
