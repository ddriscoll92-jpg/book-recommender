import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL || ''
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Strip any trailing slash or path
const supabaseUrl = rawUrl.replace(/\/+$/, '').replace(/\/rest\/v1\/?$/, '')
const supabaseAnonKey = rawKey.trim()

console.log('Supabase URL:', supabaseUrl)
console.log('Key starts with:', supabaseAnonKey.substring(0, 20))

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
