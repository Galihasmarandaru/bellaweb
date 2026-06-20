import { createFileRoute, redirect } from '@tanstack/react-router';
import { Cms } from '../features/cms';
import { $isAuthenticated } from '../features/auth/stores/authStore.ts';

export const Route = createFileRoute('/admin')({
  beforeLoad: () => {
    if (!$isAuthenticated.get()) {
      throw redirect({
        to: '/login',
      });
    }
  },
  component: AdminRoute,
});

function AdminRoute() {
  return <Cms />;
}
