import api from './instance';

export interface AuthUser {
  id: number;
  email: string;
  role: string;
  provider: string;
}

export const authApi = {
  login(email: string, password: string) {
    return api.post('/auth/login', { email, password });
  },

  logout() {
    return api.post('/auth/logout');
  },

  getMe() {
    return api.get<AuthUser>('/auth/me');
  },

  refresh() {
    return api.post('/auth/refresh');
  },
};
