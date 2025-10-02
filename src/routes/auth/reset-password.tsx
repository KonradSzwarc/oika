import { revalidateLogic } from '@tanstack/react-form';
import { createFileRoute, Link, useNavigate } from '@tanstack/react-router';
import { CircleAlert } from 'lucide-react';
import { useCallback, useEffect } from 'react';
import z from 'zod';
import { Button } from '@/common/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/common/components/card';
import { createModel, type InferModelOutput } from '@/common/utils/models';
import { toast } from '@/common/utils/toasts';
import { useResetPassword } from '@/services/auth/hooks';
import { Password } from '@/services/auth/models';
import { Form, FormControl, FormItem, FormLabel, FormMessage, InputField, useAppForm } from '@/services/forms';

const SearchParams = createModel(
  z.object({
    token: z.string().nonempty().optional(),
    error: z.enum(['INVALID_TOKEN', 'UNKNOWN_ERROR']).optional().catch('UNKNOWN_ERROR'),
  }),
);

export const Route = createFileRoute('/auth/reset-password')({
  component: ResetPasswordPage,
  validateSearch: SearchParams.schema,
});

function ResetPasswordPage() {
  const searchParams = Route.useSearch();
  const resetPassword = useResetPassword();
  const navigate = useNavigate({ from: '/auth/reset-password' });

  const handleSubmit = useCallback(
    async (values: ResetPasswordFormValuesOutput) => {
      await resetPassword(
        {
          newPassword: values.password,
          token: searchParams.token,
        },
        {
          onSuccess: () => navigate({ to: '/auth/sign-in' }),
        },
      );
    },
    [resetPassword, navigate, searchParams.token],
  );

  const hasInvalidState =
    (!searchParams.token && !searchParams.error) ||
    (searchParams.token && searchParams.error) ||
    searchParams.error === 'UNKNOWN_ERROR';

  useEffect(() => {
    if (!hasInvalidState) return;

    setTimeout(() => {
      toast.error('Some error occurred when resetting your password. Try again later.');
      navigate({ to: '/auth' });
    });
  }, [hasInvalidState, navigate]);

  if (hasInvalidState) return null;

  return (
    <div className="w-sm max-w-full">
      {searchParams.error && <InvalidTokenError />}
      {searchParams.token && <ResetPasswordForm onSubmit={handleSubmit} />}
    </div>
  );
}

function InvalidTokenError() {
  return (
    <Card className="w-sm max-w-full text-center">
      <CardHeader className="grid gap-2">
        <CircleAlert className="mx-auto size-12" />
        <CardTitle className="text-center text-xl">Invalid token</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        Your password reset link is invalid or has expired. Click the button below to request a new password reset link.
      </CardContent>
      <CardFooter className="mt-2 grid gap-2">
        <Button asChild className="mx-auto w-fit">
          <Link to="/auth/forgot-password">Go to password reset</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

type ResetPasswordFormValuesOutput = InferModelOutput<typeof ResetPasswordFormValues>;
const ResetPasswordFormValues = createModel(
  z
    .object({
      password: Password.schema,
      passwordConfirmation: Password.schema,
    })
    .check((ctx) => {
      if (ctx.value.password !== ctx.value.passwordConfirmation) {
        ctx.issues.push({
          code: 'custom',
          input: ctx.value.passwordConfirmation,
          path: ['passwordConfirmation'],
          message: 'Wprowadzone hasła nie są identyczne',
        });
      }
    }),
);

function ResetPasswordForm({ onSubmit }: { onSubmit: (values: ResetPasswordFormValuesOutput) => void }) {
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ResetPasswordFormValues.schema,
    },
    defaultValues: {
      password: '',
      passwordConfirmation: '',
    },
    onSubmit: ({ value }) => onSubmit(ResetPasswordFormValues.cast(value)),
  });

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Forgot password</CardTitle>
        <CardDescription>Enter your email to reset your password</CardDescription>
      </CardHeader>
      <CardContent>
        <form.AppForm>
          <Form className="flex flex-col gap-6">
            <form.AppField name="password">
              {() => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
                  <FormControl>
                    <InputField
                      autoFocus
                      type="password"
                      autoComplete="new-password"
                      placeholder="Enter your new password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
            <form.AppField name="passwordConfirmation">
              {() => (
                <FormItem>
                  <FormLabel>Repeat password</FormLabel>
                  <FormControl>
                    <InputField
                      autoFocus
                      type="password"
                      autoComplete="new-password"
                      placeholder="Repeat your new password"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="mt-2" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? 'Resetting...' : 'Reset password'}
                </Button>
              )}
            </form.Subscribe>
          </Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}
