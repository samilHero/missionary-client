import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionaryApi } from 'apis/missionary';
import { queryKeys } from 'lib/queryKeys';
import { useRouter } from 'next/navigation';

export function useDeleteMissionary(id: string) {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: () => missionaryApi.deleteMissionary(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all });
      router.push('/missions');
    },
  });
}
