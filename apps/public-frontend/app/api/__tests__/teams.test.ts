import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '../teams/route';
import { teamService, organizationService } from '@rallyround/db';

// Mock the Next.js and Supabase dependencies
vi.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
  }),
}));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createRouteHandlerClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
  })),
}));

// Mock the team and organization services
vi.mock('@rallyround/db', () => ({
  teamService: {
    createTeam: vi.fn(),
    getUserTeams: vi.fn(),
    getTeamsByOrganization: vi.fn(),
  },
  organizationService: {
    isOrganizationMember: vi.fn(),
  },
}));

describe('Teams API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/teams', () => {
    it('should create a team when authenticated and part of the organization', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      const mockTeam = {
        id: 'team-123',
        name: 'Test Team',
        sport: 'Soccer',
        ageGroup: 'Adult',
        organizationId: 'org-123',
        createdById: 'user-123',
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the organization service
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(true);
      
      // Mock the team service
      vi.mocked(teamService.createTeam).mockResolvedValue({
        team: mockTeam,
        membership: { id: 'member-123', teamId: 'team-123', userId: 'user-123', role: 'owner' },
      });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Team',
          description: 'Test Description',
          sport: 'Soccer',
          ageGroup: 'Adult',
          organizationId: 'org-123',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(201);
      expect(data).toEqual({ team: mockTeam });
      expect(organizationService.isOrganizationMember).toHaveBeenCalledWith('org-123', 'user-123');
      expect(teamService.createTeam).toHaveBeenCalledWith({
        name: 'Test Team',
        description: 'Test Description',
        sport: 'Soccer',
        ageGroup: 'Adult',
        logoUrl: null,
        createdById: 'user-123',
        organizationId: 'org-123',
      });
    });

    it('should return 401 when not authenticated', async () => {
      // Arrange
      // Mock the Supabase auth session (no session)
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: null } });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Team',
          sport: 'Soccer',
          ageGroup: 'Adult',
          organizationId: 'org-123',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(teamService.createTeam).not.toHaveBeenCalled();
    });

    it('should return 400 when required fields are missing', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Create a mock request with missing fields
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Team',
          // Missing sport and ageGroup
          organizationId: 'org-123',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Missing required fields' });
      expect(teamService.createTeam).not.toHaveBeenCalled();
    });

    it('should return 400 when organizationId is missing', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Create a mock request with missing organizationId
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Team',
          sport: 'Soccer',
          ageGroup: 'Adult',
          // Missing organizationId
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Organization ID is required' });
      expect(teamService.createTeam).not.toHaveBeenCalled();
    });

    it('should return 403 when user is not a member of the organization', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the organization service (user is not a member)
      vi.mocked(organizationService.isOrganizationMember).mockResolvedValue(false);
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Team',
          sport: 'Soccer',
          ageGroup: 'Adult',
          organizationId: 'org-123',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(403);
      expect(data).toEqual({ error: 'You are not a member of this organization' });
      expect(teamService.createTeam).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/teams', () => {
    it('should return all user teams when no organizationId is provided', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      const mockTeams = [
        { id: 'team-123', name: 'Team 1', organizationId: 'org-123' },
        { id: 'team-456', name: 'Team 2', organizationId: 'org-456' },
      ];
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the team service
      vi.mocked(teamService.getUserTeams).mockResolvedValue(mockTeams);
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ teams: mockTeams });
      expect(teamService.getUserTeams).toHaveBeenCalledWith('user-123');
      expect(teamService.getTeamsByOrganization).not.toHaveBeenCalled();
    });

    it('should return organization teams when organizationId is provided', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      const mockTeams = [
        { id: 'team-123', name: 'Team 1', organizationId: 'org-123' },
        { id: 'team-456', name: 'Team 2', organizationId: 'org-123' },
      ];
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the team service
      vi.mocked(teamService.getTeamsByOrganization).mockResolvedValue(mockTeams);
      
      // Create a mock request with organizationId query parameter
      const request = new NextRequest('http://localhost:3000/api/teams?organizationId=org-123', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual({ teams: mockTeams });
      expect(teamService.getTeamsByOrganization).toHaveBeenCalledWith('org-123', 'user-123');
      expect(teamService.getUserTeams).not.toHaveBeenCalled();
    });

    it('should return 401 when not authenticated', async () => {
      // Arrange
      // Mock the Supabase auth session (no session)
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createRouteHandlerClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: null } });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/teams', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(teamService.getUserTeams).not.toHaveBeenCalled();
      expect(teamService.getTeamsByOrganization).not.toHaveBeenCalled();
    });
  });
});
