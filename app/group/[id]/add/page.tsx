import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getAuthenticatedUser } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

import { ExpenseForm } from './expense-form'

interface AddExpensePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function AddExpensePage({ params }: AddExpensePageProps) {
  const { id } = await params
  const user = await getAuthenticatedUser()

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
    },
  })

  if (!group) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8 max-w-2xl">
      <div className="mb-8">
        <Link
          href={`/group/${group.id}`}
          className="text-blue-600 hover:text-blue-500 text-sm"
        >
          ← {group.name}に戻る
        </Link>
        <h1 className="text-3xl font-bold mt-2">支出を追加</h1>
      </div>

      <ExpenseForm groupId={group.id} />
    </div>
  )
}