import { apiClient } from '../../../shared/services/apiClient';
import type { AuthResponse, LoginPayload } from '../types/auth.types.ts';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const res = await apiClient.post<AuthResponse>('/auth/login', payload);
    return res.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout');
  },
};
