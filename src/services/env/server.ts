import dotenvx from '@dotenvx/dotenvx';
import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

dotenvx.config({ convention: 'nextjs', quiet: true });

export const serverEnv = createEnv({
  emptyStringAsUndefined: true,
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  server: {
    VITE_APP_ENV: z.enum(['local', 'staging', 'production']),
    VITE_SITE_URL: z.url(),

    TZ: z.literal('Etc/UTC'),
    DATABASE_URL: z.url(),
    DATABASE_DEBUG: z.stringbool().default(false),
    BETTER_AUTH_SECRET: z.string(),
    BETTER_AUTH_DEBUG: z.stringbool().default(false),
    EMAIL_SERVER_URL: z.url(),
  },
  runtimeEnv: process.env,
});
