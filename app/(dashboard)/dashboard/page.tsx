import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { CreateGroupForm } from './create-group-form'
import { GroupList } from './group-list'

export default async function DashboardPage() {
  const user = await getAuthenticatedUser()

  const groups = await prisma.group.findMany({
    where: {
      members: {
        some: {
          userId: user.id,
        },
      },
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
              name: true,
              email: true,
            },
          },
        },
      },
      _count: {
        select: {
          expenses: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">ダッシュボード</h1>
        <p className="mt-2 text-gray-600">ようこそ、{user.email}さん</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="mb-4 text-xl font-semibold">新しいグループを作成</h2>
          <CreateGroupForm />
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">参加中のグループ</h2>
          <GroupList groups={groups} />
        </div>
      </div>
    </div>
  )
}
