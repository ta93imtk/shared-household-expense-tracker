'use client'

import { useActionState } from 'react'

import { type ExpenseActionState, createExpense } from '@/app/actions/expenses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface ExpenseFormProps {
  groupId: string
}

export function ExpenseForm({ groupId }: ExpenseFormProps) {
  const createExpenseWithGroupId = createExpense.bind(null, groupId)
  const [state, formAction, isPending] = useActionState(
    createExpenseWithGroupId,
    {} as ExpenseActionState,
  )

  return (
    <form action={formAction} className="space-y-6">
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
        <Label htmlFor="description">支出内容</Label>
        <Input
          id="description"
          name="description"
          type="text"
          required
          placeholder="例: 食料品の買い物"
          className="mt-1"
        />
      </div>

      <div>
        <Label htmlFor="amount">金額（円）</Label>
        <Input
          id="amount"
          name="amount"
          type="number"
          required
          min="1"
          step="1"
          placeholder="例: 3500"
          className="mt-1"
        />
      </div>

      <div className="flex gap-4">
        <Button type="submit" disabled={isPending}>
          {isPending ? '記録中...' : '支出を記録'}
        </Button>
      </div>
    </form>
  )
}
