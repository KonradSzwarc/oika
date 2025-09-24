import { Body, Head, Html, Preview, Tailwind } from '@react-email/components';
import type { PropsWithChildren } from 'react';

export interface EmailLayoutProps {
  /** Title of the email. */
  title: string;

  /** Preview text displayed under email title. Keep it under 90 characters. */
  preview?: string;
}

export function EmailLayout({ children, title, preview }: PropsWithChildren<EmailLayoutProps>) {
  return (
    <Html lang="en">
      <Head>
        <title>{title}</title>
      </Head>
      <Tailwind
        config={{
          theme: {
            extend: {
              colors: {
                background: '#ffffff',
                foreground: '#333333',
                card: '#ffffff',
                'card-foreground': '#333333',
                popover: '#ffffff',
                'popover-foreground': '#333333',
                primary: '#3b82f6',
                'primary-foreground': '#ffffff',
                secondary: '#f3f4f6',
                'secondary-foreground': '#4b5563',
                muted: '#f9fafb',
                'muted-foreground': '#6b7280',
                accent: '#e0f2fe',
                'accent-foreground': '#1e3a8a',
                destructive: '#ef4444',
                'destructive-foreground': '#ffffff',
                border: '#e5e7eb',
                input: '#e5e7eb',
                ring: '#3b82f6',
              },
            },
          },
        }}
      >
        <Body className="m-auto bg-white px-2 font-sans">
          {preview && <Preview>{preview}</Preview>}
          {children}
        </Body>
      </Tailwind>
    </Html>
  );
}
