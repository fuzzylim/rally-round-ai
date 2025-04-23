/**
 * Team Service
 * 
 * Provides business logic for team-related operations
 */
import { teamRepository, CreateTeamParams, TeamWithMembership, TeamMemberParams } from '../repositories/team-repository';
import { organizationService } from './organization-service';

export class TeamService {
  /**
   * Get all teams for a user
   */
  async getUserTeams(userId: string): Promise<TeamWithMembership[]> {
    try {
      return await teamRepository.getUserTeams(userId);
    } catch (error) {
      console.error('TeamService.getUserTeams error:', error);
      throw new Error(`Failed to get user teams: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Create a new team
   * Handles all the operations needed when creating a team:
   * - Create the team record
   * - Add the creator as an owner
   * - Log the team creation activity
   */
  async createTeam(params: CreateTeamParams): Promise<{ team: any, membership: any }> {
    try {
      // Validate team data
      if (!params.name || !params.sport || !params.ageGroup || !params.createdById || !params.organizationId) {
        throw new Error('Missing required team information');
      }
      
      // Verify user is a member of the organization
      const isMember = await organizationService.isOrganizationMember(params.organizationId, params.createdById);
      if (!isMember) {
        throw new Error('User is not a member of the organization');
      }

      // Create the team
      const result = await teamRepository.createTeam(params);
      const createdTeam = result.team;
      
      // Add creator as team owner
      const membership = await teamRepository.addTeamMember({
        teamId: createdTeam.id,
        userId: params.createdById,
        role: 'owner'
      });
      
      // Log the team activity
      await teamRepository.logTeamActivity({
        teamId: createdTeam.id,
        userId: params.createdById,
        activityType: 'team_created',
        description: `Team "${params.name}" was created`
      });
      
      return { team: createdTeam, membership };
    } catch (error) {
      console.error('TeamService.createTeam error:', error);
      throw new Error(`Failed to create team: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get a team by ID with all related data
   */
  async getTeamDetails(teamId: string): Promise<any> {
    try {
      return await teamRepository.getTeamById(teamId);
    } catch (error) {
      console.error('TeamService.getTeamDetails error:', error);
      throw new Error(`Failed to get team details: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Add a member to a team
   */
  async addTeamMember(params: TeamMemberParams): Promise<any> {
    try {
      // Check if user is already a member
      const isMember = await teamRepository.isTeamMember(params.teamId, params.userId);
      if (isMember) {
        throw new Error('User is already a member of this team');
      }

      return await teamRepository.addTeamMember(params);
    } catch (error) {
      console.error('TeamService.addTeamMember error:', error);
      throw new Error(`Failed to add team member: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get all members of a team
   */
  async getTeamMembers(teamId: string): Promise<any[]> {
    try {
      return await teamRepository.getTeamMembers(teamId);
    } catch (error) {
      console.error('TeamService.getTeamMembers error:', error);
      throw new Error(`Failed to get team members: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get all teams for an organization
   * Verifies that the user is a member of the organization
   */
  async getTeamsByOrganization(organizationId: string, userId: string): Promise<any[]> {
    try {
      // Verify user is a member of the organization
      const isMember = await organizationService.isOrganizationMember(organizationId, userId);
      if (!isMember) {
        throw new Error('User is not a member of the organization');
      }
      
      return await teamRepository.getTeamsByOrganization(organizationId);
    } catch (error) {
      console.error('TeamService.getTeamsByOrganization error:', error);
      throw new Error(`Failed to get organization teams: ${error instanceof Error ? error.message : String(error)}`);
    }
  }
}

// Export a singleton instance
export const teamService = new TeamService();
