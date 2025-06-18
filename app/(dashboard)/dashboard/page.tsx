import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold">ダッシュボード</h1>
      <p className="mt-4">ようこそ、{user.email}さん</p>
    </div>
  )
}