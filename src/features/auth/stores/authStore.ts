import { redirect } from '@tanstack/react-router';
import { atom, computed } from 'nanostores';
import { supabase } from '@/shared/lib/supabase';
import type { AuthUser } from '../types/auth.types';

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

if (typeof window !== 'undefined') {
  supabase.auth.onAuthStateChange((event) => {
    if (event === 'SIGNED_OUT') {
      $user.set(null);
    }
  });
}

export function setUser(user: AuthUser | null) {
  $user.set(user);
}

export async function redirectIfAuthenticated(): Promise<void> {
  if (!$isAuthenticated.get()) return;

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    setUser(null);
    return;
  }

  throw redirect({
    to: '/admin',
  });
}

export async function requireAdminAuth(): Promise<void> {
  if (!$isAuthenticated.get()) {
    throw redirect({
      to: '/login',
    });
  }

  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) {
    setUser(null);
    throw redirect({
      to: '/login',
    });
  }
}
