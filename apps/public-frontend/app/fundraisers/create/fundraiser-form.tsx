'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@rallyround/ui';

interface Team {
  id: string;
  name: string;
  type: string;
}

export default function FundraiserForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    goal: '',
    description: '',
    endDate: '',
    teamId: '',
  });
  
  // Simulated teams data - in a real app, this would be fetched from Supabase
  const teams: Team[] = [
    { id: '1', name: 'Eastside Tigers', type: 'Basketball' },
    { id: '2', name: 'Central High School', type: 'Athletics' },
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
      
      // Navigate to the fundraisers list page after creation
      router.push('/fundraisers');
      router.refresh();
    } catch (error) {
      console.error('Error creating fundraiser:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 shadow-sm rounded-lg">
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Fundraiser Title
        </label>
        <div className="mt-1">
          <Input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Team Equipment Fund"
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="goal" className="block text-sm font-medium text-gray-700">
          Fundraising Goal ($)
        </label>
        <div className="mt-1">
          <Input
            id="goal"
            name="goal"
            type="number"
            required
            value={formData.goal}
            onChange={handleChange}
            min="1"
            placeholder="5000"
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Describe what you're raising funds for and why it matters..."
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700">
          End Date
        </label>
        <div className="mt-1">
          <Input
            id="endDate"
            name="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={handleChange}
            className="w-full"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="teamId" className="block text-sm font-medium text-gray-700">
          Team
        </label>
        <div className="mt-1">
          <select
            id="teamId"
            name="teamId"
            value={formData.teamId}
            onChange={handleChange}
            className="shadow-sm block w-full sm:text-sm border-gray-300 rounded-md p-2 border"
            required
          >
            <option value="">Select a team</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name} ({team.type})
              </option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="flex items-center justify-end space-x-4">
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
          {isLoading ? 'Creating...' : 'Create Fundraiser'}
        </Button>
      </div>
    </form>
  );
}
