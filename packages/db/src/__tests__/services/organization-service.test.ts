import { describe, it, expect, vi, beforeEach } from 'vitest';
import { organizationService } from '../../services/organization-service';
import { organizationRepository } from '../../repositories/organization-repository';

// Mock the repository
vi.mock('../../repositories/organization-repository', () => ({
  organizationRepository: {
    createOrganization: vi.fn(),
    getOrganizationById: vi.fn(),
    getUserOrganizations: vi.fn(),
    getDefaultOrganizationForUser: vi.fn(),
    isOrganizationMember: vi.fn(),
    addOrganizationMember: vi.fn(),
  }
}));

describe('Organization Service', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  describe('createOrganization', () => {
    it('should create an organization and add the creator as a member', async () => {
      // Arrange
      const orgData = {
        name: 'Test Organization',
        description: 'Test Description',
        createdById: 'user-123',
      };
      
      // Mock the repository implementation
      vi.mocked(organizationRepository.createOrganization).mockResolvedValue({
        organization: {
          id: 'org-123',
          name: 'Test Organization',
          description: 'Test Description',
          createdById: 'user-123',
          logoUrl: null,
          website: null,
          members: 1,
          teams: 0,
          createdAt: new Date().toISOString()
        },
        membership: {
          id: 'member-123',
          organizationId: 'org-123',
          userId: 'user-123',
          role: 'owner'
        }
      });

      // Act
      const result = await organizationService.createOrganization(orgData);

      // Assert
      expect(organizationRepository.createOrganization).toHaveBeenCalledWith(orgData);
      expect(organizationRepository.addOrganizationMember).toHaveBeenCalledWith({
        organizationId: 'org-123',
        userId: 'user-123',
        role: 'owner',
      });
      
      expect(result).toEqual({
        organization: {
          id: 'org-123',
          name: 'Test Organization',
          description: 'Test Description',
          createdById: 'user-123',
          logoUrl: null,
          website: null,
          members: 1,
          teams: 0,
          createdAt: expect.any(String)
        },
        membership: {
          id: 'member-123',
          organizationId: 'org-123',
          userId: 'user-123',
          role: 'owner'
        }
      });
    });
  });

  describe('getUserOrganizations', () => {
    it('should return organizations for a user', async () => {
      // Arrange
      const userId = 'user-123';
      const mockOrgs = [
        { 
          id: 'org-123', 
          name: 'Org 1',
          description: null,
          logoUrl: null,
          website: null,
          members: 1,
          teams: 0,
          role: 'owner',
          createdAt: new Date().toISOString() 
        },
        { 
          id: 'org-456', 
          name: 'Org 2',
          description: 'Second org',
          logoUrl: null,
          website: null,
          members: 2,
          teams: 1,
          role: 'member',
          createdAt: new Date().toISOString() 
        },
      ];
      
      vi.mocked(organizationRepository.getUserOrganizations).mockResolvedValue(mockOrgs);

      // Act
      const result = await organizationService.getUserOrganizations(userId);

      // Assert
      expect(organizationRepository.getUserOrganizations).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockOrgs);
    });
  });

  describe('getOrCreateDefaultOrganization', () => {
    it('should return existing default organization if it exists', async () => {
      // Arrange
      const userId = 'user-123';
      const mockOrg = { 
        id: 'org-123', 
        name: 'Default Org',
        description: 'Default organization',
        logoUrl: null,
        website: null,
        createdById: 'user-123',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isActive: true
      };
      
      vi.mocked(organizationRepository.getDefaultOrganizationForUser).mockResolvedValue(mockOrg);

      // Act
      const result = await organizationService.getOrCreateDefaultOrganization(userId);

      // Assert
      expect(organizationRepository.getDefaultOrganizationForUser).toHaveBeenCalledWith(userId);
      expect(result).toEqual(mockOrg);
    });

    it('should create a default organization if none exists', async () => {
      // Arrange
      const userId = 'user-123';
      
      // Mock the repository implementation
      vi.mocked(organizationRepository.getDefaultOrganizationForUser).mockResolvedValue(null);
      vi.mocked(organizationRepository.createOrganization).mockResolvedValue({
        organization: {
          id: 'org-123',
          name: 'My Organization',
          description: 'Personal organization',
          createdById: 'user-123'
        },
        membership: {
          id: 'member-123',
          organizationId: 'org-123',
          userId: 'user-123',
          role: 'owner'
        }
      });

      // Act
      const result = await organizationService.getOrCreateDefaultOrganization(userId);

      // Assert
      expect(organizationRepository.getDefaultOrganizationForUser).toHaveBeenCalledWith(userId);
      expect(organizationRepository.createOrganization).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'My Organization',
          createdById: userId,
        })
      );
      expect(result).toEqual({
          id: 'org-123',
          name: 'My Organization',
          description: 'Personal organization',
          createdById: 'user-123'
      });
    });
  });

  describe('isOrganizationMember', () => {
    it('should return true if user is a member of the organization', async () => {
      // Arrange
      const organizationId = 'org-123';
      const userId = 'user-123';
      
      vi.mocked(organizationRepository.isOrganizationMember).mockResolvedValue(true);

      // Act
      const result = await organizationService.isOrganizationMember(organizationId, userId);

      // Assert
      expect(organizationRepository.isOrganizationMember).toHaveBeenCalledWith(organizationId, userId);
      expect(result).toBe(true);
    });

    it('should return false if user is not a member of the organization', async () => {
      // Arrange
      const organizationId = 'org-123';
      const userId = 'user-123';
      
      vi.mocked(organizationRepository.isOrganizationMember).mockResolvedValue(false);

      // Act
      const result = await organizationService.isOrganizationMember(organizationId, userId);

      // Assert
      expect(organizationRepository.isOrganizationMember).toHaveBeenCalledWith(organizationId, userId);
      expect(result).toBe(false);
    });
  });
});
