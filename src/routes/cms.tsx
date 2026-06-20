import { createFileRoute } from '@tanstack/react-router';
import { Cms } from '../features/cms';

export const Route = createFileRoute('/cms')({
  component: CmsRoute,
});

function CmsRoute() {
  return <Cms />;
}
