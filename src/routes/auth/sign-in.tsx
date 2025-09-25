import { revalidateLogic } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import z from 'zod';
import { Button } from '@/common/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/card';
import { Email } from '@/common/models/email';
import { createModel } from '@/common/utils/models';
import { useSignIn } from '@/services/auth/hooks';
import { Password } from '@/services/auth/models';
import { Form, FormControl, FormItem, FormLabel, FormMessage, InputField, useAppForm } from '@/services/forms';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
});

const SignInFormValues = createModel(
  z.object({
    email: Email.schema,
    password: Password.schema,
  }),
);

function SignInPage() {
  const signIn = useSignIn();
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SignInFormValues.schema,
    },
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => signIn(SignInFormValues.cast(value)),
  });

  return (
    <div className="grid w-sm max-w-full gap-4">
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome back in Oika!</CardTitle>
          <CardDescription>Sign in to continue your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <Form className="flex flex-col gap-6">
              <form.AppField name="email">
                {() => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputField inputMode="email" autoComplete="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              </form.AppField>
              <form.AppField name="password">
                {() => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <InputField type="password" autoComplete="new-password" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              </form.AppField>
              <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
                {([canSubmit, isSubmitting]) => (
                  <Button type="submit" className="mt-2" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                )}
              </form.Subscribe>
            </Form>
          </form.AppForm>
          <div className="mt-6 grid gap-4">
            <div className="text-center text-sm">
              Forgot your password?{' '}
              <Link to="/auth/forgot-password" className="underline underline-offset-4">
                Create a new one
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Don&apos;t have an account?{' '}
        <Link to="/auth/sign-up" className="underline underline-offset-4">
          Sign up
        </Link>
      </div>
    </div>
  );
}
