import { pgTable, uuid, text, timestamp, pgPolicy } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const profiles = pgTable('profiles', {
  id: uuid('id').primaryKey().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }),
  fullName: text('full_name'),
  avatarUrl: text('avatar_url'),
  email: text('email').notNull(),
  phone: text('phone'),
  address: text('address'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  pgPolicy('Enable insert for authenticated users', { 
    as: 'permissive', 
    for: 'insert', 
    to: ['authenticated'], 
    using: sql`true` 
  }),
  pgPolicy('Users can update own profile', { 
    as: 'permissive', 
    for: 'update', 
    to: ['public'], 
    using: sql`(auth.uid() = id)` 
  }),
  pgPolicy('Users can view own profile', { 
    as: 'permissive', 
    for: 'select', 
    to: ['public'], 
    using: sql`(auth.uid() = id)` 
  }),
]);
