import { pgTable, uuid, text, timestamp, jsonb, foreignKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { profiles } from './profiles';

export const clubs = pgTable('clubs', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  location: text('location'),
  logoUrl: text('logo_url'),
  website: text('website'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  createdBy: uuid('created_by'),
  sportTypes: text('sport_types').array().default(['golf']),
  socialMedia: jsonb('social_media').default({}),
}, (table) => [
  foreignKey({
    columns: [table.createdBy],
    foreignColumns: [profiles.id],
    name: 'clubs_created_by_fkey'
  }).onDelete('set null'),
]);
