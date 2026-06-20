import { createFileRoute } from '@tanstack/react-router';
import { AccomodationList } from '../../../features/accomodation/components/AccomodationList.tsx';

export const Route = createFileRoute('/admin/penginapan/')({
  component: PenginapanIndex,
});

function PenginapanIndex() {
  return (
    <div className="flex w-full max-w-5xl flex-col gap-4">
      <AccomodationList />
    </div>
  );
}
