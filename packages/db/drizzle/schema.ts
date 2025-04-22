import { pgTable, foreignKey, uuid, text, timestamp, jsonb, unique, check, numeric, boolean, integer, date, pgPolicy } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"



export const clubs = pgTable("clubs", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	name: text().notNull(),
	description: text(),
	location: text(),
	logoUrl: text("logo_url"),
	website: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
	sportTypes: text("sport_types").array().default(["RAY['golf'::tex"]),
	socialMedia: jsonb("social_media").default({}),
}, (table) => [
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "clubs_created_by_fkey"
		}).onDelete("set null"),
]);

export const clubMembers = pgTable("club_members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id").notNull(),
	userId: uuid("user_id").notNull(),
	role: text().notNull(),
	joinedAt: timestamp("joined_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "club_members_club_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "club_members_user_id_fkey"
		}).onDelete("cascade"),
	unique("club_members_club_id_user_id_key").on(table.clubId, table.userId),
	check("club_members_role_check", sql`role = ANY (ARRAY['owner'::text, 'admin'::text, 'member'::text, 'contributor'::text, 'viewer'::text])`),
]);

export const campaigns = pgTable("campaigns", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id").notNull(),
	title: text().notNull(),
	description: text(),
	goal: numeric({ precision: 10, scale:  2 }).notNull(),
	amountRaised: numeric("amount_raised", { precision: 10, scale:  2 }).default('0').notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }).notNull(),
	coverImageUrl: text("cover_image_url"),
	isActive: boolean("is_active").default(true).notNull(),
	isPrivate: boolean("is_private").default(false).notNull(),
	accessCode: text("access_code"),
	category: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "campaigns_club_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "campaigns_created_by_fkey"
		}).onDelete("set null"),
]);

export const donations = pgTable("donations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	campaignId: uuid("campaign_id").notNull(),
	userId: uuid("user_id"),
	amount: numeric({ precision: 10, scale:  2 }).notNull(),
	name: text(),
	email: text(),
	message: text(),
	isAnonymous: boolean("is_anonymous").default(false).notNull(),
	reference: text().notNull(),
	receiptSent: boolean("receipt_sent").default(false).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.campaignId],
			foreignColumns: [campaigns.id],
			name: "donations_campaign_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "donations_user_id_fkey"
		}).onDelete("set null"),
]);

export const competitions = pgTable("competitions", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id").notNull(),
	name: text().notNull(),
	description: text(),
	type: text().notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }).notNull(),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }).notNull(),
	location: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
	sportType: text("sport_type").default('golf'),
	format: text().default('stroke_play'),
	rules: jsonb().default({}),
	entryFee: numeric("entry_fee").default('0'),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "competitions_club_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "competitions_created_by_fkey"
		}).onDelete("set null"),
	check("competitions_type_check", sql`type = ANY (ARRAY['singles'::text, 'teams'::text, 'mixed'::text])`),
]);

export const competitionPlayers = pgTable("competition_players", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	competitionId: uuid("competition_id").notNull(),
	memberId: uuid("member_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "competition_players_competition_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "competition_players_player_id_fkey"
		}).onDelete("cascade"),
	unique("competition_players_competition_id_player_id_key").on(table.competitionId, table.memberId),
]);

export const teams = pgTable("teams", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	competitionId: uuid("competition_id").notNull(),
	name: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "teams_competition_id_fkey"
		}).onDelete("cascade"),
]);

export const teamPlayers = pgTable("team_players", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	teamId: uuid("team_id").notNull(),
	memberId: uuid("member_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "team_players_player_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "team_players_team_id_fkey"
		}).onDelete("cascade"),
	unique("team_players_team_id_player_id_key").on(table.teamId, table.memberId),
]);

export const scores = pgTable("scores", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	competitionId: uuid("competition_id").notNull(),
	memberId: uuid("member_id"),
	teamId: uuid("team_id"),
	day: text(),
	holeScores: jsonb("hole_scores"),
	totalScore: integer("total_score"),
	date: timestamp({ withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.competitionId],
			foreignColumns: [competitions.id],
			name: "scores_competition_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "scores_player_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.teamId],
			foreignColumns: [teams.id],
			name: "scores_team_id_fkey"
		}).onDelete("cascade"),
	check("scores_check", sql`((member_id IS NULL) AND (team_id IS NOT NULL)) OR ((member_id IS NOT NULL) AND (team_id IS NULL))`),
]);

