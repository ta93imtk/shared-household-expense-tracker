import { redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

import { CreateGroupForm } from './create-group-form'
import { GroupList } from './group-list'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

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
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">ダッシュボード</h1>
          <p className="mt-2 text-gray-600">ようこそ、{user.email}さん</p>
        </div>
        <form action="/auth/logout" method="post">
          <Button variant="outline" type="submit">
            ログアウト
          </Button>
        </form>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <div>
          <h2 className="text-xl font-semibold mb-4">新しいグループを作成</h2>
          <CreateGroupForm />
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">参加中のグループ</h2>
          <GroupList groups={groups} />
        </div>
      </div>
    </div>
  )
}