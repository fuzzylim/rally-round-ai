'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@rallyround/auth';
import { Button, Input } from '@rallyround/ui';

export default function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);

  return (
    <form className="space-y-6" onSubmit={e => e.preventDefault()}>
      {error && (
        <div className="bg-red-900/30 border-l-4 border-red-500 p-4 mb-4">
          <p className="text-sm text-red-300">{error}</p>
        </div>
      )}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-300">
          Full Name
        </label>
        <div className="mt-1">
          <Input
            id="fullName"
            name="fullName"
            type="text"
            autoComplete="name"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full"
            placeholder="Jane Smith"
          />
        </div>
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-300">
          Email
        </label>
        <div className="mt-1">
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div className="pt-2">
        <p className="text-center text-slate-400 text-sm">
          Sign up with a social account below.
        </p>
      </div>
    </form>
  );
}
