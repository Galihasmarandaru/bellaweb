import { useNavigate } from '@tanstack/react-router';
import { authService } from '../../auth/services/authService.ts';
import { setUser } from '../../auth/stores/authStore.ts';

export function Cms() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      navigate({ to: '/login' });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 p-4">
      <h1 className="text-2xl font-bold">Welcome to Admin</h1>
      <button
        onClick={handleLogout}
        className="rounded-md bg-red-600 px-4 py-2 font-semibold text-white shadow-sm transition-colors hover:bg-red-700 active:bg-red-800"
      >
        Logout
      </button>
    </div>
  );
}
