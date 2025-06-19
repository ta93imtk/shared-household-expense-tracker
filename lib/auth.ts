import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabase/server'

/**
 * 認証済みユーザーを取得する
 * 未認証の場合はログインページにリダイレクト
 */
export async function getAuthenticatedUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return user
}