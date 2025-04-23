'use client';

import { useState } from 'react';
import { Button, toast } from '@rallyround/ui';
import { useRouter } from 'next/navigation';

interface TeamMember {
  id: string;
  teamId: string;
  userId: string;
  role: string;
  joinedAt: string;
  isActive: boolean;
  user: {
    id: string;
    fullName: string | null;
    email: string;
    avatarUrl: string | null;
  };
}

interface TeamMembersProps {
  members: TeamMember[];
  userRole: string;
  teamId: string;
}

export default function TeamMembers({ members, userRole, teamId }: TeamMembersProps) {
  const router = useRouter();
  const [loadingMemberId, setLoadingMemberId] = useState<string | null>(null);
  const isAdmin = userRole === 'owner' || userRole === 'admin';
  
  const handleRoleChange = async (memberId: string, userId: string, newRole: string) => {
    if (!isAdmin) return;
    
    setLoadingMemberId(memberId);
    
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update member role');
      }
      
      toast({
        title: 'Role updated',
        description: 'Member role has been updated successfully',
        variant: 'success',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error updating member role:', error);
      toast({
        title: 'Error',
        description: 'Failed to update member role',
        variant: 'destructive',
      });
    } finally {
      setLoadingMemberId(null);
    }
  };
  
  const handleRemoveMember = async (memberId: string, userId: string, memberName: string) => {
    if (!isAdmin) return;
    
    if (!confirm(`Are you sure you want to remove ${memberName} from the team?`)) {
      return;
    }
    
    setLoadingMemberId(memberId);
    
    try {
      const response = await fetch(`/api/teams/${teamId}/members/${userId}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove member');
      }
      
      toast({
        title: 'Member removed',
        description: `${memberName} has been removed from the team`,
        variant: 'success',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove member',
        variant: 'destructive',
      });
    } finally {
      setLoadingMemberId(null);
    }
  };
  
  if (members.length === 0) {
    return <p className="text-gray-500 text-sm">No members found.</p>;
  }
  
  return (
    <ul className="divide-y divide-gray-200">
      {members.map((member) => (
        <li key={member.id} className="py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                {member.user.avatarUrl ? (
                  <img
                    className="h-8 w-8 rounded-full"
                    src={member.user.avatarUrl}
                    alt={member.user.fullName || member.user.email}
                  />
                ) : (
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-sm font-medium text-gray-500">
                      {(member.user.fullName || member.user.email).substring(0, 1).toUpperCase()}
                    </span>
                  </div>
                )}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  {member.user.fullName || 'Unnamed User'}
                </p>
                <p className="text-xs text-gray-500">{member.user.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {isAdmin && member.userId !== member.user.id && (
                <div className="relative">
                  <select
                    className="block w-full pl-3 pr-10 py-1 text-xs border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 rounded-md"
                    value={member.role}
                    onChange={(e) => handleRoleChange(member.id, member.userId, e.target.value)}
                    disabled={loadingMemberId === member.id || member.role === 'owner'}
                  >
                    <option value="member">Member</option>
                    <option value="coach">Coach</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                    <option value="owner">Owner</option>
                  </select>
                </div>
              )}
              
              {!isAdmin && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                  {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                </span>
              )}
              
              {isAdmin && member.role !== 'owner' && member.userId !== member.user.id && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveMember(member.id, member.userId, member.user.fullName || member.user.email)}
                  disabled={loadingMemberId === member.id}
                >
                  {loadingMemberId === member.id ? 'Loading...' : 'Remove'}
                </Button>
              )}
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
