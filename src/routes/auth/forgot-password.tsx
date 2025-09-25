import { revalidateLogic } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import type { InferModelOutput } from '@uni-ts/model/safe';
import { Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import z from 'zod';
import { Button } from '@/common/components/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/common/components/card';
import { Email } from '@/common/models/email';
import { createModel } from '@/common/utils/models';
import { useForgotPassword } from '@/services/auth/hooks';
import { Form, FormControl, FormItem, FormLabel, FormMessage, InputField, useAppForm } from '@/services/forms';

export const Route = createFileRoute('/auth/forgot-password')({
  component: RouteComponent,
});

type ForgotPasswordFormValuesOutput = InferModelOutput<typeof ForgotPasswordFormValues>;
const ForgotPasswordFormValues = createModel(
  z.object({
    email: Email.schema,
  }),
);

function RouteComponent() {
  const forgotPassword = useForgotPassword();
  const [email, setEmail] = useState<Email | null>(null);

  const handleSubmit = useCallback(
    async (values: ForgotPasswordFormValuesOutput) => {
      await forgotPassword(values, {
        onSuccess: () => {
          setEmail(values.email);
        },
      });
    },
    [forgotPassword],
  );

  return (
    <div className="grid w-sm max-w-full gap-4">
      {email ? <EmailSentCard email={email} /> : <ForgotPasswordForm onSubmit={handleSubmit} />}
      <div className="text-center text-sm">
        <Link to="/auth/sign-in" className="underline underline-offset-4">
          Back to sign in
        </Link>
      </div>
    </div>
  );
}

function ForgotPasswordForm({ onSubmit }: { onSubmit: (values: ForgotPasswordFormValuesOutput) => void }) {
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: ForgotPasswordFormValues.schema,
    },
    defaultValues: {
      email: '',
    },
    onSubmit: ({ value }) => onSubmit(ForgotPasswordFormValues.cast(value)),
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
            <form.AppField name="email">
              {() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputField
                      autoFocus
                      inputMode="email"
                      autoComplete="email"
                      placeholder="Enter your email address"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            </form.AppField>
            <form.Subscribe selector={(state) => [state.canSubmit, state.isSubmitting]}>
              {([canSubmit, isSubmitting]) => (
                <Button type="submit" className="mt-2" disabled={!canSubmit || isSubmitting}>
                  {isSubmitting ? 'Sending...' : 'Send password reset link'}
                </Button>
              )}
            </form.Subscribe>
          </Form>
        </form.AppForm>
      </CardContent>
    </Card>
  );
}

function EmailSentCard({ email }: { email: Email }) {
  return (
    <Card className="text-center">
      <CardHeader className="grid gap-2">
        <Mail className="mx-auto size-12" />
        <CardTitle className="text-center text-xl">Check your email</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="flex flex-col gap-1.5">
          <span>If this email exists in our system, we sent password reset link to</span>
          <strong>{email}</strong>
          <span>Please check your email and click the link to continue.</span>
        </p>
      </CardContent>
    </Card>
  );
}
