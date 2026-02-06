import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

// Create a mock client for build time / demo mode when env vars are not set
const createSupabaseClient = (): SupabaseClient => {
  if (!supabaseUrl || supabaseUrl.includes('placeholder') || !supabaseAnonKey || supabaseAnonKey.includes('placeholder')) {
    // Return a dummy client that won't make real requests
    // This allows the build to succeed without real credentials
    return createClient('https://placeholder.supabase.co', 'placeholder-anon-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
      global: {
        fetch: () => Promise.resolve(new Response(JSON.stringify({ data: null, error: null }), { status: 200 })),
      },
    })
  }
  return createClient(supabaseUrl, supabaseAnonKey)
}

export const supabase = createSupabaseClient()

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl !== '' &&
    !supabaseUrl.includes('placeholder') &&
    supabaseAnonKey &&
    supabaseAnonKey !== '' &&
    !supabaseAnonKey.includes('placeholder')
  )
}
