import type { Config } from 'drizzle-kit';

import { serverEnv } from '@/services/env/server';

export default {
  schema: ['./src/services/db/schema/tables.ts', './src/services/db/schema/relations.ts'],
  out: './src/services/db/migrations',
  dialect: 'postgresql',
  casing: 'snake_case',
  verbose: serverEnv.DATABASE_DEBUG,
  dbCredentials: {
    url: serverEnv.DATABASE_URL,
  },
  migrations: {
    prefix: 'unix',
  },
} satisfies Config;
