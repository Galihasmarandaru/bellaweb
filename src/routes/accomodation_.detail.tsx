import { AccomodationDetail } from '@/features/accomodation';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/accomodation_/detail')({
  component: AccomodationDetailRoute,
});

function AccomodationDetailRoute() {
  return <AccomodationDetail />
}
