import { describe, it, expect, vi, beforeEach } from 'vitest';
import { teamService } from '../../services/team-service';
import { teamRepository } from '../../repositories/team-repository';
import { organizationService } from '../../services/organization-service';

// Mock the repositories
vi.mock('../../repositories/team-repository', () => ({
  teamRepository: {
    createTeam: vi.fn(),
    getTeamById: vi.fn(),
    getUserTeams: vi.fn(),
    getTeamsByOrganization: vi.fn(),
    addTeamMember: vi.fn(),
    logTeamActivity: vi.fn(),
  }
}));

vi.mock('../../services/organization-service', () => ({
  organizationService: {
    isOrganizationMember: vi.fn(),
  }
}));

describe('Team Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createTeam', () => {
    it('should create a team, add the creator as a member, and log activity', async () => {
      // Arrange
      const teamData = {
        name: 'Test Team',
        description: 'Test Description',
        sport: 'Soccer',
        ageGroup: 'Adult',
        createdById: 'user-123',
        organizationId: 'org-123',
      };
      
      const mockTeam = { id: 'team-123', ...teamData };
      
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(true);
      vi.mocked(teamRepository.createTeam).mockResolvedValue(mockTeam);
      vi.mocked(teamRepository.addTeamMember).mockResolvedValue({
        id: 'member-123',
        teamId: 'team-123',
        userId: 'user-123',
        role: 'owner',
        createdAt: new Date(),
      });
      vi.mocked(teamRepository.logTeamActivity).mockResolvedValue({
        id: 'activity-123',
        teamId: 'team-123',
        userId: 'user-123',
        activityType: 'team_created',
        description: 'Team "Test Team" was created',
        createdAt: new Date(),
      });

      // Act
      const result = await teamService.createTeam(teamData);

      // Assert
      expect(organizationService.isOrganizationMember).toHaveBeenCalledWith('org-123', 'user-123');
      expect(teamRepository.createTeam).toHaveBeenCalledWith(teamData);
      expect(teamRepository.addTeamMember).toHaveBeenCalledWith({
        teamId: 'team-123',
        userId: 'user-123',
        role: 'owner',
      });
      expect(teamRepository.logTeamActivity).toHaveBeenCalledWith({
        teamId: 'team-123',
        userId: 'user-123',
        activityType: 'team_created',
        description: 'Team "Test Team" was created',
      });
      
      expect(result).toEqual({
        team: mockTeam,
        membership: expect.objectContaining({
          teamId: 'team-123',
          userId: 'user-123',
          role: 'owner',
        }),
      });
    });

    it('should throw an error if user is not a member of the organization', async () => {
      // Arrange
      const teamData = {
        name: 'Test Team',
        description: 'Test Description',
        sport: 'Soccer',
        ageGroup: 'Adult',
        createdById: 'user-123',
        organizationId: 'org-123',
      };
      
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(false);

      // Act & Assert
      await expect(teamService.createTeam(teamData)).rejects.toThrow(
        'User is not a member of the organization'
      );
      
      expect(teamRepository.createTeam).not.toHaveBeenCalled();
    });
  });

  describe('getUserTeams', () => {
    it('should return teams for a user', async () => {
      // Arrange
      const userId = 'user-123';
      const mockTeams = [
        { id: 'team-123', name: 'Team 1', role: 'owner' },
        { id: 'team-456', name: 'Team 2', role: 'member' },
      ];
      
      vi.mocked(teamRepository.getUserTeams).mockResolvedValue(mockTeams);

      // Act
      const result = await teamService.getUserTeams(userId);

      // Assert
      expect(teamRepository.getUserTeams).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockTeams);
    });
  });

  describe('getTeamsByOrganization', () => {
    it('should return teams for an organization that the user is a member of', async () => {
      // Arrange
      const organizationId = 'org-123';
      const userId = 'user-123';
      const mockTeams = [
        { id: 'team-123', name: 'Team 1', organizationId },
        { id: 'team-456', name: 'Team 2', organizationId },
      ];
      
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(true);
      vi.mocked(teamRepository.getTeamsByOrganization).mockResolvedValue(mockTeams);

      // Act
      const result = await teamService.getTeamsByOrganization(organizationId, userId);

      // Assert
      expect(organizationService.isOrganizationMember).toHaveBeenCalledWith(organizationId, userId);
      expect(teamRepository.getTeamsByOrganization).toHaveBeenCalledWith(organizationId);
      expect(result).toEqual(mockTeams);
    });

    it('should throw an error if user is not a member of the organization', async () => {
      // Arrange
      const organizationId = 'org-123';
      const userId = 'user-123';
      
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(false);

      // Act & Assert
      await expect(teamService.getTeamsByOrganization(organizationId, userId)).rejects.toThrow(
        'User is not a member of the organization'
      );
      
      expect(teamRepository.getTeamsByOrganization).not.toHaveBeenCalled();
    });
  });
});
