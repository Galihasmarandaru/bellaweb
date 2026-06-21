import { createFileRoute, redirect } from '@tanstack/react-router';
import { $isAuthenticated } from '../features/auth/stores/authStore.ts';
import { Cms } from '../features/cms';

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
