import { createFileRoute } from '@tanstack/react-router';
import { requireAdminAuth } from '@/features/auth';
import { RateCardGeneratorPage } from '@/features/rate-card';

export const Route = createFileRoute('/rate-card-generator')({
  beforeLoad: requireAdminAuth,
  component: RateCardGeneratorPage,
});
