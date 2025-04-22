import { pgTable, uuid, text, timestamp, unique, check, foreignKey } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';
import { clubs } from './clubs';
import { profiles } from './profiles';

export const clubMembers = pgTable('club_members', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  clubId: uuid('club_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: text('role').notNull(),
  joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.clubId],
    foreignColumns: [clubs.id],
    name: 'club_members_club_id_fkey'
  }).onDelete('cascade'),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [profiles.id],
    name: 'club_members_user_id_fkey'
  }).onDelete('cascade'),
  unique('club_members_club_id_user_id_key').on(table.clubId, table.userId),
  check('club_members_role_check', sql`role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'contributor'::text, 'viewer'::text])`),
]);
