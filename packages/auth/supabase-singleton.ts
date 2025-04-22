import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    `Missing required environment variables:\n${[
      !supabaseUrl && '- NEXT_PUBLIC_SUPABASE_URL',
      !supabaseAnonKey && '- NEXT_PUBLIC_SUPABASE_ANON_KEY',
    ].filter(Boolean).join('\n')}`
  )
}

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

// For server-side usage (e.g. in middleware)
export const createServerSupabase = (cookieStore?: {
  get: (name: string) => { value: string } | undefined
}) => {
  return createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
      flowType: 'pkce',
      storage: {
        getItem: (key) => {
          console.log('🔍 [Server Auth] Getting cookie:', key);
          const value = cookieStore?.get(key)?.value;
          console.log('📦 [Server Auth] Cookie value:', value ? '(exists)' : '(not found)');
          return value ?? null;
        },
        setItem: (key, value) => {
          console.log('💾 [Server Auth] Setting cookie:', key);
        },
        removeItem: (key) => {
          console.log('🗑️ [Server Auth] Removing cookie:', key);
        },
      },
    },
  });
}
