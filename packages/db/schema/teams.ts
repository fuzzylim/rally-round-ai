import { pgTable, serial, varchar, text, timestamp, pgEnum, integer, uuid, boolean, unique, check } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { sql } from 'drizzle-orm';

// Define the teams table
export const teams = pgTable('teams', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  sport: varchar('sport', { length: 100 }).notNull(),
  ageGroup: varchar('age_group', { length: 50 }).notNull(),
  logoUrl: text('logo_url'),
  organizationId: integer('organization_id'),
  createdById: uuid('created_by_id').notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define team member roles enum
export const teamRoleEnum = pgEnum('team_role', ['owner', 'admin', 'coach', 'manager', 'member']);

// Define team members table
export const teamMembers = pgTable('team_members', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id).notNull(),
  userId: uuid('user_id').notNull(),
  role: teamRoleEnum('role').notNull().default('member'),
  joinedAt: timestamp('joined_at').notNull().defaultNow(),
  isActive: boolean('is_active').notNull().default(true),
}, (table) => {
  return [
    unique('team_members_team_id_user_id_key').on(table.teamId, table.userId),
  ];
});

// Define team invitations table
export const teamInvitations = pgTable('team_invitations', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id).notNull(),
  email: varchar('email', { length: 255 }).notNull(),
  role: teamRoleEnum('role').notNull().default('member'),
  token: uuid('token').notNull().defaultRandom(),
  invitedById: uuid('invited_by_id').notNull(),
  invitedAt: timestamp('invited_at').notNull().defaultNow(),
  expiresAt: timestamp('expires_at').notNull(),
  acceptedAt: timestamp('accepted_at'),
  status: pgEnum('invitation_status', ['pending', 'accepted', 'declined', 'expired'])
    .notNull()
    .default('pending'),
});

// Define team activity log table
export const teamActivities = pgTable('team_activities', {
  id: serial('id').primaryKey(),
  teamId: integer('team_id').references(() => teams.id).notNull(),
  userId: uuid('user_id'),
  activityType: varchar('activity_type', { length: 100 }).notNull(),
  description: text('description').notNull(),
  metadata: text('metadata'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
});

// Define relations
export const teamsRelations = relations(teams, ({ many }) => ({
  members: many(teamMembers),
  invitations: many(teamInvitations),
  activities: many(teamActivities),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  team: one(teams, {
    fields: [teamMembers.teamId],
    references: [teams.id],
  }),
}));

export const teamInvitationsRelations = relations(teamInvitations, ({ one }) => ({
  team: one(teams, {
    fields: [teamInvitations.teamId],
    references: [teams.id],
  }),
}));

export const teamActivitiesRelations = relations(teamActivities, ({ one }) => ({
  team: one(teams, {
    fields: [teamActivities.teamId],
    references: [teams.id],
  }),
}));
