'use client'

import { useActionState } from 'react'

import { type GroupActionState, createGroup } from '@/app/actions/groups'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function CreateGroupForm() {
  const [state, formAction, isPending] = useActionState(createGroup, {} as GroupActionState)

  return (
    <div className="rounded-lg border p-6">
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{state.error}</p>
          </div>
        )}

        <div>
          <Label htmlFor="name">グループ名</Label>
          <Input
            id="name"
            name="name"
            type="text"
            required
            placeholder="例: 田中家の家計"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? '作成中...' : 'グループを作成'}
        </Button>
      </form>
    </div>
  )
}
