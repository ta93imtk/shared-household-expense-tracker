'use server'

import { revalidatePath } from 'next/cache'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export type ProfileActionState = {
  error?: string
  message?: string
}

export async function updateProfile(
  _prevState: ProfileActionState,
  formData: FormData,
): Promise<ProfileActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const name = formData.get('name') as string

  if (!name || name.trim().length === 0) {
    return { error: '表示名を入力してください' }
  }

  try {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        name: name.trim(),
      },
    })

    revalidatePath('/profile')

    return { message: 'プロフィールを更新しました' }
  } catch (error) {
    console.error('プロフィール更新エラー:', error)

    return { error: 'プロフィールの更新に失敗しました' }
  }
}
