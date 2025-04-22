import { createClient } from '@supabase/supabase-js'
import { Database } from './database.types'

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

export const createSupabaseClient = () => {
  return createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        flowType: 'pkce',
      },
    }
  )
}

// Create a singleton instance for the browser
export const supabase = createSupabaseClient()
