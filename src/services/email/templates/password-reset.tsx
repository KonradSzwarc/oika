import { Button, Container, Heading, Text } from '@react-email/components';

import { EmailLayout } from '../components/email-layout';

interface PasswordResetProps {
  url: string;
}

export default function PasswordReset({ url }: PasswordResetProps) {
  return (
    <EmailLayout title="Your password reset link">
      <Container className="mx-auto my-0 px-3 text-center">
        <Heading className="mx-0 my-8 p-0 font-normal text-2xl text-foreground">Reset your password</Heading>
        <Text className="text-foreground text-sm">Click the button below to set a new password for your account.</Text>
        <Button
          className="rounded bg-primary px-5 py-3 text-center font-semibold text-primary-foreground text-xs no-underline"
          href={url}
        >
          Set a new password
        </Button>
      </Container>
    </EmailLayout>
  );
}

PasswordReset.tNamespace = 'emails.password_reset' as const;

PasswordReset.PreviewProps = {
  url: 'https://example.com',
};
