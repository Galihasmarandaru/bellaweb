import { createFileRoute } from '@tanstack/react-router';
import { requireAdminAuth } from '@/features/auth';
import { Cms } from '@/features/cms';

export const Route = createFileRoute('/admin')({
  beforeLoad: requireAdminAuth,
  component: AdminRoute,
});

function AdminRoute() {
  return <Cms />;
}
