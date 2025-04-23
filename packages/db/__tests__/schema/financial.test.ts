import { describe, it, expect } from 'vitest';
import { 
  budgets, 
  budgetCategories, 
  expenses, 
  fundraisingCampaigns, 
  donations,
  budgetStatusEnum,
  expenseStatusEnum,
  campaignStatusEnum,
  paymentStatusEnum,
  paymentMethodEnum
} from '../../schema/financial';
import { InferSelectModel } from 'drizzle-orm';

describe('Financial Schema', () => {
  describe('Enums', () => {
    it('should define budget status enum with correct values', () => {
      expect(budgetStatusEnum.enumValues).toEqual(['draft', 'active', 'closed']);
    });

    it('should define expense status enum with correct values', () => {
      expect(expenseStatusEnum.enumValues).toEqual(['pending', 'approved', 'rejected']);
    });

    it('should define campaign status enum with correct values', () => {
      expect(campaignStatusEnum.enumValues).toEqual(['draft', 'active', 'completed']);
    });

    it('should define payment status enum with correct values', () => {
      expect(paymentStatusEnum.enumValues).toEqual(['pending', 'completed', 'failed', 'refunded']);
    });

    it('should define payment method enum with correct values', () => {
      expect(paymentMethodEnum.enumValues).toEqual(['credit_card', 'bank_transfer', 'paypal', 'cash', 'other']);
    });
  });

  describe('Budget Schema', () => {
    it('should have the correct table name', () => {
      expect(budgets.name).toBe('budgets');
    });

    it('should have the required fields', () => {
      type Budget = InferSelectModel<typeof budgets>;
      
      // Type assertion to verify required fields
      const requiredFields: (keyof Budget)[] = [
        'id',
        'name',
        'totalAmount',
        'startDate',
        'endDate',
        'status',
        'createdById',
        'createdAt',
        'updatedAt'
      ];
      
      requiredFields.forEach(field => {
        expect(budgets).toHaveProperty(field);
      });
    });

    it('should have optional fields', () => {
      type Budget = InferSelectModel<typeof budgets>;
      
      // Type assertion to verify optional fields
      const optionalFields: (keyof Budget)[] = [
        'description',
        'teamId',
        'eventId'
      ];
      
      optionalFields.forEach(field => {
        expect(budgets).toHaveProperty(field);
      });
    });
  });

  describe('Budget Categories Schema', () => {
    it('should have the correct table name', () => {
      expect(budgetCategories.name).toBe('budget_categories');
    });

    it('should have the required fields', () => {
      type BudgetCategory = InferSelectModel<typeof budgetCategories>;
      
      // Type assertion to verify required fields
      const requiredFields: (keyof BudgetCategory)[] = [
        'id',
        'budgetId',
        'name',
        'allocatedAmount',
        'createdAt',
        'updatedAt'
      ];
      
      requiredFields.forEach(field => {
        expect(budgetCategories).toHaveProperty(field);
      });
    });

    it('should have optional fields', () => {
      type BudgetCategory = InferSelectModel<typeof budgetCategories>;
      
      // Type assertion to verify optional fields
      const optionalFields: (keyof BudgetCategory)[] = [
        'description'
      ];
      
      optionalFields.forEach(field => {
        expect(budgetCategories).toHaveProperty(field);
      });
    });
  });

  describe('Expenses Schema', () => {
    it('should have the correct table name', () => {
      expect(expenses.name).toBe('expenses');
    });

    it('should have the required fields', () => {
      type Expense = InferSelectModel<typeof expenses>;
      
      // Type assertion to verify required fields
      const requiredFields: (keyof Expense)[] = [
        'id',
        'budgetId',
        'description',
        'amount',
        'date',
        'status',
        'createdById',
        'createdAt',
        'updatedAt'
      ];
      
      requiredFields.forEach(field => {
        expect(expenses).toHaveProperty(field);
      });
    });

    it('should have optional fields', () => {
      type Expense = InferSelectModel<typeof expenses>;
      
      // Type assertion to verify optional fields
      const optionalFields: (keyof Expense)[] = [
        'categoryId',
        'teamId',
        'eventId',
        'receiptUrl'
      ];
      
      optionalFields.forEach(field => {
        expect(expenses).toHaveProperty(field);
      });
    });
  });

  describe('Fundraising Campaigns Schema', () => {
    it('should have the correct table name', () => {
      expect(fundraisingCampaigns.name).toBe('fundraising_campaigns');
    });

    it('should have the required fields', () => {
      type FundraisingCampaign = InferSelectModel<typeof fundraisingCampaigns>;
      
      // Type assertion to verify required fields
      const requiredFields: (keyof FundraisingCampaign)[] = [
        'id',
        'name',
        'goalAmount',
        'currentAmount',
        'startDate',
        'endDate',
        'status',
        'createdById',
        'createdAt',
        'updatedAt'
      ];
      
      requiredFields.forEach(field => {
        expect(fundraisingCampaigns).toHaveProperty(field);
      });
    });

    it('should have optional fields', () => {
      type FundraisingCampaign = InferSelectModel<typeof fundraisingCampaigns>;
      
      // Type assertion to verify optional fields
      const optionalFields: (keyof FundraisingCampaign)[] = [
        'description',
        'teamId',
        'eventId'
      ];
      
      optionalFields.forEach(field => {
        expect(fundraisingCampaigns).toHaveProperty(field);
      });
    });
  });

  describe('Donations Schema', () => {
    it('should have the correct table name', () => {
      expect(donations.name).toBe('donations');
    });

    it('should have the required fields', () => {
      type Donation = InferSelectModel<typeof donations>;
      
      // Type assertion to verify required fields
      const requiredFields: (keyof Donation)[] = [
        'id',
        'campaignId',
        'donorName',
        'donorEmail',
        'amount',
        'date',
        'paymentMethod',
        'paymentStatus',
        'createdAt',
        'updatedAt'
      ];
      
      requiredFields.forEach(field => {
        expect(donations).toHaveProperty(field);
      });
    });

    it('should have optional fields', () => {
      type Donation = InferSelectModel<typeof donations>;
      
      // Type assertion to verify optional fields
      const optionalFields: (keyof Donation)[] = [
        'transactionId'
      ];
      
      optionalFields.forEach(field => {
        expect(donations).toHaveProperty(field);
      });
    });
  });
});
