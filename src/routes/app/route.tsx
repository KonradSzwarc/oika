import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { assertIsAuthenticated } from '@/services/auth/fn';
import { currentUserQueryOptions } from '@/services/auth/queries';

export const Route = createFileRoute('/app')({
  beforeLoad: () => assertIsAuthenticated(),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(currentUserQueryOptions());
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOptions());

  if (!currentUser) {
    return <Navigate to="/auth/sign-in" />;
  }

  return <Outlet />;
}
