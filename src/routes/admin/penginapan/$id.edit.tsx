import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { AccomodationForm } from '../../../features/accomodation/components/AccomodationForm.tsx';
import { useAccomodationById } from '../../../features/accomodation/hooks/useAccomodation.ts';

export const Route = createFileRoute('/admin/penginapan/$id/edit')({
  component: PenginapanEdit,
});

function PenginapanEdit() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: accomodation, isLoading, isError } = useAccomodationById(id);

  const handleClose = () => {
    navigate({ to: '/admin/penginapan' });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
        <p className="animate-pulse text-lg text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (isError || !accomodation) {
    return (
      <div className="flex min-h-[50vh] w-full flex-1 flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-500">Data penginapan tidak ditemukan.</p>
        <button onClick={handleClose} className="text-blue-500 hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4 mt-6">
      <h2 className="text-2xl font-bold">Edit Penginapan</h2>
      <AccomodationForm initialData={accomodation} onSuccess={handleClose} onCancel={handleClose} />
    </div>
  );
}
