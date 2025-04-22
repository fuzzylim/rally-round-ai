import { createClient } from '@supabase/supabase-js'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { type CookieOptions } from '@supabase/auth-helpers-nextjs'
import type { Database } from './database.types'

// Supabase project credentials
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

// Cookie configuration for increased security
export const cookieOptions: CookieOptions = {
  name: 'sb-auth-token',
  lifetime: 60 * 60 * 8, // 8 hours
  domain: process.env.NEXT_PUBLIC_COOKIE_DOMAIN || undefined,
  path: '/',
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
}

// Default client for browser-only code (client components)
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
  },
})

// For client components with cookie-based auth
export const createBrowserClient = () => {
  return createClientComponentClient<Database>({
    supabaseUrl,
    supabaseKey: supabaseAnonKey,
    options: {
      auth: {
        flowType: 'pkce',
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
      cookies: {
        ...cookieOptions,
      }
    }
  })
}

// For server components
export const createServerClient = (cookies: any) => {
  return createServerComponentClient<Database>({
    cookies,
    options: {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      cookies: {
        ...cookieOptions,
      }
    }
  })
}

// For middleware (compatible with previous code)
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
          // Note: In middleware we can't set cookies directly here
          // The auth helpers handle this automatically
        },
        removeItem: (key) => {
          console.log('🗑️ [Server Auth] Removing cookie:', key);
          // Note: In middleware we can't remove cookies directly here
          // The auth helpers handle this automatically
        },
      },
    },
  });
}
