import { useQuery } from '@tanstack/react-query';
import { authApi, type AuthUser } from 'apis/auth';
import { queryKeys } from 'lib/queryKeys';

export function useMe() {
  return useQuery<AuthUser>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
    retry: false,
  });
}
