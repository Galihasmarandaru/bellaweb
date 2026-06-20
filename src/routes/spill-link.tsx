import { createFileRoute } from '@tanstack/react-router';
import { Spill } from '../features/spill';

export const Route = createFileRoute('/spill-link')({
  component: SpillLinkPage,
});

function SpillLinkPage() {
  return <Spill />;
}
