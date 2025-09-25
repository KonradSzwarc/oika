import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { Button } from '@/common/components/button';
import { useSignOut } from '@/services/auth/hooks';
import { currentUserQueryOptions } from '@/services/auth/queries';

export const Route = createFileRoute('/app/')({
  component: RouteComponent,
});

function RouteComponent() {
  const signOut = useSignOut();
  const { data: currentUser } = useSuspenseQuery(currentUserQueryOptions());

  return (
    <div>
      <h1>Hello {currentUser?.name}</h1>
      <Button onClick={() => signOut()}>Sign Out</Button>
    </div>
  );
}
