'use client'

import { useActionState } from 'react'

import { type User } from '@prisma/client'

import { type ProfileActionState, updateProfile } from '@/app/actions/profile'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ProfileFormProps {
  user: User
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [state, formAction, isPending] = useActionState(updateProfile, {} as ProfileActionState)

  return (
    <div>
      <h2 className="mb-6 text-lg font-semibold">プロフィール情報</h2>

      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-md bg-red-50 p-4">
            <p className="text-sm text-red-800">{state.error}</p>
          </div>
        )}

        {state.message && (
          <div className="rounded-md bg-green-50 p-4">
            <p className="text-sm text-green-800">{state.message}</p>
          </div>
        )}

        <div>
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            name="email"
            type="email"
            value={user.email}
            disabled
            className="mt-1 bg-gray-50"
          />
          <p className="mt-1 text-sm text-gray-500">メールアドレスは変更できません</p>
        </div>

        <div>
          <Label htmlFor="name">表示名</Label>
          <Input
            id="name"
            name="name"
            type="text"
            defaultValue={user.name || ''}
            placeholder="表示名を入力してください"
            className="mt-1"
          />
        </div>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? '更新中...' : 'プロフィールを更新'}
        </Button>
      </form>
    </div>
  )
}
