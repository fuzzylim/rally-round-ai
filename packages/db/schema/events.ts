import { pgTable, serial, varchar, text, timestamp, pgEnum, integer, uuid, boolean } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { teams } from './teams';

// Define event status enum
export const eventStatusEnum = pgEnum('event_status', ['draft', 'scheduled', 'active', 'completed', 'cancelled']);

// Define events table
export const events = pgTable('events', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  location: text('location'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: eventStatusEnum('status').notNull().default('draft'),
  teamId: integer('team_id').references(() => teams.id),
  createdById: uuid('created_by_id').notNull(),
  isPublic: boolean('is_public').notNull().default(false),
  maxParticipants: integer('max_participants'),
  registrationDeadline: timestamp('registration_deadline'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Define event participants table
export const eventParticipants = pgTable('event_participants', {
  id: serial('id').primaryKey(),
  eventId: integer('event_id').references(() => events.id).notNull(),
  userId: uuid('user_id').notNull(),
  registeredAt: timestamp('registered_at').notNull().defaultNow(),
  status: pgEnum('participant_status', ['registered', 'confirmed', 'cancelled', 'attended']).notNull().default('registered'),
  notes: text('notes'),
});

// Define relations
export const eventsRelations = relations(events, ({ one, many }) => ({
  team: one(teams, {
    fields: [events.teamId],
    references: [teams.id],
  }),
  participants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({ one }) => ({
  event: one(events, {
    fields: [eventParticipants.eventId],
    references: [events.id],
  }),
}));
