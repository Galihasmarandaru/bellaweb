import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SpillForm } from '../../../features/spill/components/SpillForm.tsx';

export const Route = createFileRoute('/admin/spill-link/create')({
  component: SpillLinkCreate,
});

function SpillLinkCreate() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: '/admin/spill-link' });
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4 mt-6">
      <h2 className="text-2xl font-bold">Tambah Spill Link</h2>
      <SpillForm onSuccess={handleClose} onCancel={handleClose} />
    </div>
  );
}
