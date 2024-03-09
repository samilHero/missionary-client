import { useQuery } from '@tanstack/react-query';

import useUserApi from '@apis/user';

export const useLoginQuery = () => {
  const { login } = useUserApi();
  const queryFn = async (request) => {
    const { data: response } = await login(request);
  };

  return useQuery([''], queryFn);
};
