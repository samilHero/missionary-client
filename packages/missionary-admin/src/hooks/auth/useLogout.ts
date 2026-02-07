import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from 'apis/auth';
import { queryKeys } from 'lib/queryKeys';
import { useRouter } from 'next/navigation';

export function useLogout() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      queryClient.setQueryData(queryKeys.auth.me(), null);
      router.push('/login');
    },
  });
}
