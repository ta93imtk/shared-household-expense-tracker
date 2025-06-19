import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

import { InviteLink } from './invite-link'

interface GroupPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function GroupPage({ params }: GroupPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const group = await prisma.group.findFirst({
    where: {
      id: id,
      members: {
        some: {
          userId: user.id,
        },
      },
    },
    select: {
      id: true,
      name: true,
      inviteCode: true,
      createdBy: true,
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
      expenses: {
        include: {
          payer: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      },
    },
  })

  if (!group) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">{group.name}</h1>
        <p className="text-gray-600">
          作成者: {group.creator.name || group.creator.email} | メンバー: {group.members.length}人
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold">支出一覧</h2>
            <div className="flex gap-2">
              <Button asChild size="sm" variant="outline">
                <Link href={`/group/${group.id}/settle`}>精算を確認</Link>
              </Button>
              <Button asChild size="sm">
                <Link href={`/group/${group.id}/add`}>支出を追加</Link>
              </Button>
            </div>
          </div>
          {group.expenses.length === 0 ? (
            <div className="rounded-lg border border-dashed p-8 text-center">
              <p className="text-gray-500">まだ支出記録がありません</p>
              <p className="mt-1 text-sm text-gray-400">支出を追加して記録を始めましょう</p>
            </div>
          ) : (
            <div className="space-y-4">
              {group.expenses.map((expense) => (
                <div key={expense.id} className="rounded-lg border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{expense.description}</h3>
                      <p className="text-sm text-gray-600">
                        支払い: {expense.payer.name || expense.payer.email}
                      </p>
                      <p className="text-xs text-gray-400">
                        {expense.createdAt.toLocaleDateString()}
                      </p>
                    </div>
                    <p className="text-lg font-semibold">
                      ¥{expense.amount.toNumber().toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">メンバー</h2>

          {/* 招待リンクセクション */}
          <InviteLink inviteCode={group.inviteCode} />

          <div className="space-y-2">
            {group.members.map((member) => (
              <div key={member.userId} className="rounded-lg border p-3">
                <p className="font-medium">{member.user.name || member.user.email}</p>
                {member.userId === group.createdBy && (
                  <p className="text-xs text-gray-500">作成者</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
