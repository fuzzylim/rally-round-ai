/**
 * Team Repository
 * 
 * Provides data access methods for team-related operations
 */
import { and, eq, sql } from 'drizzle-orm';
import { db } from '../index';
import { teams, teamMembers, teamActivities, teamInvitations, teamRoleEnum } from '../schema/teams';
import { profiles } from '../schema/profiles';
import { organizations } from '../schema/organizations';

export interface TeamWithMembership {
  id: string;
  name: string;
  description: string | null;
  sport: string;
  ageGroup: string;
  logoUrl: string | null;
  members: number;
  role: string;
  createdAt: string;
}

export interface CreateTeamParams {
  name: string;
  description?: string | null;
  sport: string;
  ageGroup: string;
  logoUrl?: string | null;
  createdById: string;
  organizationId: string;
}

export interface TeamMemberParams {
  teamId: string;
  userId: string;
  role?: string;
}

export class TeamRepository {
  /**
   * Get all teams for a specific user
   */
  async getUserTeams(userId: string): Promise<TeamWithMembership[]> {
    try {
      // Get all teams the user is a member of using a join query
      const userTeamsResult = await db.execute(sql`
        SELECT tm.*, t.* 
        FROM team_members tm 
        JOIN organization_teams t ON tm.team_id = t.id
        WHERE tm.user_id = ${userId}
      `);
      
      if (!userTeamsResult?.rows?.length) {
        return [];
      }
      
      // Process the results with member counts
      const teamsData: TeamWithMembership[] = await Promise.all(
        userTeamsResult.rows.map(async (row: any) => {
          // Count members for this team
          const memberCountResult = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM team_members 
            WHERE team_id = ${row.id || row.team_id}
          `);
          
          const memberCount = Number(memberCountResult.rows[0]?.count || 0);
          
          return {
            id: row.id || row.team_id,
            name: row.name || 'Unnamed Team',
            description: row.description,
            sport: row.sport || 'General',
            ageGroup: row.age_group || 'All Ages',
            logoUrl: row.logo_url,
            members: memberCount,
            role: row.role || 'member',
            createdAt: row.created_at || new Date().toISOString()
          };
        })
      );
      
      return teamsData;
    } catch (error) {
      console.error('Error in getTeamsForUser:', error);
      throw error;
    }
  }

  /**
   * Create a new team and add the creator as an owner
   */
  async createTeam(params: CreateTeamParams): Promise<{ team: any, membership: any }> {
    try {
      // Start a transaction
      // Note: For production, use a proper transaction with Drizzle
      
      // 1. Create the team
      const [newTeam] = await db.insert(teams).values({
        name: params.name,
        description: params.description || null,
        sport: params.sport,
        ageGroup: params.ageGroup,
        logoUrl: params.logoUrl || null,
        createdById: params.createdById,
        organizationId: params.organizationId,
      }).returning();
      
      if (!newTeam) {
        throw new Error('Failed to create team');
      }
      
      // 2. Add the creator as an owner
      const [membership] = await db.insert(teamMembers).values({
        teamId: newTeam.id,
        userId: params.createdById,
        role: teamRoleEnum.enumValues[0], // 'owner'
      }).returning();
      
      // 3. Log the team creation activity
      await db.insert(teamActivities).values({
        teamId: newTeam.id,
        userId: params.createdById,
        activityType: 'team_created',
        description: `Team "${params.name}" was created`,
      });
      
      return { team: newTeam, membership };
    } catch (error) {
      console.error('Error in createTeam:', error);
      throw error;
    }
  }

  /**
   * Get a team by ID
   */
  async getTeamById(teamId: string): Promise<any> {
    try {
      const team = await db.query.teams.findFirst({
        where: eq(teams.id, teamId),
        with: {
          members: {
            with: {
              user: true
            }
          }
        }
      });
      
      return team;
    } catch (error) {
      console.error('Error in getTeamById:', error);
      throw error;
    }
  }

  /**
   * Add a member to a team
   */
  async addTeamMember(params: TeamMemberParams): Promise<any> {
    try {
      const [membership] = await db.insert(teamMembers).values({
        teamId: params.teamId,
        userId: params.userId,
        role: params.role || teamRoleEnum.enumValues[4], // 'member'
      }).returning();
      
      return membership;
    } catch (error) {
      console.error('Error in addTeamMember:', error);
      throw error;
    }
  }

  /**
   * Check if a user is a member of a team
   */
  async isTeamMember(teamId: string, userId: string): Promise<boolean> {
    try {
      const membership = await db.query.teamMembers.findFirst({
        where: and(
          eq(teamMembers.teamId, teamId),
          eq(teamMembers.userId, userId)
        )
      });
      
      return !!membership;
    } catch (error) {
      console.error('Error in isTeamMember:', error);
      throw error;
    }
  }

  /**
   * Get all members of a team
   */
  async getTeamMembers(teamId: string): Promise<any[]> {
    try {
      const members = await db.query.teamMembers.findMany({
        where: eq(teamMembers.teamId, teamId),
        with: {
          user: true
        }
      });
      
      return members;
    } catch (error) {
      console.error('Error in getTeamMembers:', error);
      throw error;
    }
  }

  /**
   * Get all teams for a specific organization
   */
  async getTeamsByOrganization(organizationId: string): Promise<any[]> {
    try {
      // Get all teams in the organization
      const teamsResult = await db.execute(sql`
        SELECT t.* 
        FROM organization_teams t
        WHERE t.organization_id = ${organizationId}
        ORDER BY t.created_at DESC
      `);
      
      if (!teamsResult?.rows?.length) {
        return [];
      }
      
      // Process the results with member counts
      const teamsData = await Promise.all(
        teamsResult.rows.map(async (row: any) => {
          // Count members for this team
          const memberCountResult = await db.execute(sql`
            SELECT COUNT(*) as count 
            FROM team_members 
            WHERE team_id = ${row.id}
          `);
          
          const memberCount = Number(memberCountResult.rows[0]?.count || 0);
          
          return {
            id: row.id,
            name: row.name || 'Unnamed Team',
            description: row.description,
            sport: row.sport || 'General',
            ageGroup: row.age_group || 'All Ages',
            logoUrl: row.logo_url,
            organizationId: row.organization_id,
            members: memberCount,
            createdAt: row.created_at || new Date().toISOString()
          };
        })
      );
      
      return teamsData;
    } catch (error) {
      console.error('Error in getTeamsByOrganization:', error);
      throw error;
    }
  }
}

// Export a singleton instance
export const teamRepository = new TeamRepository();
