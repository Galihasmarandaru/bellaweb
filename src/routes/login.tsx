import { createFileRoute } from '@tanstack/react-router';
import { LoginForm, redirectIfAuthenticated } from '@/features/auth';

export const Route = createFileRoute('/login')({
  beforeLoad: redirectIfAuthenticated,
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <LoginForm />
    </div>
  );
}
