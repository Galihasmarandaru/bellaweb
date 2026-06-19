import { useMutation } from '@tanstack/react-query';
import { authService } from '../services/authService.ts';
import type { LoginPayload } from '../types/auth.types.ts';

export function useLogin() {
  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
  });
}
