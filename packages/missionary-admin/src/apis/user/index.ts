import apiInstance from '../instance';

export default function useUserApi() {
  const login = async (params) => apiInstance.post('/');

  return {
    login,
  };
}
