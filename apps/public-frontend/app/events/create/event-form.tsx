'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input } from '@rallyround/ui';

interface Club {
  id: string;
  name: string;
  type: string;
}

export default function EventForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    date: '',
    location: '',
    description: '',
    endTime: '',
    clubId: '',
  });
  
  // Simulated clubs data - in a real app, this would be fetched from Supabase
  const clubs: Club[] = [
    { id: '1', name: 'Inner City Book Club', type: 'Literary' },
    { id: '2', name: 'Urban Bushwalkers', type: 'Outdoor' },
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
      
      // Navigate to the events list page after creation
      router.push('/events');
      router.refresh();
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-slate-800/70 backdrop-blur-md p-6 shadow-md rounded-lg border border-slate-700">
      <div className="mb-2 pb-2 border-b border-slate-700">
        <p className="text-slate-300 text-sm">Quick set-up, more time for the real thing — spend 2 minutes here, hours with your mates.</p>
      </div>
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-white">
          What's On?
        </label>
        <div className="mt-1">
          <Input
            id="title"
            name="title"
            type="text"
            required
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g. Book Club Catchup"
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="date" className="block text-sm font-medium text-white">
          Event Date
        </label>
        <div className="mt-1">
          <Input
            id="date"
            name="date"
            type="date"
            required
            value={formData.date}
            onChange={handleChange}
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-white">
          Location
        </label>
        <div className="mt-1">
          <Input
            id="location"
            name="location"
            type="text"
            required
            value={formData.location}
            onChange={handleChange}
            placeholder="e.g. Local Pub, Back Room"
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-white">
          Description
        </label>
        <div className="mt-1">
          <textarea
            id="description"
            name="description"
            rows={4}
            value={formData.description}
            onChange={handleChange}
            placeholder="Quick description, what to bring, what to expect... keep it simple, mate!"
            className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 border"
            required
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="endTime" className="block text-sm font-medium text-white">
          End Time
        </label>
        <div className="mt-1">
          <Input
            id="endTime"
            name="endTime"
            type="time"
            required
            value={formData.endTime}
            onChange={handleChange}
            className="w-full bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
      
      <div>
        <label htmlFor="clubId" className="block text-sm font-medium text-white">
          Club
        </label>
        <div className="mt-1">
          <select
            id="clubId"
            name="clubId"
            value={formData.clubId}
            onChange={handleChange}
            className="shadow-sm block w-full sm:text-sm bg-slate-900/50 text-white border-slate-600 focus:border-blue-500 focus:ring-blue-500 rounded-md p-2 border"
            required
          >
            <option value="">Select a club</option>
            {clubs.map((club) => (
              <option key={club.id} value={club.id}>
                {club.name} ({club.type})
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
          className="border-slate-600 text-slate-200 hover:bg-slate-700"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
        >
          {isLoading ? 'Setting up...' : 'Done & Dusted'}
        </Button>
      </div>
    </form>
  );
}
