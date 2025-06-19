import { redirect } from 'next/navigation'

import { Header } from '@/components/ui/header'
import { createClient } from '@/lib/supabase/server'

export default async function JoinLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Header 
        title="グループに参加" 
        backHref="/dashboard"
        backLabel="ダッシュボード"
        showLogout 
      />
      <main>{children}</main>
    </>
  )
}