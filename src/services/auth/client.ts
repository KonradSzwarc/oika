import { createAuthClient } from 'better-auth/react';
import { clientEnv } from '@/services/env/client';

export const authClient = createAuthClient({
  baseURL: clientEnv.VITE_SITE_URL,
});
