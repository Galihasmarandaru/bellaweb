import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { SpillForm } from '../../../features/spill/components/SpillForm.tsx';
import { useSpillById } from '../../../features/spill/hooks/useSpill.ts';

export const Route = createFileRoute('/admin/spill-link/$id/edit')({
  component: SpillLinkEdit,
});

function SpillLinkEdit() {
  const { id } = Route.useParams();
  const navigate = useNavigate();
  const { data: spill, isLoading, isError } = useSpillById(id);

  const handleClose = () => {
    navigate({ to: '/admin/spill-link' });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] w-full flex-1 items-center justify-center">
        <p className="animate-pulse text-lg text-gray-500">Memuat data...</p>
      </div>
    );
  }

  if (isError || !spill) {
    return (
      <div className="flex min-h-[50vh] w-full flex-1 flex-col items-center justify-center gap-4">
        <p className="text-lg text-red-500">Data spill link tidak ditemukan.</p>
        <button onClick={handleClose} className="text-blue-500 hover:underline">
          Kembali
        </button>
      </div>
    );
  }

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4 mt-6">
      <h2 className="text-2xl font-bold">Edit Spill Link</h2>
      <SpillForm initialData={spill} onSuccess={handleClose} onCancel={handleClose} />
    </div>
  );
}
