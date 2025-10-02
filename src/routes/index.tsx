import { createFileRoute } from '@tanstack/react-router';
import { sessionBasedRedirect } from '@/services/auth/fn';
import { validatePasswordCookie } from '@/services/password-cookie/fn';

export const Route = createFileRoute('/')({
  beforeLoad: () => validatePasswordCookie(),
  loader: ({ context }) => {
    if (context.hasPasswordCookie) {
      return sessionBasedRedirect();
    }
  },
  component: HomePage,
});

function HomePage() {
  return <div>Hello World!</div>;
}
