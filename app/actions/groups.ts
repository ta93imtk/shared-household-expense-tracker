'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { prisma } from '@/lib/prisma'
import { createClient } from '@/lib/supabase/server'

export type GroupActionState = {
  error?: string
  message?: string
}

export async function createGroup(
  _prevState: GroupActionState,
  formData: FormData,
): Promise<GroupActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  const name = formData.get('name') as string

  if (!name || name.trim().length === 0) {
    return { error: 'グループ名を入力してください' }
  }

  try {
    const group = await prisma.group.create({
      data: {
        name: name.trim(),
        createdBy: user.id,
        members: {
          create: {
            userId: user.id,
          },
        },
      },
    })

    revalidatePath('/dashboard')
    redirect(`/group/${group.id}`)
  } catch (error) {
    console.error('グループ作成エラー:', error)

    return { error: 'グループの作成に失敗しました' }
  }
}

export async function joinGroup(groupId: string): Promise<GroupActionState> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'ログインが必要です' }
  }

  try {
    // すでにメンバーかチェック
    const existingMember = await prisma.groupMember.findFirst({
      where: {
        groupId: groupId,
        userId: user.id,
      },
    })

    if (existingMember) {
      redirect(`/group/${groupId}`)
    }

    // グループに参加
    await prisma.groupMember.create({
      data: {
        groupId: groupId,
        userId: user.id,
      },
    })

    revalidatePath('/dashboard')
    redirect(`/group/${groupId}`)
  } catch (error) {
    console.error('グループ参加エラー:', error)

    return { error: 'グループへの参加に失敗しました' }
  }
}

export async function isGroupMember(groupId: string): Promise<boolean> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return false
  }

  const member = await prisma.groupMember.findFirst({
    where: {
      groupId: groupId,
      userId: user.id,
    },
  })

  return !!member
}
