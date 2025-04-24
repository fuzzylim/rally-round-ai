import { pgTable, serial, varchar, text, decimal, timestamp, boolean, pgEnum, integer, uuid } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';
import { users } from './auth';
import { teams } from './teams';
import { events } from './events';

// Enums
export const budgetStatusEnum = pgEnum('budget_status', ['draft', 'active', 'closed']);
export const expenseStatusEnum = pgEnum('expense_status', ['pending', 'approved', 'rejected']);
export const campaignStatusEnum = pgEnum('campaign_status', ['draft', 'active', 'completed']);
export const paymentStatusEnum = pgEnum('payment_status', ['pending', 'completed', 'failed', 'refunded']);
export const paymentMethodEnum = pgEnum('payment_method', ['credit_card', 'bank_transfer', 'paypal', 'cash', 'other']);

// Budget table
export const budgets = pgTable('budgets', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  totalAmount: decimal('total_amount', { precision: 10, scale: 2 }).notNull(),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  status: budgetStatusEnum('status').notNull().default('draft'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  teamId: integer('team_id').references(() => teams.id),
  eventId: integer('event_id').references(() => events.id),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Budget relations
export const budgetsRelations = relations(budgets, ({ one, many }) => ({
  createdBy: one(users, {
    fields: [budgets.createdById],
    references: [users.id],
  }),
  team: one(teams, {
    fields: [budgets.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [budgets.eventId],
    references: [events.id],
  }),
  categories: many(budgetCategories),
  expenses: many(expenses),
}));

// Budget categories table
export const budgetCategories = pgTable('budget_categories', {
  id: serial('id').primaryKey(),
  budgetId: integer('budget_id').references(() => budgets.id).notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  allocatedAmount: decimal('allocated_amount', { precision: 10, scale: 2 }).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Budget categories relations
export const budgetCategoriesRelations = relations(budgetCategories, ({ one, many }) => ({
  budget: one(budgets, {
    fields: [budgetCategories.budgetId],
    references: [budgets.id],
  }),
  expenses: many(expenses),
}));

// Expenses table
export const expenses = pgTable('expenses', {
  id: serial('id').primaryKey(),
  budgetId: integer('budget_id').references(() => budgets.id).notNull(),
  categoryId: integer('category_id').references(() => budgetCategories.id),
  teamId: integer('team_id').references(() => teams.id),
  eventId: integer('event_id').references(() => events.id),
  description: text('description').notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  receiptUrl: text('receipt_url'),
  status: expenseStatusEnum('status').notNull().default('pending'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Expenses relations
export const expensesRelations = relations(expenses, ({ one }) => ({
  budget: one(budgets, {
    fields: [expenses.budgetId],
    references: [budgets.id],
  }),
  category: one(budgetCategories, {
    fields: [expenses.categoryId],
    references: [budgetCategories.id],
  }),
  team: one(teams, {
    fields: [expenses.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [expenses.eventId],
    references: [events.id],
  }),
  createdBy: one(users, {
    fields: [expenses.createdById],
    references: [users.id],
  }),
}));

// Fundraising campaigns table
export const fundraisingCampaigns = pgTable('fundraising_campaigns', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  goalAmount: decimal('goal_amount', { precision: 10, scale: 2 }).notNull(),
  currentAmount: decimal('current_amount', { precision: 10, scale: 2 }).notNull().default('0'),
  startDate: timestamp('start_date').notNull(),
  endDate: timestamp('end_date').notNull(),
  teamId: integer('team_id').references(() => teams.id),
  eventId: integer('event_id').references(() => events.id),
  status: campaignStatusEnum('status').notNull().default('draft'),
  createdById: uuid('created_by_id').references(() => users.id).notNull(),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Fundraising campaigns relations
export const fundraisingCampaignsRelations = relations(fundraisingCampaigns, ({ one, many }) => ({
  team: one(teams, {
    fields: [fundraisingCampaigns.teamId],
    references: [teams.id],
  }),
  event: one(events, {
    fields: [fundraisingCampaigns.eventId],
    references: [events.id],
  }),
  createdBy: one(users, {
    fields: [fundraisingCampaigns.createdById],
    references: [users.id],
  }),
  donations: many(donations),
}));

// Donations table
export const donations = pgTable('donations', {
  id: serial('id').primaryKey(),
  campaignId: integer('campaign_id').references(() => fundraisingCampaigns.id).notNull(),
  donorName: varchar('donor_name', { length: 255 }).notNull(),
  donorEmail: varchar('donor_email', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  date: timestamp('date').notNull(),
  paymentMethod: paymentMethodEnum('payment_method').notNull(),
  paymentStatus: paymentStatusEnum('payment_status').notNull().default('pending'),
  transactionId: varchar('transaction_id', { length: 255 }),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow(),
});

// Donations relations
export const donationsRelations = relations(donations, ({ one }) => ({
  campaign: one(fundraisingCampaigns, {
    fields: [donations.campaignId],
    references: [fundraisingCampaigns.id],
  }),
}));
