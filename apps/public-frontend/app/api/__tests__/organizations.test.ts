import { describe, it, expect, vi, beforeEach } from 'vitest';
import { NextRequest } from 'next/server';
import { POST, GET } from '../organizations/route';
import { organizationService } from '@rallyround/db';

// Mock the Next.js and Supabase dependencies
vi.mock('next/headers', () => ({
  cookies: () => ({
    getAll: () => [],
  }),
}));

vi.mock('@supabase/auth-helpers-nextjs', () => ({
  createServerComponentClient: vi.fn(() => ({
    auth: {
      getSession: vi.fn(),
    },
    from: vi.fn(() => ({
      select: vi.fn(() => ({
        eq: vi.fn(() => ({
          single: vi.fn(),
        })),
      })),
    })),
  })),
}));

// Mock the organization service
vi.mock('@rallyround/db', () => ({
  organizationService: {
    createOrganization: vi.fn(),
    getUserOrganizations: vi.fn(),
  },
}));

describe('Organizations API', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('POST /api/organizations', () => {
    it('should create an organization when authenticated', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      const mockOrg = {
        id: 'org-123',
        name: 'Test Organization',
        createdById: 'user-123',
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createServerComponentClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the organization service
      vi.mocked(organizationService.createOrganization).mockResolvedValue({
        organization: mockOrg,
        membership: { id: 'member-123', organizationId: 'org-123', userId: 'user-123', role: 'owner' },
      });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Organization',
          description: 'Test Description',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrg);
      expect(organizationService.createOrganization).toHaveBeenCalledWith({
        name: 'Test Organization',
        description: 'Test Description',
        logoUrl: undefined,
        website: undefined,
        createdById: 'user-123',
      });
    });

    it('should return 401 when not authenticated', async () => {
      // Arrange
      // Mock the Supabase auth session (no session)
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createServerComponentClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: null } });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'Test Organization',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(organizationService.createOrganization).not.toHaveBeenCalled();
    });

    it('should return 400 when name is missing', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createServerComponentClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: 'Test Description',
        }),
      });

      // Act
      const response = await POST(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(400);
      expect(data).toEqual({ error: 'Organization name is required' });
      expect(organizationService.createOrganization).not.toHaveBeenCalled();
    });
  });

  describe('GET /api/organizations', () => {
    it('should return organizations when authenticated', async () => {
      // Arrange
      const mockSession = {
        user: { id: 'user-123' },
      };
      
      const mockOrgs = [
        { id: 'org-123', name: 'Organization 1' },
        { id: 'org-456', name: 'Organization 2' },
      ];
      
      // Mock the Supabase auth session
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createServerComponentClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: mockSession } });
      
      // Mock the Supabase profile query
      const supabaseFrom = require('@supabase/auth-helpers-nextjs').createServerComponentClient().from;
      const selectMock = supabaseFrom().select();
      const eqMock = selectMock.eq();
      eqMock.single.mockResolvedValue({ data: { id: 'user-123', name: 'Test User' } });
      
      // Mock the organization service
      vi.mocked(organizationService.getUserOrganizations).mockResolvedValue(mockOrgs);
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(200);
      expect(data).toEqual(mockOrgs);
      expect(organizationService.getUserOrganizations).toHaveBeenCalledWith('user-123');
    });

    it('should return 401 when not authenticated', async () => {
      // Arrange
      // Mock the Supabase auth session (no session)
      const supabaseAuth = require('@supabase/auth-helpers-nextjs').createServerComponentClient().auth;
      supabaseAuth.getSession.mockResolvedValue({ data: { session: null } });
      
      // Create a mock request
      const request = new NextRequest('http://localhost:3000/api/organizations', {
        method: 'GET',
      });

      // Act
      const response = await GET(request);
      const data = await response.json();

      // Assert
      expect(response.status).toBe(401);
      expect(data).toEqual({ error: 'Unauthorized' });
      expect(organizationService.getUserOrganizations).not.toHaveBeenCalled();
    });
  });
});
