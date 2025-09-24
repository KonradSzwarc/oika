import { createEnv } from '@t3-oss/env-core';
import { z } from 'zod';

export const clientEnv = createEnv({
  clientPrefix: 'VITE_',
  emptyStringAsUndefined: true,
  shared: {
    NODE_ENV: z.enum(['development', 'production', 'test']),
  },
  client: {
    VITE_APP_ENV: z.enum(['local', 'staging', 'production']),
    VITE_SITE_URL: z.url(),
  },
  runtimeEnv: {
    NODE_ENV: process.env.NODE_ENV,
    VITE_APP_ENV: import.meta.env.VITE_APP_ENV,
    VITE_SITE_URL: import.meta.env.VITE_SITE_URL,
  },
});
