import Link from 'next/link'
import { redirect } from 'next/navigation'

import { getAuthenticatedUser } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'

import { ProfileForm } from './profile-form'

export default async function ProfilePage() {
  const user = await getAuthenticatedUser()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  })

  if (!dbUser) {
    redirect('/login')
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="mb-4 inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          ← ダッシュボードに戻る
        </Link>
        <h1 className="text-2xl font-bold">プロフィール設定</h1>
        <p className="mt-2 text-gray-600">アカウント情報を編集できます</p>
      </div>

      <div className="rounded-lg bg-white p-6 shadow-sm">
        <ProfileForm user={dbUser} />
      </div>
    </div>
  )
}
