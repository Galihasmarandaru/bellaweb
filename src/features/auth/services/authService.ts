import { supabase } from '../../../shared/lib/supabase.ts';
import type { AuthResponse, LoginPayload } from '../types/auth.types.ts';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    // Note: Supabase uses email by default, we map username to email here
    let email = payload.username;

    // Map specific username to real email
    if (email.toLowerCase() === 'babela') {
      email = 'gabelgood.2022@gmail.com';
    } else if (!email.includes('@')) {
      email = `${email}@bellasupabase.com`; // Fallback auto append domain
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password: payload.password,
    });

    if (error) {
      throw new Error(error.message);
    }

    if (!data.session || !data.user) {
      throw new Error('Login failed: Invalid session');
    }

    return {
      user: {
        id: data.user.id,
        username: data.user.email || payload.username,
        name: data.user.user_metadata?.name || data.user.email || 'User',
      },
      token: data.session.access_token,
    };
  },

  logout: async (): Promise<void> => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(error.message);
    }
  },
};