export const invitations = pgTable("invitations", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id").notNull(),
	email: text(),
	code: text().notNull(),
	role: text().default('member').notNull(),
	message: text(),
	status: text().default('pending').notNull(),
	expiresAt: timestamp("expires_at", { withTimezone: true, mode: 'string' }).default(sql`(now() + '7 days'::interval)`).notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	createdBy: uuid("created_by"),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "invitations_club_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.createdBy],
			foreignColumns: [users.id],
			name: "invitations_created_by_fkey"
		}).onDelete("set null"),
	check("invitations_status_check", sql`status = ANY (ARRAY['pending'::text, 'accepted'::text, 'expired'::text])`),
]);

export const members = pgTable("members", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	userId: uuid("user_id"),
	clubId: uuid("club_id").notNull(),
	name: text().notNull(),
	golfHandicap: integer("golf_handicap"),
	email: text(),
	phone: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	sportPreferences: text("sport_preferences").array().default(["RAY['golf'::tex"]),
	membershipType: text("membership_type").default('regular'),
	membershipStatus: text("membership_status").default('active'),
	emergencyContact: jsonb("emergency_contact").default({}),
	joinedDate: date("joined_date").default(sql`CURRENT_DATE`),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "players_club_id_fkey"
		}).onDelete("cascade"),
	foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "players_user_id_fkey"
		}).onDelete("set null"),
]);

export const events = pgTable("events", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id"),
	name: text().notNull(),
	description: text(),
	eventType: text("event_type").notNull(),
	startDate: timestamp("start_date", { withTimezone: true, mode: 'string' }),
	endDate: timestamp("end_date", { withTimezone: true, mode: 'string' }),
	location: text(),
	maxParticipants: integer("max_participants"),
	cost: numeric().default('0'),
	createdBy: uuid("created_by"),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "events_club_id_fkey"
		}),
]);

export const eventParticipants = pgTable("event_participants", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	eventId: uuid("event_id"),
	memberId: uuid("member_id"),
	status: text().default('registered'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.eventId],
			foreignColumns: [events.id],
			name: "event_participants_event_id_fkey"
		}),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "event_participants_member_id_fkey"
		}),
]);

export const facilities = pgTable("facilities", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	clubId: uuid("club_id"),
	name: text().notNull(),
	type: text().notNull(),
	description: text(),
	capacity: integer(),
	bookingRequired: boolean("booking_required").default(false),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.clubId],
			foreignColumns: [clubs.id],
			name: "facilities_club_id_fkey"
		}),
]);

export const facilityBookings = pgTable("facility_bookings", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	facilityId: uuid("facility_id"),
	memberId: uuid("member_id"),
	startTime: timestamp("start_time", { withTimezone: true, mode: 'string' }).notNull(),
	endTime: timestamp("end_time", { withTimezone: true, mode: 'string' }).notNull(),
	purpose: text(),
	status: text().default('confirmed'),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow(),
}, (table) => [
	foreignKey({
			columns: [table.facilityId],
			foreignColumns: [facilities.id],
			name: "facility_bookings_facility_id_fkey"
		}),
	foreignKey({
			columns: [table.memberId],
			foreignColumns: [members.id],
			name: "facility_bookings_member_id_fkey"
		}),
]);

export const profiles = pgTable("profiles", {
	id: uuid().primaryKey().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	fullName: text("full_name"),
	avatarUrl: text("avatar_url"),
	email: text().notNull(),
	phone: text(),
	address: text(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => [
	foreignKey({
			columns: [table.id],
			foreignColumns: [users.id],
			name: "profiles_id_fkey"
		}).onDelete("cascade"),
	unique("profiles_email_key").on(table.email),
	pgPolicy("Users can update own profile", { as: "permissive", for: "update", to: ["public"], using: sql`(auth.uid() = id)` }),
	pgPolicy("Users can view own profile", { as: "permissive", for: "select", to: ["public"] }),
]);
