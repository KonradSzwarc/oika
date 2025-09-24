import { redirect } from '@tanstack/react-router';
import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';
import { auth } from './server';

export interface CurrentUser {
  id: string;
  name: string;
  email: string;
  image: string;
}

export const getCurrentUser = createServerFn({ method: 'GET' }).handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });

  if (!session) {
    return null;
  }

  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
  };
});

export const assertIsUnauthenticated = createServerFn().handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });

  if (session) {
    throw redirect({ to: '/app' });
  }

  return { user: null };
});

export const assertIsAuthenticated = createServerFn().handler(async () => {
  const session = await auth.api.getSession({ headers: getRequestHeaders() });

  if (!session) {
    throw redirect({ to: '/auth/sign-in' });
  }

  return {
    user: {
      id: session.user.id,
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  };
});
