// Type declarations for @rallyround/db package
declare module '@rallyround/db' {
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

  export interface OrganizationService {
    getUserOrganizations(userId: string): Promise<any[]>;
    createOrganization(params: {
      name: string;
      description?: string;
      logoUrl?: string;
      website?: string;
      createdById: string;
    }): Promise<{ organization: Organization; membership: OrganizationMembership }>;
    getOrCreateDefaultOrganization(userId: string, userName?: string): Promise<Organization>;
  }

  export const organizationService: OrganizationService;

  export interface OrganizationRepository {
    getUserOrganizations(userId: string): Promise<any[]>;
    createOrganization(params: any): Promise<Organization>;
    addOrganizationMember(params: any): Promise<OrganizationMembership>;
  }

  export const organizationRepository: OrganizationRepository;
}
