'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, useToast } from '@rallyround/ui';
import { useAnalytics } from '../../hooks/use-analytics';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface Organization {
  id: string;
  name: string;
  description?: string | null;
}

interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
}

export default function TeamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { trackEvent } = useAnalytics();
  const { toast } = useToast();
  const supabase = createClientComponentClient();
  
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [loadingOrgs, setLoadingOrgs] = useState(true);
  
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    ageGroup: '',
    description: '',
    logoUrl: '',
    organizationId: '',
  });
  
  // Load user profile and organizations on component mount
  useEffect(() => {
    async function loadUserData() {
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;
        
        // Get user profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        setUserProfile(profile);
        
        // Fetch organizations the user belongs to
        const response = await fetch('/api/organizations/user');
        if (response.ok) {
          const orgs = await response.json();
          setOrganizations(orgs);
          
          // If user has organizations, set the first one as default
          if (orgs.length > 0) {
            setFormData(prev => ({
              ...prev,
              organizationId: orgs[0].id
            }));
          } else {
            // If no organizations, create one with user's name
            await createDefaultOrganization(user.id, profile?.full_name || user.email);
          }
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoadingOrgs(false);
      }
    }
    
    loadUserData();
  }, [supabase]);
  
  // Create a default organization for the user if they don't have one
  async function createDefaultOrganization(userId: string, userName: string) {
    try {
      const orgName = `${userName}'s Organization`;
      const response = await fetch('/api/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: orgName,
          description: `Default organization for ${userName}`
        })
      });
      
      if (response.ok) {
        const newOrg = await response.json();
        setOrganizations([newOrg]);
        setFormData(prev => ({
          ...prev,
          organizationId: newOrg.id
        }));
        
        toast({
          title: 'Organization Created',
          description: `Created "${orgName}" for your teams`,
          variant: 'default',
        });
      }
    } catch (error) {
      console.error('Error creating default organization:', error);
    }
  }
  
  // Sports options
  const sportOptions = [
    'Basketball',
    'Soccer',
    'Football',
    'Baseball',
    'Volleyball',
    'Swimming',
    'Athletics',
    'Tennis',
    'Golf',
    'Hockey',
    'Other'
  ];
  
  // Age group options
  const ageGroupOptions = [
    'U8',
    'U10',
    'U12',
    'U14',
    'U16',
    'U18',
    'Varsity',
    'Junior Varsity',
    'Adult',
    'Senior',
    'All Ages'
  ];
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    // Validate organization selection
    if (!formData.organizationId) {
      setError('Please select an organization for this team');
      setIsLoading(false);
      toast({
        title: 'Missing Organization',
        description: 'Please select an organization for this team',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Create the team using the team service API
      const response = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Include organization ID in the request
          organizationId: formData.organizationId,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create team');
      }
      
      // Track team creation event
      trackEvent('team_created', {
        teamName: formData.name,
        teamSport: formData.sport,
        organizationId: formData.organizationId,
      });
      
      toast({
        title: 'Success!',
        description: 'Your team has been created.',
        variant: 'success',
      });
      
      // Navigate to the teams list page after creation
      router.push('/teams');
      router.refresh();
    } catch (error) {
      console.error('Error creating team:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to create team',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (loadingOrgs) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/70 backdrop-blur-md p-6 shadow-md rounded-lg border border-slate-700">
      {/* Organization Selection */}
      <div>
        <label htmlFor="organizationId" className="block text-sm font-medium text-white">
          Organization
        </label>
        <div className="mt-1">
          <select
            id="organizationId"
            name="organizationId"
            value={formData.organizationId}
            onChange={handleChange}
            className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 rounded-md p-2 border focus:border-blue-500 focus:ring-blue-500"
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-slate-400">Teams must belong to an organization</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-white">
          Team Name
        </label>
        <div className="mt-1">
          <Input
            id="name"
            name="name"
            type="text"
            required
            value={formData.name}
            onChange={handleChange}
            placeholder="e.g. Eastside Tigers"
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-white">
            Sport
          </label>
          <div className="mt-1">
            <select
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 rounded-md p-2 border focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select a sport</option>
              {sportOptions.map((sport) => (
                <option key={sport} value={sport}>
                  {sport}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="ageGroup" className="block text-sm font-medium text-white">
            Age Group
          </label>
          <div className="mt-1">
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 rounded-md p-2 border focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Select an age group</option>
              {ageGroupOptions.map((ageGroup) => (
                <option key={ageGroup} value={ageGroup}>
                  {ageGroup}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      
      <div>
        <label htmlFor="logoUrl" className="block text-sm font-medium text-white">
          Team Logo URL
        </label>
        <div className="mt-1">
          <Input
            id="logoUrl"
            name="logoUrl"
            type="text"
            value={formData.logoUrl}
            onChange={handleChange}
            placeholder="https://example.com/logo.png"
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-slate-400">Optional: URL to your team's logo image</p>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Team Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Add information about your team, its goals, and any other relevant details..."
            className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 rounded-md p-2 border focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          className="border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          {isLoading ? 'Creating...' : 'Create Team'}
        </Button>
      </div>
    </form>
  );
}
