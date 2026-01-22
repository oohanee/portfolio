import { redirect } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default async function HomePage() {
  // Fetch kategori pertama
  const { data } = await supabase
    .from('categories')
    .select('slug')
    .order('id', { ascending: true })
    .limit(1)
    .single()

  // Redirect ke kategori pertama
  if (data) {
    redirect(`/${data.slug}`)
  }

  // Fallback jika tidak ada kategori
  redirect('/building-for-web')
}