import { sql } from 'drizzle-orm';
import type { ReferenceConfig } from 'drizzle-orm/pg-core';
import { boolean, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core';
import type { Uuid } from '@/common/models/uuid';

export const users = pgTable('users', {
  id: primaryKeyUuid(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  ...timestamps(),
});

export const sessions = pgTable('sessions', {
  id: primaryKeyUuid(),
  userId: uuidRef(() => users.id).notNull(),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  ...timestamps(),
});

export const accounts = pgTable('accounts', {
  id: primaryKeyUuid(),
  userId: uuidRef(() => users.id).notNull(),
  accountId: text().notNull(),
  providerId: text().notNull(),
  accessToken: text(),
  refreshToken: text(),
  idToken: text('id_token'),
  accessTokenExpiresAt: timestamp(),
  refreshTokenExpiresAt: timestamp(),
  scope: text(),
  password: text(),
  ...timestamps(),
});

export const verifications = pgTable('verifications', {
  id: primaryKeyUuid(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  ...timestamps(),
});

function primaryKeyUuid() {
  return uuid().primaryKey().default(sql`uuidv7()`).$type<Uuid>();
}

function uuidRef(ref: ReferenceConfig['ref'], actions?: ReferenceConfig['actions']) {
  return uuid()
    .references(ref, { onDelete: 'cascade', ...actions })
    .$type<Uuid>();
}

function timestamps() {
  return {
    createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  };
}
