import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/admin/spill-link')({
  component: SpillLinkPlaceholder,
});

function SpillLinkPlaceholder() {
  return (
    <div className="w-full max-w-5xl flex min-h-[50vh] items-center justify-center">
      <p className="text-gray-500 text-lg">Fitur Kelola Spill Link akan segera hadir!</p>
    </div>
  );
}
