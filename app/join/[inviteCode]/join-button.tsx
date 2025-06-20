'use client'

import { useActionState } from 'react'

import { joinGroup } from '@/app/actions/groups'
import { Button } from '@/components/ui/button'

interface JoinButtonProps {
  groupId: string
}

export function JoinButton({ groupId }: JoinButtonProps) {
  const joinGroupWithId = joinGroup.bind(null, groupId)
  const [state, formAction, isPending] = useActionState(joinGroupWithId, {})

  return (
    <form action={formAction}>
      {state.error && (
        <div className="mb-4 rounded-md bg-red-50 p-4">
          <p className="text-sm text-red-800">{state.error}</p>
        </div>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? '参加中...' : 'グループに参加'}
      </Button>
    </form>
  )
}
