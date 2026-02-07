import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionaryApi, type CreateMissionaryPayload } from 'apis/missionary';
import { queryKeys } from 'lib/queryKeys';
import { useRouter } from 'next/navigation';

export function useCreateMissionary() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (data: CreateMissionaryPayload) =>
      missionaryApi.createMissionary(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all });
      router.push('/missions');
    },
  });
}
