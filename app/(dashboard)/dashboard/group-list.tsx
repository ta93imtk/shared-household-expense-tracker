import Link from 'next/link'

import { Button } from '@/components/ui/button'

type GroupWithDetails = {
  id: string
  name: string
  createdAt: Date
  creator: {
    name: string | null
    email: string
  }
  members: Array<{
    user: {
      name: string | null
      email: string
    }
  }>
  _count: {
    expenses: number
  }
}

interface GroupListProps {
  groups: GroupWithDetails[]
}

export function GroupList({ groups }: GroupListProps) {
  if (groups.length === 0) {
    return (
      <div className="rounded-lg border border-dashed p-8 text-center">
        <p className="text-gray-500">まだグループがありません</p>
        <p className="text-sm text-gray-400 mt-1">新しいグループを作成して始めましょう</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {groups.map((group) => (
        <div key={group.id} className="rounded-lg border p-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">{group.name}</h3>
              <p className="text-sm text-gray-600">
                メンバー: {group.members.length}人 | 支出記録: {group._count.expenses}件
              </p>
              <p className="text-xs text-gray-400 mt-1">
                作成者: {group.creator.name || group.creator.email}
              </p>
            </div>
            <Button asChild size="sm">
              <Link href={`/group/${group.id}`}>詳細を見る</Link>
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}