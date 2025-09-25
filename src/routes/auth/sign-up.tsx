import { revalidateLogic } from '@tanstack/react-form';
import { createFileRoute, Link } from '@tanstack/react-router';
import { Mail } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useCountdown } from 'rooks';
import z from 'zod';
import { Button } from '@/common/components/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/common/components/card';
import { Email } from '@/common/models/email';
import { createModel, type InferModelOutput } from '@/common/utils/models';
import { useResendVerificationEmail, useSignUp } from '@/services/auth/hooks';
import { Password } from '@/services/auth/models';
import { Form, FormControl, FormItem, FormLabel, FormMessage, InputField, useAppForm } from '@/services/forms';

export const Route = createFileRoute('/auth/sign-up')({
  component: SignUpPage,
});

type SignUpFormValuesOutput = InferModelOutput<typeof SignUpFormValues>;
const SignUpFormValues = createModel(
  z.object({
    name: z.string().min(1),
    email: Email.schema,
    password: Password.schema,
  }),
);

function SignUpPage() {
  const [email, setEmail] = useState<Email | null>(null);
  const signUp = useSignUp();

  const handleSubmit = useCallback(
    async (values: SignUpFormValuesOutput) => {
      await signUp(values, {
        onSuccess: () => {
          setEmail(values.email);
        },
      });
    },
    [signUp],
  );

  if (email) {
    return <VerifyEmailCard email={email} />;
  }

  return (
    <div className="grid w-sm max-w-full gap-4">
      <Card className="pb-8">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Welcome in Oika!</CardTitle>
          <CardDescription>Sign up to start your journey</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm onSubmit={handleSubmit} />
        </CardContent>
      </Card>
      <div className="text-center text-sm">
        Already have an account?{' '}
        <Link to="/auth/sign-in" className="underline underline-offset-4">
          Sign in
        </Link>
      </div>
    </div>
  );
}

function SignUpForm({ onSubmit }: { onSubmit: (values: SignUpFormValuesOutput) => void }) {
  const form = useAppForm({
    validationLogic: revalidateLogic(),
    validators: {
      onDynamic: SignUpFormValues.schema,
    },
    defaultValues: {
      name: '',
      email: '',
      password: '',
    },
    onSubmit: ({ value }) => onSubmit(SignUpFormValues.cast(value)),
  });

  return (
    <form.AppForm>
      <Form className="flex flex-col gap-6">
        <form.AppField name="name">
          {() => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <InputField autoComplete="name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        </form.AppField>
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
            <Button type="submit" className="mt-2" disabled={!canSubmit || isSubmitting}>
              {isSubmitting ? 'Signing up...' : 'Sign up'}
            </Button>
          )}
        </form.Subscribe>
      </Form>
    </form.AppForm>
  );
}

function VerifyEmailCard({ email }: { email: Email }) {
  const [endTime, setEndTime] = useState(() => new Date(Date.now() + 1000 * 30));
  const resendVerificationEmail = useResendVerificationEmail();
  const count = useCountdown(endTime, { interval: 1000 });

  const handleClick = useCallback(() => {
    resendVerificationEmail({ email }, { onRequest: () => setEndTime(new Date(Date.now() + 1000 * 30)) });
  }, [resendVerificationEmail, email]);

  const isRunning = count > 0;

  return (
    <Card className="w-sm max-w-full text-center">
      <CardHeader className="grid gap-2">
        <Mail className="mx-auto size-12" />
        <CardTitle className="text-center text-xl">Check your email</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-2">
        <p>We've sent email verification link to</p>
        <strong>{email}</strong>
        <p>Please check your inbox and click the link to activate your account.</p>
      </CardContent>
      <CardFooter className="mt-2 grid gap-2">
        <p className="text-sm">You didn't receive the link?</p>
        <Button className="mx-auto w-fit" disabled={isRunning} onClick={handleClick}>
          Resend email{isRunning && ` (${count}s)`}
        </Button>
      </CardFooter>
    </Card>
  );
}
