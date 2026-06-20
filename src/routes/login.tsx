import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../features/auth/index.ts';
import { $isAuthenticated } from '../features/auth/stores/authStore.ts';

export const Route = createFileRoute('/login')({
  beforeLoad: () => {
    if ($isAuthenticated.get()) {
      throw redirect({
        to: '/admin',
      });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </div>
  );
}
