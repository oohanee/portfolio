import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Category = {
  id: number
  name: string
  slug: string
  icon: string | null
  icon_active: string | null
}

export type Project = {
  id: number
  title: string
  slug: string
  category_id: number
  description: string | null
  tags: string[] | null
  tech_stack: string[] | null
  thumbnail: string | null
  screenshots: string[] | null
}