import { redirect } from 'next/navigation'

import { Header } from '@/components/ui/header'
import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const user = await getAuthenticatedUser()

  // Prismaからユーザー情報を取得
  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header title="プロフィール設定" backHref="/dashboard" showLogout={true} />

      <div className="container mx-auto max-w-md px-4 py-8">
        <div className="rounded-lg bg-white p-6 shadow-sm">
          <ProfileForm user={dbUser} />
        </div>
      </div>
    </div>
  )
}
