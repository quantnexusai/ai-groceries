import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabasePublishableKey)

export const isSupabaseConfigured = () => {
  return (
    supabaseUrl &&
    supabaseUrl !== '' &&
    !supabaseUrl.includes('placeholder') &&
    supabasePublishableKey &&
    supabasePublishableKey !== '' &&
    !supabasePublishableKey.includes('placeholder')
  )
}
