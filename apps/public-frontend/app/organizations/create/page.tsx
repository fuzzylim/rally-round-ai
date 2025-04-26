'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useAuth } from '../../components/auth/AuthProvider';
import { useOrganization } from '../../components/organization/OrganizationProvider';
import { Button } from '@rallyround/ui';

export default function CreateOrganizationPage() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();
  const { user } = useAuth();
  const { refreshOrganizations } = useOrganization();
  const supabase = createClientComponentClient();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      setError('You must be logged in to create an organization');
      return;
    }
    
    if (!name.trim()) {
      setError('Organization name is required');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Create the organization
      const { data: org, error: orgError } = await supabase
        .from('organizations')
        .insert({
          name,
          description: description || null,
          created_by_id: user.id,
        })
        .select('id')
        .single();
      
      if (orgError) throw orgError;
      
      // Add the user as an owner of the organization
      const { error: memberError } = await supabase
        .from('organization_members')
        .insert({
          organization_id: org.id,
          user_id: user.id,
          role: 'owner',
        });
      
      if (memberError) throw memberError;
      
      // Refresh organizations in context
      await refreshOrganizations();
      
      // Redirect to dashboard
      router.push('/dashboard');
      
    } catch (err: any) {
      console.error('Error creating organization:', err);
      setError(err.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-slate-950">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-8">Create Your Organization</h1>
          
          <div className="bg-slate-800/70 backdrop-blur-md p-6 shadow-md rounded-lg border border-slate-700">
            {error && (
              <div className="mb-4 p-3 bg-red-900/50 border border-red-800 rounded-md text-sm text-red-200">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-sm font-medium text-white mb-1">
                  Organization Name*
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  placeholder="Enter your organization's name"
                  required
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description <span className="text-slate-400">(optional)</span>
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md shadow-sm"
                  placeholder="Briefly describe your organization"
                />
                <p className="mt-1 text-xs text-slate-400">
                  Give a short description of your club, team, or organization.
                </p>
              </div>
              
              <div className="flex justify-end">
                <Button
                  type="button"
                  variant="outline"
                  className="mr-3 border-slate-600 text-slate-200 hover:bg-slate-700"
                  onClick={() => router.back()}
                  disabled={loading}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Organization'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
