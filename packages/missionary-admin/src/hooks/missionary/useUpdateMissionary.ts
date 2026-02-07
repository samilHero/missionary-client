import { useMutation, useQueryClient } from '@tanstack/react-query';
import { missionaryApi, type UpdateMissionaryPayload } from 'apis/missionary';
import { queryKeys } from 'lib/queryKeys';

export function useUpdateMissionary(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateMissionaryPayload) =>
      missionaryApi.updateMissionary(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.missionaries.all });
    },
  });
}
