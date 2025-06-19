'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export type ExpenseActionState = {
  error?: string
  message?: string
}

export async function createExpense(
  groupId: string,
  _prevState: ExpenseActionState,
  formData: FormData
): Promise<ExpenseActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  // グループのメンバーかチェック
  const member = await prisma.groupMember.findFirst({
    where: {
      groupId: groupId,
      userId: user.id,
    },
  })

  if (!member) {
    return { error: 'このグループのメンバーではありません' }
  }

  const amount = formData.get('amount') as string
  const description = formData.get('description') as string

  if (!amount || !description) {
    return { error: 'すべての項目を入力してください' }
  }

  const parsedAmount = parseFloat(amount)

  if (isNaN(parsedAmount) || parsedAmount <= 0) {
    return { error: '金額は正の数値を入力してください' }
  }

  try {
    await prisma.expense.create({
      data: {
        groupId: groupId,
        paidBy: user.id,
        amount: parsedAmount,
        description: description.trim(),
      },
    })

    revalidatePath(`/group/${groupId}`)

    return { message: '支出を記録しました' }
  } catch (error) {
    console.error('支出記録エラー:', error)

    return { error: '支出の記録に失敗しました' }
  }
}