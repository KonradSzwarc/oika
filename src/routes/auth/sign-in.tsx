import { revalidateLogic } from '@tanstack/react-form';
import { createFileRoute } from '@tanstack/react-router';
import z from 'zod';
import { Button } from '@/common/components/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/common/components/card';
import { useSignIn } from '@/services/auth/hooks';
import { Form, FormControl, FormItem, FormLabel, FormMessage, InputField, useAppForm } from '@/services/forms';

export const Route = createFileRoute('/auth/sign-in')({
  component: SignInPage,
});

const signInSchema = z.object({
  email: z.email(),
  password: z.string(),
});

function SignInPage() {
  const signIn = useSignIn();
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: signInSchema,
    },
    defaultValues: {
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => signIn(value),
  });

  return (
    <main className="flex min-h-dvh flex-col justify-center">
      <Card className="mx-auto min-w-xs max-w-md">
        <CardHeader>
          <CardTitle>Sign In</CardTitle>
        </CardHeader>
        <CardContent>
          <form.AppForm>
            <Form className="flex flex-col gap-4">
              <form.AppField name="email">
                {() => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <InputField autoComplete="email" />
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
                  <Button type="submit" disabled={!canSubmit || isSubmitting}>
                    {isSubmitting ? 'Signing in...' : 'Sign in'}
                  </Button>
                )}
              </form.Subscribe>
            </Form>
          </form.AppForm>
        </CardContent>
      </Card>
    </main>
  );
}
