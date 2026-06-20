import { createFileRoute } from '@tanstack/react-router';
import { SpillList } from '../../../features/spill';

export const Route = createFileRoute('/admin/spill-link/')({
  component: AdminSpillLinkPage,
});

function AdminSpillLinkPage() {
  return <SpillList />;
}
