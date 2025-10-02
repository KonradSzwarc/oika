import { createHash } from 'node:crypto';
import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { reactStartCookies } from 'better-auth/react-start';
import { Email } from '@/common/models/email';
import { Seconds } from '@/common/models/seconds';
import { db } from '@/services/db';
import { sendEmail } from '@/services/email';
import { serverEnv } from '@/services/env/server';

export const auth = betterAuth({
  baseURL: serverEnv.VITE_SITE_URL,
  telemetry: { enabled: false },
  database: drizzleAdapter(db, {
    provider: 'pg',
    usePlural: true,
    debugLogs: serverEnv.BETTER_AUTH_DEBUG,
  }),
  plugins: [
    reactStartCookies(), // must be the last one
  ],
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ url, user }) => {
      await sendEmail({
        to: Email.cast(user.email),
        template: 'PasswordReset',
        props: { url },
      });
    },
  },
  emailVerification: {
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ url, user }) => {
      await sendEmail({
        to: Email.cast(user.email),
        template: 'EmailConfirmation',
        props: { url },
      });
    },
  },
  session: {
    cookieCache: {
      enabled: true,
      maxAge: Seconds.fromString('5 min'),
    },
  },
  databaseHooks: {
    user: {
      create: {
        async before(user) {
          if (!user.image) {
            user.image = `https://gravatar.com/avatar/${createHash('md5').update(user.email).digest('hex')}?s=200&d=mp`;
          }

          return { data: user };
        },
      },
    },
  },
  advanced: {
    database: {
      generateId: false,
    },
  },
});
