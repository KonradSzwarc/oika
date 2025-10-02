import { createFileRoute } from '@tanstack/react-router';
import { sessionBasedRedirect } from '@/services/auth/fn';

export const Route = createFileRoute('/')({
  beforeLoad: () => sessionBasedRedirect(),
});
