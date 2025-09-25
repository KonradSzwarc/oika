import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router';
import { assertIsUnauthenticated } from '@/services/auth/fn';
import { currentUserQueryOptions } from '@/services/auth/queries';

export const Route = createFileRoute('/auth')({
  beforeLoad: () => assertIsUnauthenticated(),
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(currentUserQueryOptions());
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOptions());

  if (currentUser) {
    return <Navigate to="/app" />;
  }

  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center">
      <div className="max-h-full max-w-full px-5">
        <div className="h-5" />
        <Outlet />
        <div className="h-5" />
      </div>
    </main>
  );
}
