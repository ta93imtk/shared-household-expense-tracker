import Link from 'next/link'
import { notFound } from 'next/navigation'

import { getAuthenticatedUser } from '@/app/actions/auth'
import { calculateSettlements } from '@/lib/calculate-settlements'
import { prisma } from '@/lib/prisma'

interface SettlePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function SettlePage({ params }: SettlePageProps) {
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
    include: {
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
        select: {
          paidBy: true,
          amount: true,
        },
      },
    },
  })

  if (!group) {
    notFound()
  }

  const { balances, settlements } = calculateSettlements(
    group.expenses.map((e) => ({
      paidBy: e.paidBy,
      amount: e.amount.toNumber(),
    })),
    group.members,
  )

  const totalExpenses = group.expenses.reduce((sum, expense) => sum + expense.amount.toNumber(), 0)

  return (
    <div className="container mx-auto max-w-4xl py-8">
      <div className="mb-8">
        <Link href={`/group/${group.id}`} className="text-sm text-blue-600 hover:text-blue-500">
          ← {group.name}に戻る
        </Link>
        <h1 className="mt-2 text-3xl font-bold">精算結果</h1>
      </div>

      {group.expenses.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="text-gray-500">まだ支出記録がありません</p>
          <p className="mt-1 text-sm text-gray-400">支出を追加してから精算結果を確認してください</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* サマリー */}
          <div className="rounded-lg bg-gray-50 p-6">
            <h2 className="mb-4 text-lg font-semibold">サマリー</h2>
            <div className="grid gap-4 md:grid-cols-3">
              <div>
                <p className="text-sm text-gray-600">総支出額</p>
                <p className="text-2xl font-bold">¥{totalExpenses.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">メンバー数</p>
                <p className="text-2xl font-bold">{group.members.length}人</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">一人当たり</p>
                <p className="text-2xl font-bold">
                  ¥{Math.round(totalExpenses / group.members.length).toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* 各メンバーの支払い状況 */}
          <div>
            <h2 className="mb-4 text-lg font-semibold">各メンバーの支払い状況</h2>
            <div className="space-y-3">
              {balances.map((balance) => (
                <div key={balance.userId} className="rounded-lg border p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">{balance.userName}</p>
                      <p className="text-sm text-gray-600">
                        支払い済み: ¥{balance.totalPaid.toLocaleString()} / 負担額: ¥
                        {Math.round(balance.shouldPay).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {balance.balance > 0 ? (
                        <p className="font-semibold text-green-600">
                          +¥{Math.round(balance.balance).toLocaleString()}
                          <span className="block text-sm">受け取る</span>
                        </p>
                      ) : balance.balance < 0 ? (
                        <p className="font-semibold text-red-600">
                          -¥{Math.round(-balance.balance).toLocaleString()}
                          <span className="block text-sm">支払う</span>
                        </p>
                      ) : (
                        <p className="font-semibold text-gray-500">
                          ±¥0
                          <span className="block text-sm">精算済み</span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 精算方法 */}
          {settlements.length > 0 && (
            <div>
              <h2 className="mb-4 text-lg font-semibold">精算方法</h2>
              <div className="space-y-3">
                {settlements.map((settlement, index) => (
                  <div key={index} className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <p className="font-medium">{settlement.fromUserName}</p>
                        <span className="text-gray-500">→</span>
                        <p className="font-medium">{settlement.toUserName}</p>
                      </div>
                      <p className="text-lg font-semibold text-blue-600">
                        ¥{settlement.amount.toLocaleString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
