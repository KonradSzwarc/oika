import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';
import { toast } from '@/common/utils/toasts';
import { authClient } from './client';
import { currentUserQueryOptions } from './queries';

export function useSignIn() {
  const queryClient = useQueryClient();

  return useCallback(
    async (
      values: Parameters<typeof authClient.signIn.email>[0],
      options?: Parameters<typeof authClient.signIn.email>[1],
    ) => {
      await authClient.signIn.email(values, {
        ...options,
        onSuccess: async (ctx) => {
          options?.onSuccess?.(ctx);
          await queryClient.invalidateQueries(currentUserQueryOptions());
        },
        onError: (ex) => {
          toast.error(ex.error.message);
          options?.onError?.(ex);
        },
      });
    },
    [queryClient],
  );
}

export function useSignOut() {
  const queryClient = useQueryClient();

  return useCallback(
    async (options?: Parameters<typeof authClient.signOut>[0]) => {
      try {
        await authClient.signOut(options);
      } catch (ex) {
        console.error(ex);
        toast.error('Failed to sign out');
      }
      await queryClient.invalidateQueries(currentUserQueryOptions());
    },
    [queryClient],
  );
}

export function useSignUp() {
  return useCallback(
    async (
      values: Parameters<typeof authClient.signUp.email>[0],
      options?: Parameters<typeof authClient.signUp.email>[1],
    ) => {
      await authClient.signUp.email(
        { callbackURL: '/app', ...values },
        {
          ...options,
          onError: (ex) => {
            toast.error(ex.error.message);
            options?.onError?.(ex);
          },
        },
      );
    },
    [],
  );
}

export function useResendVerificationEmail() {
  return useCallback(
    async (
      values: Parameters<typeof authClient.sendVerificationEmail>[0],
      options?: Parameters<typeof authClient.sendVerificationEmail>[1],
    ) => {
      await authClient.sendVerificationEmail(
        { callbackURL: '/app', ...values },
        {
          ...options,
          onError: (ex) => {
            toast.error(ex.error.message);
            options?.onError?.(ex);
          },
        },
      );
    },
    [],
  );
}

export function useForgotPassword() {
  return useCallback(
    async (
      values: Parameters<typeof authClient.requestPasswordReset>[0],
      options?: Parameters<typeof authClient.requestPasswordReset>[1],
    ) => {
      await authClient.requestPasswordReset({ redirectTo: '/auth/reset-password', ...values }, options);
    },
    [],
  );
}

export function useResetPassword() {
  return useCallback(
    async (
      values: Parameters<typeof authClient.resetPassword>[0],
      options?: Parameters<typeof authClient.resetPassword>[1],
    ) => {
      await authClient.resetPassword(values, {
        ...options,
        onSuccess: async (ctx) => {
          toast.success('Password reset successfully. You can use it to sign in.');
          options?.onSuccess?.(ctx);
        },
        onError: (ex) => {
          toast.error(ex.error.message);
          options?.onError?.(ex);
        },
      });
    },
    [],
  );
}
