import { relations } from "drizzle-orm/relations";
import { usersInAuth, clubs, clubMembers, campaigns, donations, competitions, competitionPlayers, members, teams, teamPlayers, scores, invitations, events, eventParticipants, facilities, facilityBookings, profiles } from "./schema";

export const clubsRelations = relations(clubs, ({one, many}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [clubs.createdBy],
		references: [usersInAuth.id]
	}),
	clubMembers: many(clubMembers),
	campaigns: many(campaigns),
	competitions: many(competitions),
	invitations: many(invitations),
	members: many(members),
	events: many(events),
	facilities: many(facilities),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	clubs: many(clubs),
	clubMembers: many(clubMembers),
	campaigns: many(campaigns),
	donations: many(donations),
	competitions: many(competitions),
	invitations: many(invitations),
	members: many(members),
	profiles: many(profiles),
}));

export const clubMembersRelations = relations(clubMembers, ({one}) => ({
	club: one(clubs, {
		fields: [clubMembers.clubId],
		references: [clubs.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [clubMembers.userId],
		references: [usersInAuth.id]
	}),
}));

export const campaignsRelations = relations(campaigns, ({one, many}) => ({
	club: one(clubs, {
		fields: [campaigns.clubId],
		references: [clubs.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [campaigns.createdBy],
		references: [usersInAuth.id]
	}),
	donations: many(donations),
}));

export const donationsRelations = relations(donations, ({one}) => ({
	campaign: one(campaigns, {
		fields: [donations.campaignId],
		references: [campaigns.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [donations.userId],
		references: [usersInAuth.id]
	}),
}));

export const competitionsRelations = relations(competitions, ({one, many}) => ({
	club: one(clubs, {
		fields: [competitions.clubId],
		references: [clubs.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [competitions.createdBy],
		references: [usersInAuth.id]
	}),
	competitionPlayers: many(competitionPlayers),
	teams: many(teams),
	scores: many(scores),
}));

export const competitionPlayersRelations = relations(competitionPlayers, ({one}) => ({
	competition: one(competitions, {
		fields: [competitionPlayers.competitionId],
		references: [competitions.id]
	}),
	member: one(members, {
		fields: [competitionPlayers.memberId],
		references: [members.id]
	}),
}));

export const membersRelations = relations(members, ({one, many}) => ({
	competitionPlayers: many(competitionPlayers),
	teamPlayers: many(teamPlayers),
	scores: many(scores),
	club: one(clubs, {
		fields: [members.clubId],
		references: [clubs.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [members.userId],
		references: [usersInAuth.id]
	}),
	eventParticipants: many(eventParticipants),
	facilityBookings: many(facilityBookings),
}));

export const teamsRelations = relations(teams, ({one, many}) => ({
	competition: one(competitions, {
		fields: [teams.competitionId],
		references: [competitions.id]
	}),
	teamPlayers: many(teamPlayers),
	scores: many(scores),
}));

export const teamPlayersRelations = relations(teamPlayers, ({one}) => ({
	member: one(members, {
		fields: [teamPlayers.memberId],
		references: [members.id]
	}),
	team: one(teams, {
		fields: [teamPlayers.teamId],
		references: [teams.id]
	}),
}));

export const scoresRelations = relations(scores, ({one}) => ({
	competition: one(competitions, {
		fields: [scores.competitionId],
		references: [competitions.id]
	}),
	member: one(members, {
		fields: [scores.memberId],
		references: [members.id]
	}),
	team: one(teams, {
		fields: [scores.teamId],
		references: [teams.id]
	}),
}));

export const invitationsRelations = relations(invitations, ({one}) => ({
	club: one(clubs, {
		fields: [invitations.clubId],
		references: [clubs.id]
	}),
	usersInAuth: one(usersInAuth, {
		fields: [invitations.createdBy],
		references: [usersInAuth.id]
	}),
}));

export const eventsRelations = relations(events, ({one, many}) => ({
	club: one(clubs, {
		fields: [events.clubId],
		references: [clubs.id]
	}),
	eventParticipants: many(eventParticipants),
}));

export const eventParticipantsRelations = relations(eventParticipants, ({one}) => ({
	event: one(events, {
		fields: [eventParticipants.eventId],
		references: [events.id]
	}),
	member: one(members, {
		fields: [eventParticipants.memberId],
		references: [members.id]
	}),
}));

export const facilitiesRelations = relations(facilities, ({one, many}) => ({
	club: one(clubs, {
		fields: [facilities.clubId],
		references: [clubs.id]
	}),
	facilityBookings: many(facilityBookings),
}));

export const facilityBookingsRelations = relations(facilityBookings, ({one}) => ({
	facility: one(facilities, {
		fields: [facilityBookings.facilityId],
		references: [facilities.id]
	}),
	member: one(members, {
		fields: [facilityBookings.memberId],
		references: [members.id]
	}),
}));

export const profilesRelations = relations(profiles, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [profiles.id],
		references: [usersInAuth.id]
	}),
}));