import { useSuspenseQuery } from '@tanstack/react-query';
import { authApi, type AuthUser } from 'apis/auth';
import { queryKeys } from 'lib/queryKeys';

export function useSuspenseMe() {
  return useSuspenseQuery<AuthUser>({
    queryKey: queryKeys.auth.me(),
    queryFn: async () => {
      const res = await authApi.getMe();
      return res.data;
    },
  });
}
