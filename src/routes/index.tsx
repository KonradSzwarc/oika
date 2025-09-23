import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { usersQueryOptions } from '@/users';

export const Route = createFileRoute('/')({
  loader: async ({ context }) => {
    await context.queryClient.ensureQueryData(usersQueryOptions());
  },
  component: HomePage,
});

function HomePage() {
  const usersQuery = useSuspenseQuery(usersQueryOptions());

  return (
    <div className="flex gap-2 p-2">
      <ul className="space-y-2">
        {usersQuery.data.map((user) => {
          return (
            <li key={user.id} className="whitespace-nowrap bg-gray-100 p-2">
              <div>
                {user.name} ({user.email})
              </div>
            </li>
          );
        })}
      </ul>
      <hr />
    </div>
  );
}
