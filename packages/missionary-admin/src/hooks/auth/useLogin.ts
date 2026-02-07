import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authApi } from 'apis/auth';
import { queryKeys } from 'lib/queryKeys';
import { useRouter } from 'next/navigation';

export function useLogin() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({ email, password }: { email: string; password: string }) =>
      authApi.login(email, password),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.auth.me() });
      router.push('/');
    },
  });
}
