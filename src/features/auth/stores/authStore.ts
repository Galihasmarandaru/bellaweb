import { atom, computed } from 'nanostores';
import type { AuthUser } from '../types/auth.types.ts';

export const $user = atom<AuthUser | null>(null);
export const $isAuthenticated = computed($user, (user) => user !== null);

export function setUser(user: AuthUser | null) {
  $user.set(user);
}
