import { drizzle } from 'drizzle-orm/node-postgres';
import pg from 'pg';
import { serverEnv } from '@/services/env/server';
import * as relations from './schema/relations';
import * as tables from './schema/tables';

const schema = { ...tables, ...relations };

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

export const db = drizzle(pool, { schema, casing: 'snake_case', logger: serverEnv.DATABASE_DEBUG });
