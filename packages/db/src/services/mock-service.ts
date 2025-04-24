/**
 * Mock Services
 * 
 * Provides mock implementations of services for Vercel build environment
 * This ensures that the build process can complete even without a database connection
 */

import { OrganizationServiceInterface } from './organization-service';
import { CreateOrganizationParams, OrganizationMemberParams } from '../repositories/organization-repository';

/**
 * A special mock version of the organization service that works during builds
 * Used for Vercel deployment to allow Next.js to build without a valid DB connection
 */
export class MockOrganizationService implements OrganizationServiceInterface {
  async getUserOrganizations(_userId: string) {
    console.log('🏗️ Using mock getUserOrganizations during build');
    return [];
  }

  async createOrganization(params: CreateOrganizationParams) {
    console.log('🏗️ Using mock createOrganization during build');
    const mockOrg = {
      id: 'mock-org-id',
      name: params.name,
      description: params.description || '',
      logoUrl: params.logoUrl || null,
      website: params.website || null,
      createdById: params.createdById,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const mockMembership = {
      id: 'mock-membership-id',
      organizationId: mockOrg.id,
      userId: params.createdById,
      role: 'owner',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return { organization: mockOrg, membership: mockMembership };
  }

  async getOrganizationDetails(_organizationId: string) {
    console.log('🏗️ Using mock getOrganizationDetails during build');
    return {
      id: 'mock-org-id',
      name: 'Mock Organization',
      description: 'Created for the Vercel build process',
      members: []
    };
  }

  async addOrganizationMember(params: OrganizationMemberParams) {
    console.log('🏗️ Using mock addOrganizationMember during build');
    return {
      id: 'mock-membership-id',
      organizationId: params.organizationId,
      userId: params.userId,
      role: params.role,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }

  async isOrganizationMember(_organizationId: string, _userId: string) {
    console.log('🏗️ Using mock isOrganizationMember during build');
    return true;
  }

  async getOrCreateDefaultOrganization(userId: string, userName?: string) {
    console.log('🏗️ Using mock getOrCreateDefaultOrganization during build');
    const name = userName ? `${userName}'s Organization` : 'Default Organization';
    
    return {
      id: 'mock-default-org-id',
      name,
      description: `Default organization for ${userName || 'user'}`,
      createdById: userId,
      createdAt: new Date(),
      updatedAt: new Date()
    };
  }
}
