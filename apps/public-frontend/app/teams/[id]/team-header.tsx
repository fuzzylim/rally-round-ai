'use client';

import { useState } from 'react';
import { Button } from '@rallyround/ui';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface TeamHeaderProps {
  team: {
    id: string;
    name: string;
    description: string | null;
    sport: string;
    ageGroup: string;
    logoUrl: string | null;
  };
  userRole: string;
}

export default function TeamHeader({ team, userRole }: TeamHeaderProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isAdmin = userRole === 'owner' || userRole === 'admin';
  
  const handleLeaveTeam = async () => {
    if (!confirm('Are you sure you want to leave this team?')) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch(`/api/teams/${team.id}/members`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to leave team');
      }
      
      router.push('/teams');
      router.refresh();
    } catch (error) {
      console.error('Error leaving team:', error);
      alert('Failed to leave team. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="md:flex md:items-center md:justify-between md:space-x-5 p-6">
        <div className="flex items-start space-x-5">
          <div className="flex-shrink-0">
            <div className="relative">
              {team.logoUrl ? (
                <img
                  className="h-16 w-16 rounded-full object-cover"
                  src={team.logoUrl}
                  alt={`${team.name} logo`}
                />
              ) : (
                <div className="h-16 w-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-800">
                    {team.name.substring(0, 2)}
                  </span>
                </div>
              )}
              <span className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true" />
            </div>
          </div>
          <div className="pt-1.5">
            <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
            <div className="flex items-center mt-1 space-x-2">
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {team.sport}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                {team.ageGroup}
              </span>
              <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                {userRole.charAt(0).toUpperCase() + userRole.slice(1)}
              </span>
            </div>
            {team.description && (
              <p className="text-sm text-gray-500 mt-2">{team.description}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-3 sm:space-y-0 sm:space-x-reverse md:mt-0 md:flex-row md:space-x-3">
          {isAdmin && (
            <Link href={`/teams/${team.id}/edit`}>
              <Button variant="outline">Edit Team</Button>
            </Link>
          )}
          {userRole !== 'owner' && (
            <Button 
              variant="outline" 
              onClick={handleLeaveTeam}
              disabled={isLoading}
            >
              {isLoading ? 'Leaving...' : 'Leave Team'}
            </Button>
          )}
          <Link href={`/teams/${team.id}/events`}>
            <Button variant="outline">Events</Button>
          </Link>
          {isAdmin && (
            <Link href={`/teams/${team.id}/fundraising`}>
              <Button>Fundraising</Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
