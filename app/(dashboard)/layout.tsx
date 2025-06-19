import { redirect } from 'next/navigation'

import { Header } from '@/components/ui/header'
import { createClient } from '@/lib/supabase/server'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <>
      <Header title="家計共有アプリ" showLogout showProfile />
      <main>{children}</main>
    </>
  )
}
