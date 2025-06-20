import { getAuthenticatedUser } from '@/app/actions/auth'
import { Header } from '@/components/ui/header'

export default async function JoinLayout({ children }: { children: React.ReactNode }) {
  // ログインチェックのため、値は受け取らない
  await getAuthenticatedUser()

  return (
    <>
      <Header title="グループに参加" backHref="/dashboard" backLabel="ダッシュボード" showLogout />
      <main>{children}</main>
    </>
  )
}
