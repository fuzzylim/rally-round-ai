'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../auth/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

// Define organization type
export type Organization = {
  id: string;
  name: string;
  logoUrl?: string;
  role: 'owner' | 'admin' | 'member';
};

// Define invitation type
export type OrganizationInvitation = {
  id: string;
  organizationId: string;
  organizationName: string;
  role: 'owner' | 'admin' | 'member';
  invitedBy: string;
  status: string;
};

// Define Supabase types for query results
type OrganizationRecord = {
  id: string;
  name: string;
  logo_url?: string;
};

type MemberOrgRecord = {
  id: string;
  role: string;
  organization: OrganizationRecord;
};

type InvitedByRecord = {
  id: string;
  name: string;
};

type InvitationRecord = {
  id: string;
  organization_id: string;
  role: string;
  status: string;
  invited_by: InvitedByRecord;
  organization: OrganizationRecord;
};

// Context type definition
type OrganizationContextType = {
  activeOrganization: Organization | null;
  organizations: Organization[];
  pendingInvitations: OrganizationInvitation[];
  loading: boolean;
  error: Error | null;
  switchOrganization: (orgId: string) => Promise<void>;
  acceptInvitation: (invitationId: string) => Promise<void>;
  declineInvitation: (invitationId: string) => Promise<void>;
  refreshOrganizations: () => Promise<void>;
};

// Create context with default values
const OrganizationContext = createContext<OrganizationContextType>({
  activeOrganization: null,
  organizations: [],
  pendingInvitations: [],
  loading: true,
  error: null,
  switchOrganization: async () => {},
  acceptInvitation: async () => {},
  declineInvitation: async () => {},
  refreshOrganizations: async () => {},
});

// Custom hook to use the organization context
export const useOrganization = () => useContext(OrganizationContext);

// Provider component
export function OrganizationProvider({ children }: { children: React.ReactNode }) {
  const [activeOrganization, setActiveOrganization] = useState<Organization | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [pendingInvitations, setPendingInvitations] = useState<OrganizationInvitation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const supabase = createClientComponentClient();
  
  // Function to fetch user's organizations and invitations
  const fetchUserOrganizations = async () => {
    if (!user) {
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Fetch organizations where user is a member
      const { data: memberOrgs, error: memberError } = await supabase
        .from('organization_members')
        .select(`
          id,
          role,
          organization:organization_id (
            id,
            name,
            logo_url
          )
        `)
        .eq('user_id', user.id)
        .eq('is_active', true);
      
      if (memberError) throw memberError;
      
      // Transform data into our Organization type
      const userOrgs: Organization[] = memberOrgs 
        ? (memberOrgs as any[]).map(item => ({
            id: item.organization?.id,
            name: item.organization?.name,
            logoUrl: item.organization?.logo_url,
            role: item.role as 'owner' | 'admin' | 'member',
          }))
        : [];
      
      setOrganizations(userOrgs);
      
      // Set active organization if we have one
      if (userOrgs.length > 0 && !activeOrganization) {
        // Get stored active org from localStorage if available
        const storedOrgId = typeof window !== 'undefined' 
          ? localStorage.getItem('activeOrganizationId') 
          : null;
          
        const defaultOrg = storedOrgId 
          ? userOrgs.find(org => org.id === storedOrgId) 
          : userOrgs[0];
          
        setActiveOrganization(defaultOrg || userOrgs[0]);
      }
      
      // Fetch pending invitations
      const { data: invitations, error: invitationsError } = await supabase
        .from('organization_invitations')
        .select(`
          id,
          organization_id,
          role,
          status,
          invited_by (
            id,
            name
          ),
          organization:organization_id (
            id,
            name
          )
        `)
        .eq('email', user.email)
        .eq('status', 'pending');
      
      if (invitationsError) throw invitationsError;
      
      // Transform invitation data
      const pendingInvites: OrganizationInvitation[] = invitations 
        ? (invitations as any[]).map(item => ({
            id: item.id,
            organizationId: item.organization_id,
            organizationName: item.organization?.name || 'Unknown Organization',
            role: item.role as 'owner' | 'admin' | 'member',
            invitedBy: item.invited_by?.name || 'Unknown User',
            status: item.status,
          }))
        : [];
      
      setPendingInvitations(pendingInvites);
      
    } catch (err) {
      console.error('Error fetching organizations:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Switch active organization
  const switchOrganization = async (orgId: string) => {
    try {
      const selectedOrg = organizations.find(org => org.id === orgId);
      if (!selectedOrg) {
        throw new Error('Organization not found');
      }
      
      setActiveOrganization(selectedOrg);
      localStorage.setItem('activeOrganizationId', selectedOrg.id);
      
      // Optional: Redirect to org-specific dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Error switching organization:', err);
      setError(err as Error);
    }
  };
  
  // Accept an invitation
  const acceptInvitation = async (invitationId: string) => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Find the invitation
      const invitation = pendingInvitations.find(inv => inv.id === invitationId);
      if (!invitation) {
        throw new Error('Invitation not found');
      }
      
      // Update invitation status
      const { error: updateError } = await supabase
        .from('organization_invitations')
        .update({ status: 'accepted' })
        .eq('id', invitationId);
      
      if (updateError) throw updateError;
      
      // Create organization membership
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: invitation.organizationId,
          user_id: user.id,
          role: invitation.role,
        });
      
      if (memberError) throw memberError;
      
      // Refresh organizations and invitations
      await fetchUserOrganizations();
      
    } catch (err) {
      console.error('Error accepting invitation:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Decline an invitation
  const declineInvitation = async (invitationId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      // Update invitation status
      const { error } = await supabase
        .from('organization_invitations')
        .update({ status: 'declined' })
        .eq('id', invitationId);
      
      if (error) throw error;
      
      // Remove invitation from state
      setPendingInvitations(pendingInvitations.filter(inv => inv.id !== invitationId));
      
    } catch (err) {
      console.error('Error declining invitation:', err);
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };
  
  // Function to manually refresh organizations
  const refreshOrganizations = async () => {
    await fetchUserOrganizations();
  };
  
  // Load organizations on initial mount and when user changes
  useEffect(() => {
    fetchUserOrganizations();
  }, [user?.id]);
  
  // Create the context value object
  const value = {
    activeOrganization,
    organizations,
    pendingInvitations,
    loading,
    error,
    switchOrganization,
    acceptInvitation,
    declineInvitation,
    refreshOrganizations,
  };
  
  return (
    <OrganizationContext.Provider value={value}>
      {children}
    </OrganizationContext.Provider>
  );
}
