'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@rallyround/ui';

interface Organization {
  id: string;
  name: string;
}

export default function TeamForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sport: '',
    ageGroup: '',
    organizationId: '',
    description: '',
  });
  
  // Simulated organizations data - in a real app, this would be fetched from Supabase
  const organizations: Organization[] = [
    { id: '1', name: 'Eastside Community Center' },
    { id: '2', name: 'Central High School' },
    { id: '3', name: 'Metro Youth Sports Association' },
  ];
  
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
    
    try {
      // Simulated API call - in a real app, this would send data to Supabase
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Navigate to the teams list page after creation
      router.push('/teams');
      router.refresh();
    } catch (error) {
      console.error('Error creating team:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-sm rounded-lg">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
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
            className="w-full"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label htmlFor="sport" className="block text-sm font-medium text-gray-700">
            Sport
          </label>
          <div className="mt-1">
            <select
              id="sport"
              name="sport"
              value={formData.sport}
              onChange={handleChange}
              className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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
          <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700">
            Age Group
          </label>
          <div className="mt-1">
            <select
              id="ageGroup"
              name="ageGroup"
              value={formData.ageGroup}
              onChange={handleChange}
              className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
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
        <label htmlFor="organizationId" className="block text-sm font-medium text-gray-700">
          Organization
        </label>
        <div className="mt-1">
          <select
            id="organizationId"
            name="organizationId"
            value={formData.organizationId}
            onChange={handleChange}
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            required
          >
            <option value="">Select an organization</option>
            {organizations.map((org) => (
              <option key={org.id} value={org.id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
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
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Team'}
        </Button>
      </div>
    </form>
  );
}
