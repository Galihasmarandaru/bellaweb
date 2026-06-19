import { createFileRoute } from '@tanstack/react-router';
import { Accomodation } from '../features/accomodation';

export const Route = createFileRoute('/accomodation')({
  component: AccomodationRoute,
});

function AccomodationRoute() {
  return <Accomodation />;
}
