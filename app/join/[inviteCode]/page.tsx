import { redirect } from 'next/navigation'

import { getAuthenticatedUser } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'

import { JoinButton } from './join-button'

interface JoinPageProps {
  params: Promise<{
    inviteCode: string
  }>
}

export default async function JoinPage({ params }: JoinPageProps) {
  const { inviteCode } = await params
  const user = await getAuthenticatedUser()

  const group = await prisma.group.findUnique({
    where: {
      inviteCode: inviteCode,
    },
    include: {
      creator: {
        select: {
          name: true,
          email: true,
        },
      },
      members: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
  })

  if (!group) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">招待リンクが無効です</h1>
          <p className="mt-2 text-gray-600">リンクが間違っているか、グループが存在しません</p>
        </div>
      </div>
    )
  }

  // すでにメンバーの場合
  const isMember = group.members.some((member) => member.user.id === user.id)

  if (isMember) {
    redirect(`/group/${group.id}`)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow">
        <div className="text-center">
          <h1 className="text-3xl font-bold">グループに参加</h1>
          <p className="mt-2 text-gray-600">以下のグループに招待されています</p>
        </div>

        <div className="rounded-lg bg-gray-50 p-6">
          <h2 className="text-xl font-semibold">{group.name}</h2>
          <p className="mt-1 text-sm text-gray-600">
            作成者: {group.creator.name || group.creator.email}
          </p>
          <p className="mt-1 text-sm text-gray-600">現在のメンバー: {group.members.length}人</p>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">メンバー</h3>
          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.userId} className="rounded border p-2 text-sm">
                {member.user.name || member.user.email}
                {member.userId === group.createdBy && (
                  <span className="ml-2 text-xs text-gray-500">(作成者)</span>
                )}
              </div>
            ))}
          </div>
        </div>

        <JoinButton groupId={group.id} />
      </div>
    </div>
  )
}
