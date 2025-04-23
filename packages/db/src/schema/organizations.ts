/**
 * Organizations Schema
 * 
 * Defines the database schema for organizations and related tables
 */
import { pgTable, uuid, text, timestamp, pgEnum, foreignKey, unique, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { profiles } from './profiles';
import { teams } from './teams';

// Define organization role enum
export const organizationRoleEnum = pgEnum('organization_role', ['owner', 'admin', 'member']);

// Define the organizations table
export const organizations = pgTable('organizations', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  logoUrl: text('logo_url'),
  website: text('website'),
  createdById: uuid('created_by_id').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  metadata: jsonb('metadata').default({}),
  isActive: boolean('is_active').notNull().default(true),
});

// Define organization members table
export const organizationMembers = pgTable('organization_members', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  organizationId: uuid('organization_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: organizationRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => {
  return [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: 'organization_members_organization_id_fkey'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: 'organization_members_user_id_fkey'
    }).onDelete('cascade'),
    unique('organization_members_organization_id_user_id_key').on(table.organizationId, table.userId),
  ];
});

// Define organization invitations table
export const organizationInvitations = pgTable('organization_invitations', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  organizationId: uuid('organization_id').notNull(),
  email: text('email').notNull(),
  role: organizationRoleEnum('role').notNull().default('member'),
  token: uuid('token').notNull().defaultRandom(),
  invitedById: uuid('invited_by_id').notNull(),
  invitedAt: timestamp('invited_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  status: text('status').notNull().default('pending'),
  message: text('message'),
}, (table) => {
  return [
    foreignKey({
      columns: [table.organizationId],
      foreignColumns: [organizations.id],
      name: 'organization_invitations_organization_id_fkey'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.invitedById],
      foreignColumns: [profiles.id],
      name: 'organization_invitations_invited_by_id_fkey'
    }).onDelete('set null'),
  ];
});

// Define relations
export const organizationsRelations = relations(organizations, ({ many, one }) => ({
  members: many(organizationMembers),
  invitations: many(organizationInvitations),
  teams: many(teams),
  createdBy: one(profiles, {
    fields: [organizations.createdById],
    references: [profiles.id],
  }),
}));

export const organizationMembersRelations = relations(organizationMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationMembers.organizationId],
    references: [organizations.id],
  }),
  user: one(profiles, {
    fields: [organizationMembers.userId],
    references: [profiles.id],
  }),
}));

export const organizationInvitationsRelations = relations(organizationInvitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [organizationInvitations.organizationId],
    references: [organizations.id],
  }),
  invitedBy: one(profiles, {
    fields: [organizationInvitations.invitedById],
    references: [profiles.id],
  }),
}));
