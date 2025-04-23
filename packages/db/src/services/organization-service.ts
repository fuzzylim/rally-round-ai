/**
 * Organization Service
 * 
 * Provides business logic for organization-related operations
 */
import { organizationRepository, CreateOrganizationParams, OrganizationWithMembership, OrganizationMemberParams } from '../repositories/organization-repository';

export class OrganizationService {
  /**
   * Get all organizations for a user
   */
  async getUserOrganizations(userId: string): Promise<OrganizationWithMembership[]> {
    try {
      return await organizationRepository.getUserOrganizations(userId);
    } catch (error) {
      console.error('OrganizationService.getUserOrganizations error:', error);
      throw new Error(`Failed to get user organizations: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a new organization
   * Handles all the operations needed when creating an organization:
   * - Create the organization record
   * - Add the creator as an owner
   */
  async createOrganization(params: CreateOrganizationParams): Promise<{ organization: any, membership: any }> {
    try {
      // Validate organization data
      if (!params.name || !params.createdById) {
        throw new Error('Missing required organization information');
      }

      // Create organization with all related records
      return await organizationRepository.createOrganization(params);
    } catch (error) {
      console.error('OrganizationService.createOrganization error:', error);
      throw new Error(`Failed to create organization: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get an organization by ID with all related data
   */
  async getOrganizationDetails(organizationId: string): Promise<any> {
    try {
      return await organizationRepository.getOrganizationById(organizationId);
    } catch (error) {
      console.error('OrganizationService.getOrganizationDetails error:', error);
      throw new Error(`Failed to get organization details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add a member to an organization
   */
  async addOrganizationMember(params: OrganizationMemberParams): Promise<any> {
    try {
      // Check if user is already a member
      const isMember = await organizationRepository.isOrganizationMember(params.organizationId, params.userId);
      if (isMember) {
        throw new Error('User is already a member of this organization');
      }

      return await organizationRepository.addOrganizationMember(params);
    } catch (error) {
      console.error('OrganizationService.addOrganizationMember error:', error);
      throw new Error(`Failed to add organization member: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Check if a user is a member of an organization
   */
  async isOrganizationMember(organizationId: string, userId: string): Promise<boolean> {
    try {
      return await organizationRepository.isOrganizationMember(organizationId, userId);
    } catch (error) {
      console.error('OrganizationService.isOrganizationMember error:', error);
      throw new Error(`Failed to check organization membership: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get the default organization for a user
   * If no organization exists, creates a new one
   */
  async getOrCreateDefaultOrganization(userId: string, userName: string): Promise<any> {
    try {
      // Try to get the default organization
      const defaultOrg = await organizationRepository.getDefaultOrganizationForUser(userId);
      
      // If found, return it
      if (defaultOrg) {
        return defaultOrg;
      }
      
      // Otherwise, create a new organization for the user
      const { organization } = await this.createOrganization({
        name: `${userName}'s Organization`,
        description: `Default organization for ${userName}`,
        createdById: userId
      });
      
      return organization;
    } catch (error) {
      console.error('OrganizationService.getOrCreateDefaultOrganization error:', error);
      throw new Error(`Failed to get or create default organization: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Export a singleton instance
export const organizationService = new OrganizationService();
