'use client';

import { useState } from 'react';
import { Button, Input, toast as importedToast } from '@rallyround/ui';
const toast = importedToast ?? ((...args: any[]) => { console.error('Toast function is not defined!', ...args); });
import { useRouter } from 'next/navigation';
import { useAnalytics } from '../../hooks/use-analytics';

interface InviteMemberProps {
  teamId: string;
}

export default function InviteMember({ teamId }: InviteMemberProps) {
  const router = useRouter();
  const { trackEvent } = useAnalytics();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'member',
    message: '',
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/teams/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          teamId,
          ...formData,
        }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to send invitation');
      }
      
      // Track invitation event
      trackEvent('team_member_invited', {
        teamId,
        role: formData.role,
      });
      
      toast({
        title: 'Invitation sent',
        description: `Invitation has been sent to ${formData.email}`,
        variant: 'success',
      });
      
      // Reset form
      setFormData({
        email: '',
        role: 'member',
        message: '',
      });
      
      router.refresh();
    } catch (error) {
      console.error('Error sending invitation:', error);
      
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send invitation',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email Address
        </label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter email address"
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <div className="mt-1">
          <select
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            required
          >
            <option value="member">Member</option>
            <option value="coach">Coach</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700">
          Message (Optional)
        </label>
        <div className="mt-1">
          <textarea
            id="message"
            name="message"
            rows={3}
            value={formData.message}
            onChange={handleChange}
            placeholder="Add a personal message to the invitation"
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          />
        </div>
      </div>
      
      <div>
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full"
        >
          {isLoading ? 'Sending...' : 'Send Invitation'}
        </Button>
      </div>
    </form>
  );
}
