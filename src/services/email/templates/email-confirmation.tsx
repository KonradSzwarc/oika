import { Button, Container, Heading, Text } from '@react-email/components';

import { EmailLayout } from '../components/email-layout';

interface EmailConfirmationProps {
  url: string;
}

export default function EmailConfirmation({ url }: EmailConfirmationProps) {
  return (
    <EmailLayout title="Confirm your email address">
      <Container className="mx-auto my-0 px-3 text-center">
        <Heading className="mx-0 my-8 p-0 font-normal text-2xl text-foreground">Confirm your email</Heading>
        <Text className="text-foreground text-sm">Click the button below to confirm your email address.</Text>
        <Button
          className="rounded bg-primary px-5 py-3 text-center font-semibold text-primary-foreground text-xs no-underline"
          href={url}
        >
          Confirm email
        </Button>
      </Container>
    </EmailLayout>
  );
}
