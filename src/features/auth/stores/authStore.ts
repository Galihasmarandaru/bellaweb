import { atom, computed } from 'nanostores';
import type { AuthUser } from '../types/auth.types.ts';

const savedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
export const $user = atom<AuthUser | null>(savedUser ? JSON.parse(savedUser) : null);
export const $isAuthenticated = computed($user, (user) => user !== null);

$user.listen((user) => {
  if (typeof window !== 'undefined') {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }
});

export function setUser(user: AuthUser | null) {
  $user.set(user);
}
