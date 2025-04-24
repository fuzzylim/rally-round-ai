import { pgTable, uuid, text, timestamp, pgEnum, foreignKey, unique, jsonb, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';
import { profiles } from './profiles';
import { organizations } from './organizations';

// Define team role enum
export const teamRoleEnum = pgEnum('team_role', ['owner', 'admin', 'coach', 'manager', 'member']);

// Define invitation status enum
export const invitationStatusEnum = pgEnum('invitation_status', ['pending', 'accepted', 'declined', 'expired']);

// Define the teams table
export const teams = pgTable('organization_teams', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  name: text('name').notNull(),
  description: text('description'),
  sport: text('sport').notNull(),
  ageGroup: text('age_group').notNull(),
  logoUrl: text('logo_url'),
  organizationId: uuid('organization_id').notNull().references(() => organizations.id),
  createdById: uuid('created_by').references(() => profiles.id),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  metadata: jsonb('metadata').default({}),
});

// Define team members table
export const teamMembers = pgTable('team_members', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  teamId: uuid('team_id').notNull(),
  userId: uuid('user_id').notNull(),
  role: teamRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => {
  return [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'team_members_team_id_fkey'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: 'team_members_user_id_fkey'
    }).onDelete('cascade'),
    unique('team_members_team_id_user_id_key').on(table.teamId, table.userId),
  ];
});

// Define team invitations table
export const teamInvitations = pgTable('team_invitations', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  teamId: uuid('team_id').notNull(),
  email: text('email').notNull(),
  role: teamRoleEnum('role').notNull().default('member'),
  token: uuid('token').notNull().defaultRandom(),
  invitedById: uuid('invited_by_id').notNull(),
  invitedAt: timestamp('invited_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true, mode: 'string' }).notNull(),
  acceptedAt: timestamp('accepted_at', { withTimezone: true, mode: 'string' }),
  status: invitationStatusEnum('status').notNull().default('pending'),
  message: text('message'),
}, (table) => {
  return [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'team_invitations_team_id_fkey'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.invitedById],
      foreignColumns: [profiles.id],
      name: 'team_invitations_invited_by_id_fkey'
    }).onDelete('set null'),
  ];
});

// Define team activity log table
export const teamActivities = pgTable('team_activities', {
  id: uuid('id').defaultRandom().primaryKey().notNull(),
  teamId: uuid('team_id').notNull(),
  userId: uuid('user_id'),
  activityType: text('activity_type').notNull(),
  description: text('description').notNull(),
  metadata: jsonb('metadata').default({}),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
  return [
    foreignKey({
      columns: [table.teamId],
      foreignColumns: [teams.id],
      name: 'team_activities_team_id_fkey'
    }).onDelete('cascade'),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [profiles.id],
      name: 'team_activities_user_id_fkey'
    }).onDelete('set null'),
  ];
});

// Define relations
export const teamsRelations = relations(teams, ({ many, one }) => ({
  members: many(teamMembers),
  invitations: many(teamInvitations),
  activities: many(teamActivities),
  organization: one(organizations, {
    fields: [teams.organizationId],
    references: [organizations.id],
  }),
  createdBy: one(profiles, {
    fields: [teams.createdById],
    references: [profiles.id],
  }),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
  user: one(profiles, {
    fields: [teamMembers.userId],
    references: [profiles.id],
  }),
}));

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
  invitedBy: one(profiles, {
    fields: [teamInvitations.invitedById],
    references: [profiles.id],
  }),
}));

export const teamActivitiesRelations = relations(teamActivities, ({ one }) => ({
  team: one(teams, {
    fields: [teamActivities.teamId],
    references: [teams.id],
  }),
  user: one(profiles, {
    fields: [teamActivities.userId],
    references: [profiles.id],
  }),
}));
