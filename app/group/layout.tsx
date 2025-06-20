import { getAuthenticatedUser } from '@/app/actions/auth'
import { Header } from '@/components/ui/header'

export default async function GroupLayout({ children }: { children: React.ReactNode }) {
  // ログインチェックのため、値は受け取らない
  await getAuthenticatedUser()

  return (
    <>
      <Header title="家計共有アプリ" backHref="/dashboard" backLabel="ダッシュボード" showLogout />
      <main>{children}</main>
    </>
  )
}
