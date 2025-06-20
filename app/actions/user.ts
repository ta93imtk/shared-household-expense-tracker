'use server'

import { getAuthenticatedUser } from '@/app/actions/auth'
import { prisma } from '@/lib/prisma'

export async function getUser() {
  const user = await getAuthenticatedUser()

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { name: true, email: true },
  })

  return dbUser
}
