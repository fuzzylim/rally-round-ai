/**
 * Type declarations for @rallyround/db package
 * Single source of truth for database-related types across the monorepo
 */
declare module '@rallyround/db' {
  // Core entity interfaces
  export interface Organization {
    id: string;
    name: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    createdById: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface OrganizationMembership {
    id: string;
    organizationId: string;
    userId: string;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }

  // Parameter interfaces for service methods
  export interface CreateOrganizationParams {
    name: string;
    description?: string;
    logoUrl?: string;
    website?: string;
    createdById: string;
  }

  export interface OrganizationMemberParams {
    organizationId: string;
    userId: string;
    role: string;
  }

  // Results and composed types
  export interface OrganizationWithMembership {
    organization: Organization;
    membership: OrganizationMembership;
    role: string;
  }

  // Service interfaces
  export interface OrganizationServiceInterface {
    getUserOrganizations(userId: string): Promise<OrganizationWithMembership[]>;
    createOrganization(params: CreateOrganizationParams): Promise<{ organization: Organization; membership: OrganizationMembership }>;
    getOrganizationDetails(organizationId: string): Promise<Organization>;
    addOrganizationMember(params: OrganizationMemberParams): Promise<OrganizationMembership>;
    isOrganizationMember(organizationId: string, userId: string): Promise<boolean>;
    getOrCreateDefaultOrganization(userId: string, userName?: string): Promise<Organization>;
  }

  export interface OrganizationRepositoryInterface {
    getUserOrganizations(userId: string): Promise<OrganizationWithMembership[]>;
    getOrganizationById(orgId: string): Promise<Organization>;
    getDefaultOrganizationForUser(userId: string): Promise<Organization | null>;
    createOrganization(params: CreateOrganizationParams): Promise<{organization: Organization}>;
    addOrganizationMember(params: OrganizationMemberParams): Promise<OrganizationMembership>;
    isOrganizationMember(organizationId: string, userId: string): Promise<boolean>;
  }

  // Exported service instances
  export const organizationService: OrganizationServiceInterface;
  export const organizationRepository: OrganizationRepositoryInterface;
  
  // Database instance
  export const db: any;
  export const sql: any;
}
