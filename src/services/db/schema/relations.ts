import { relations } from 'drizzle-orm';

import * as t from './tables';

export const userRelations = relations(t.users, ({ many }) => ({
  sessions: many(t.sessions),
  accounts: many(t.accounts),
}));

export const sessionRelations = relations(t.sessions, ({ one }) => ({
  user: one(t.users, { fields: [t.sessions.userId], references: [t.users.id] }),
}));

export const accountRelations = relations(t.accounts, ({ one }) => ({
  user: one(t.users, { fields: [t.accounts.userId], references: [t.users.id] }),
}));
