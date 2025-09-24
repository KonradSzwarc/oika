import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { authClient } from './client';
import { currentUserQueryOptions } from './queries';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useCallback(
    async (values: Parameters<typeof authClient.signIn.email>[0]) => {
      await authClient.signIn.email(values, {
        onSuccess: () => queryClient.invalidateQueries(currentUserQueryOptions()),
      });
    },
    [queryClient],
  );
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useCallback(async () => {
    await authClient.signOut();
    await queryClient.invalidateQueries(currentUserQueryOptions());
  }, [queryClient]);
}

export function useSignUp() {
  return useCallback(async (values: Parameters<typeof authClient.signUp.email>[0]) => {
    await authClient.signUp.email({ callbackURL: '/app', ...values });
  }, []);
}
