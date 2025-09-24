import { boolean, pgTable, text, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  emailVerified: boolean().default(false).notNull(),
  image: text(),
  ...timestamps(),
});

export const sessions = pgTable('sessions', {
  id: text().primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
  expiresAt: timestamp().notNull(),
  token: text().notNull().unique(),
  ipAddress: text(),
  userAgent: text(),
  ...timestamps(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),
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
  id: text().primaryKey(),
  identifier: text().notNull(),
  value: text().notNull(),
  expiresAt: timestamp().notNull(),
  ...timestamps(),
});

function timestamps() {
  return {
    createdAt: timestamp({ mode: 'date' }).defaultNow().notNull(),
    updatedAt: timestamp({ mode: 'date' })
      .defaultNow()
      .notNull()
      .$onUpdate(() => new Date()),
  };
}
