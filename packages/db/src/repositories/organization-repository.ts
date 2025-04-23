/**
 * Organization Repository
 * 
 * Provides data access methods for organization-related operations
 */
import { and, eq, sql, asc } from 'drizzle-orm';
import { db } from '../index';
import { organizations, organizationMembers, organizationInvitations, organizationRoleEnum } from '../schema/organizations';
import { profiles } from '../schema/profiles';
import { teams } from '../schema/teams';

export interface OrganizationWithMembership {
  id: string;
  name: string;
  description: string | null;
  logoUrl: string | null;
  website: string | null;
  members: number;
  teams: number;
  role: string;
  createdAt: string;
}

export interface CreateOrganizationParams {
  name: string;
  description?: string | null;
  logoUrl?: string | null;
  website?: string | null;
  createdById: string;
}

export interface OrganizationMemberParams {
  organizationId: string;
  userId: string;
  role?: string;
}

export class OrganizationRepository {
  /**
   * Get all organizations for a specific user
   */
  async getUserOrganizations(userId: string): Promise<OrganizationWithMembership[]> {
    try {
      // Get all organizations the user is a member of using a join query
      const userOrgsResult = await db.execute(sql`
        SELECT om.*, o.* 
        FROM organization_members om 
        JOIN organizations o ON om.organization_id = o.id
        WHERE om.user_id = ${userId}
      `);
      
      if (!userOrgsResult?.rows?.length) {
        return [];
      }
      
      // Process the results with member and team counts
      const orgsData: OrganizationWithMembership[] = await Promise.all(
        userOrgsResult.rows.map(async (row: any) => {
          // Count members for this organization
          const memberCountResult = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM organization_members 
            WHERE organization_id = ${row.id || row.organization_id}
          `);
          
          // Count teams for this organization
          const teamCountResult = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM organization_teams 
            WHERE organization_id = ${row.id || row.organization_id}
          `);
          
          const memberCount = Number(memberCountResult.rows[0]?.count || 0);
          const teamCount = Number(teamCountResult.rows[0]?.count || 0);
          
          return {
            id: row.id || row.organization_id,
            name: row.name || 'Unnamed Organization',
            description: row.description,
            logoUrl: row.logo_url,
            website: row.website,
            members: memberCount,
            teams: teamCount,
            role: row.role || 'member',
            createdAt: row.created_at || new Date().toISOString()
          };
        })
      );
      
      return orgsData;
    } catch (error) {
      console.error('Error in getOrganizationsForUser:', error);
      throw error;
    }
  }

  /**
   * Create a new organization and add the creator as an owner
   */
  async createOrganization(params: CreateOrganizationParams): Promise<{ organization: any, membership: any }> {
    try {
      // 1. Create the organization
      const [newOrganization] = await db.insert(organizations).values({
        name: params.name,
        description: params.description || null,
        logoUrl: params.logoUrl || null,
        website: params.website || null,
        createdById: params.createdById,
      }).returning();
      
      if (!newOrganization) {
        throw new Error('Failed to create organization');
      }
      
      // 2. Add the creator as an owner
      const [membership] = await db.insert(organizationMembers).values({
        organizationId: newOrganization.id,
        userId: params.createdById,
        role: organizationRoleEnum.enumValues[0], // 'owner'
      }).returning();
      
      return { organization: newOrganization, membership };
    } catch (error) {
      console.error('Error in createOrganization:', error);
      throw error;
    }
  }

  /**
   * Get an organization by ID
   */
  async getOrganizationById(organizationId: string): Promise<any> {
    try {
      const organization = await db.query.organizations.findFirst({
        where: eq(organizations.id, organizationId),
        with: {
          members: {
            with: {
              user: true
            }
          }
        }
      });
      
      return organization;
    } catch (error) {
      console.error('Error in getOrganizationById:', error);
      throw error;
    }
  }

  /**
   * Add a member to an organization
   */
  async addOrganizationMember(params: OrganizationMemberParams): Promise<any> {
    try {
      const [membership] = await db.insert(organizationMembers).values({
        organizationId: params.organizationId,
        userId: params.userId,
        role: params.role || organizationRoleEnum.enumValues[2], // 'member'
      }).returning();
      
      return membership;
    } catch (error) {
      console.error('Error in addOrganizationMember:', error);
      throw error;
    }
  }

  /**
   * Check if a user is a member of an organization
   */
  async isOrganizationMember(organizationId: string, userId: string): Promise<boolean> {
    try {
      const membership = await db.query.organizationMembers.findFirst({
        where: and(
          eq(organizationMembers.organizationId, organizationId),
          eq(organizationMembers.userId, userId)
        )
      });
      
      return !!membership;
    } catch (error) {
      console.error('Error in isOrganizationMember:', error);
      throw error;
    }
  }

  /**
   * Get all teams for an organization
   */
  async getOrganizationTeams(organizationId: string): Promise<any[]> {
    try {
      const teamsResult = await db.query.teams.findMany({
        where: eq(teams.organizationId, organizationId)
      });
      
      return teamsResult;
    } catch (error) {
      console.error('Error in getOrganizationTeams:', error);
      throw error;
    }
  }

  /**
   * Get the default organization for a user (first one they joined or created)
   */
  async getDefaultOrganizationForUser(userId: string): Promise<any> {
    try {
      const memberships = await db.query.organizationMembers.findMany({
        where: eq(organizationMembers.userId, userId),
        orderBy: (members) => [asc(members.joinedAt)],
        limit: 1,
        with: {
          organization: true
        }
      });
      
      if (memberships.length === 0) {
        return null;
      }
      
      return memberships[0].organization;
    } catch (error) {
      console.error('Error in getDefaultOrganizationForUser:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const organizationRepository = new OrganizationRepository();
