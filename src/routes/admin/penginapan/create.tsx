import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AccomodationForm } from '../../../features/accomodation/components/AccomodationForm.tsx';

export const Route = createFileRoute('/admin/penginapan/create')({
  component: PenginapanCreate,
});

function PenginapanCreate() {
  const navigate = useNavigate();

  const handleClose = () => {
    navigate({ to: '/admin/penginapan' });
  };

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4 mt-6">
      <h2 className="text-2xl font-bold">Tambah Penginapan</h2>
      <AccomodationForm onSuccess={handleClose} onCancel={handleClose} />
    </div>
  );
}
